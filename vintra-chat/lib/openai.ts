// lib/openai.ts
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,  // Har du satt OPENAI_API_KEY i Vercel?
});
