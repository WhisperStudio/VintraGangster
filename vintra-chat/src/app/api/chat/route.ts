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

    // Hent korrekt system‐prompt basert på språk
    const systemContent =
      translations[lang]?.systemPrompt ?? translations.no.systemPrompt;

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
