import Link from "next/link";
import { Btn, SectionLabel } from "@/components/ui";

export default function AboutPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-5 bg-warm-white/95 backdrop-blur-md border-b border-[rgba(60,42,20,0.1)]">
        <Link href="/" className="font-serif text-[1.4rem] font-semibold text-deep-brown">
          Redeem <em className="text-amber">Oneness</em>
        </Link>
        <Btn href="/login" small>Login</Btn>
      </nav>

      <div className="max-w-[760px] mx-auto px-6 pt-36 pb-24">
        <SectionLabel>About Us</SectionLabel>
        <h1 className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] mb-6">
          Faith. Community. <em className="text-amber">Opportunity.</em>
        </h1>
        <p className="text-[0.95rem] leading-[1.85] text-muted mb-6">
          Redeem Oneness is a faith-driven employment and mentorship platform built for church communities across Nigeria. We believe the local church is one of the most powerful networks in the world — and we exist to unlock that network for economic opportunity.
        </p>
        <p className="text-[0.95rem] leading-[1.85] text-muted mb-6">
          Members scan their branch QR code to join, build a skills profile, and access a curated feed of jobs and mentors — all connected through the trust of their church community. Businesses post roles knowing applicants come pre-vetted through faith networks. Mentors give back to the next generation, one member at a time.
        </p>
        <p className="text-[0.95rem] leading-[1.85] text-muted mb-10">
          We are headquartered in Nigeria and serve branches across the country, with plans to expand across Africa and the global diaspora.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Btn href="/signup">Join as Member</Btn>
          <Btn href="/church-register" variant="outline">Register a Church</Btn>
        </div>
      </div>
    </div>
  );
}
