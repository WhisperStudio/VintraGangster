// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { db, Timestamp } from "../../../../lib/firebaseAdmin";
import { openai } from "../../../../lib/openai";

type ChatReq = { userId: string; message: string };
type Success = { reply: string };
type Failure = { error: string };

export async function POST(request: Request) {
  try {
    // 1) parse + validate
    const body = (await request.json()) as ChatReq;
    const { userId, message } = body;
    if (!userId || !message) {
      return NextResponse.json<Failure>(
        { error: "userId & message required" },
        { status: 400 }
      );
    }

    // 2) Firestore: save user message
    const chatRef = db
      .collection("chats")
      .doc(userId)
      .collection("messages");
    await chatRef.add({
      sender: "user",
      text: message,
      timestamp: Timestamp.now(),
    });

    // 3) OpenAI call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });
    const aiText = completion.choices[0].message?.content ?? "";

    // 4) Firestore: save bot reply
    await chatRef.add({
      sender: "bot",
      text: aiText,
      timestamp: Timestamp.now(),
    });

    // 5) Return reply
    return NextResponse.json<Success>({ reply: aiText });
  } catch (err) {
    console.error("API /api/chat error:", err);
    return NextResponse.json<Failure>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// (Optional) enforce Node.js runtime so firebase-admin works
export const runtime = "nodejs";
