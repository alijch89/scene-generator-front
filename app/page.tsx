import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="home-page">
      <nav className="home-nav">
        <span className="brand">
          <span className="brand-mark">S</span>
          <span>Scene Studio</span>
        </span>
        <div>
          <Link className="text-link" href="/login">
            Sign in
          </Link>
          <Button asChild size="sm">
            <Link href="/register">Start creating</Link>
          </Button>
        </div>
      </nav>
      <section className="hero">
        <p className="eyebrow">Scene by scene</p>
        <h1>Build worlds worth remembering.</h1>
        <p>
          A focused, secure place to turn fragments of imagination into
          finished stories.
        </p>
        <Button asChild size="lg" className="hero-button">
          <Link href="/register">
            Create your workspace <span aria-hidden>→</span>
          </Link>
        </Button>
      </section>
      <div className="orb orb-one" />
      <div className="orb orb-two" />
    </main>
  );
}
