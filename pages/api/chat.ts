import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../lib/openai";
import { db, Timestamp } from "../../lib/firebaseAdmin";

type ChatReq = { userId: string; message: string };
type Success = { reply: string };
type Failure = { error: string };

export default async function handler(
  req: NextApiRequest, res: NextApiResponse<Success|Failure>
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { userId, message } = req.body as ChatReq;
  if (!userId || !message)
    return res.status(400).json({ error: "userId and message required" });

  try {
    const chatRef = db
      .collection("chats")
      .doc(userId)
      .collection("messages");

    // Lagre bruker-melding
    await chatRef.add({ sender: "user", text: message, timestamp: Timestamp.now() });

    // Kall OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system",  content: "You are a helpful assistant." },
        { role: "user",    content: message },
      ],
    });

    const aiText = completion.choices[0].message?.content || "";
    // Lagre bot-melding
    await chatRef.add({ sender: "bot", text: aiText, timestamp: Timestamp.now() });

    return res.status(200).json({ reply: aiText });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
