// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { db, Timestamp } from "../../../../lib/firebaseAdmin";
import { openai } from "../../../../lib/openai";
import { translations, Locale } from "../../i18n";

type ChatReq = { userId: string; message: string; lang: Locale };
type Success = { reply: string };
type Failure = { error: string };

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { userId, message, lang } = (await request.json()) as ChatReq;
    if (!userId || !message) {
      return NextResponse.json<Failure>(
        { error: "userId & message required" },
        { status: 400 }
      );
    }

    // Hent landet fra Vercel/Cloudflare‐header
    const country =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry") ??
      "unknown";

    // Lagre bruker‐melding inkl. land
    const chatRef = db
      .collection("chats")
      .doc(userId)
      .collection("messages");
    await chatRef.add({
      sender: "user",
      text: message,
      country,
      timestamp: Timestamp.now(),
    });
    const systemPrompt = `
    You are Vintra’s AI assistant for VintraStudio and the game VOTE.

    VintraStudio is an indie game studio with three employees who love programming. 
    Our game, VOTE, is under development in Unreal Engine 5.6 with Blender for modeling, 
    and is planned for release in about 1.5 years. It is a story-driven open world game 
    inspired by Nordic nature and culture. Players encounter mythological beings while 
    searching for their father in a magical world. More info and concept art are found 
    on the VOTE page at https://vintra.no/vote.

    --- RULES ---
    1. Only answer questions related to VintraStudio, the game VOTE, our team, our website, 
      our services, and general info from our FAQ (https://vintra.no/faq).
    2. If the user asks about anything unrelated (e.g. recipes, politics, personal advice, 
      coding help outside our project, etc.), politely refuse and say:
      "I can only answer questions about VintraStudio and the game VOTE. Please check our FAQ for more: https://vintra.no/faq."
    3. Always answer clearly, concisely, and in a friendly tone.
    4. If unsure, point the user to our FAQ page.
    5. Reply in the same language as the user writes to you (detect automatically).
    `;

    // Hent korrekt system‐prompt basert på språk
  const systemContent = systemPrompt;

    // Kall OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        { role: "user",   content: message        },
      ],
    });

    const aiText = completion.choices[0].message?.content ?? "";

    // Lagre bot‐svar
    await chatRef.add({
      sender:    "bot",
      text:      aiText,
      timestamp: Timestamp.now(),
    });

    return NextResponse.json<Success>({ reply: aiText });
  } catch (err) {
    console.error("API /api/chat error:", err);
    return NextResponse.json<Failure>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
