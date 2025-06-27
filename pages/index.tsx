// pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Welcome to VintraGangster</h1>
      <p>
        Go to the <Link href="/chat">Chat Widget</Link>.
      </p>
    </main>
  );
}
