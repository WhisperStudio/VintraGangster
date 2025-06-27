// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../lib/openai";
import { db, Timestamp } from "../../lib/firebaseAdmin";

type ChatRequest  = { userId: string; message: string };
type ChatSuccess  = { reply: string };
type ChatFailure  = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatSuccess | ChatFailure>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, message } = req.body as ChatRequest;
  if (!userId || !message) {
    return res.status(400).json({ error: "userId & message required" });
  }

  try {
    const chatRef = db.collection("chats").doc(userId).collection("messages");
    await chatRef.add({ sender: "user", text: message, timestamp: Timestamp.now() });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are helpful." },
        { role: "user",   content: message },
      ],
    });

    const aiText = completion.choices[0].message.content ?? "";
    await chatRef.add({ sender: "bot", text: aiText, timestamp: Timestamp.now() });

    return res.status(200).json({ reply: aiText });
  } catch (err) {
    console.error("Chat endpoint error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
