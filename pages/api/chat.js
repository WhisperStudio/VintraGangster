// pages/api/chat.js
import { openai } from "../../lib/openai";
import { db, Timestamp } from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: "userId & message required" });
  }

  try {
    // 1) Write the user's message once
    const chatRef = db.collection("chats").doc(userId).collection("messages");
    await chatRef.add({
      sender: "user",
      text: message,
      timestamp: Timestamp.now(),
    });

    // 2) Call OpenAI Chat API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are helpful." },
        { role: "user", content: message },
      ],
    });

    const aiText = completion.choices[0].message.content;

    // 3) Write the AI's response
    await chatRef.add({
      sender: "bot",
      text: aiText,
      timestamp: Timestamp.now(),
    });

    // 4) Return the reply
    res.status(200).json({ reply: aiText });
  } catch (err) {
    console.error("Chat endpoint error:", err);
    res.status(500).json({ error: "Internal error" });
  }
}
