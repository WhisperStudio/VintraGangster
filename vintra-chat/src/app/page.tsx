// src/app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  // automatisk omdirigering
  redirect("/chat");
}
