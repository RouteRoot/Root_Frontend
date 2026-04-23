import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <p>BBuri Service</p>
      <p>AI-powered personalized career roadmap and exam scheduling automation.</p>
      <Link href="/login">Login</Link>
      <Link href="/signup">Sign up</Link>
    </>
  );
}
