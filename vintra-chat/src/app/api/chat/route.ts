// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { db, Timestamp } from "../../../../lib/firebaseAdmin";
import { openai } from "../../../../lib/openai";
// 1) Hent inn oversettelsene
import { translations } from "../../i18n";

type ChatReq = {
  userId: string;
  message: string;
  lang?: "no" | "en";
};

type Success = { reply: string };
type Failure = { error: string };

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // 2) parse + valider
    const body = (await request.json()) as ChatReq;
    const { userId, message, lang = "no" } = body;

    if (!userId || !message) {
      return NextResponse.json<Failure>(
        { error: "userId & message required" },
        { status: 400 }
      );
    }

    // 3) lagre bruker‐melding i Firestore
    const chatRef = db
      .collection("chats")
      .doc(userId)
      .collection("messages");
    await chatRef.add({
      sender: "user",
      text: message,
      timestamp: Timestamp.now(),
    });

    // 4) hent korrekt system‐prompt basert på språk
    const systemContent = translations[lang].systemPrompt;

    // 5) kall OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: message },
      ],
    });
    const aiText = completion.choices[0].message?.content ?? "";

    // 6) lagre bot‐svar i Firestore
    await chatRef.add({
      sender: "bot",
      text: aiText,
      timestamp: Timestamp.now(),
    });

    // 7) returner svar
    return NextResponse.json<Success>({ reply: aiText });
  } catch (err) {
    console.error("API /api/chat error:", err);
    return NextResponse.json<Failure>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
