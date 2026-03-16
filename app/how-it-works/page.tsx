import Link from "next/link";
import { Btn, SectionLabel } from "@/components/ui";

const steps = [
  {
    n: "01",
    icon: "⛪",
    title: "Church Registers a Branch",
    desc: "A church administrator registers their branch on Redeem Oneness. The system generates a unique QR code tied to that branch — ready to be printed, projected, or shared with the congregation.",
    cta: "Register a Branch",
    href: "/church-register",
  },
  {
    n: "02",
    icon: "📱",
    title: "Members Scan & Register",
    desc: "When a church member wants to join, they visit the signup page and scan their branch's QR code with their phone camera. The branch is captured automatically and linked to their account — no manual entry needed.",
    cta: "Join as Member",
    href: "/signup",
  },
  {
    n: "03",
    icon: "✦",
    title: "Build Your Profile",
    desc: "Members add their skills, sector interests, job preferences, and a short bio. The richer the profile, the better the matches. Businesses and mentors search by these exact fields.",
    cta: null,
    href: null,
  },
  {
    n: "04",
    icon: "💼",
    title: "Businesses Post Opportunities",
    desc: "Registered businesses post job listings — internships, full-time roles, freelance gigs, and volunteer positions — targeted to church members across all registered branches.",
    cta: "Register a Business",
    href: "/business-register",
  },
  {
    n: "05",
    icon: "🤝",
    title: "Mentors Connect",
    desc: "Verified professionals register as mentors and make themselves available for one-on-one guidance. Members browse mentors by sector and send mentorship requests directly through the platform.",
    cta: "Become a Mentor",
    href: "/mentor-register",
  },
  {
    n: "06",
    icon: "⚡",
    title: "Get Matched & Grow",
    desc: "Members receive a personalised feed of jobs and mentors matched to their skills. They apply, message, and track every application — all within the platform, backed by the trust of their faith community.",
    cta: null,
    href: null,
  },
];

const faqs = [
  {
    q: "Do I need to be a member of an RCCG branch?",
    a: "Currently the platform is built around RCCG branches, but any faith-based organisation can register a branch. What matters is that you join via your church's QR code.",
  },
  {
    q: "What if my church is not registered yet?",
    a: "Ask your branch admin or pastor to register the branch at /church-register. Once registered, they'll receive a QR code your congregation can use to sign up.",
  },
  {
    q: "Is the platform free for members?",
    a: "Yes. Membership, job browsing, applying, and connecting with mentors are all free for church members.",
  },
  {
    q: "How are businesses vetted?",
    a: "Businesses register with their company details and are linked to the faith community network. Branch admins can flag concerns, and the platform maintains accountability through community trust.",
  },
  {
    q: "Can I change my branch after registering?",
    a: "Your branch is tied to your account at registration. To transfer branches, contact your branch admin — they can update your record from the admin dashboard.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5 bg-warm-white/95 backdrop-blur-md border-b border-[rgba(60,42,20,0.1)]">
        <Link href="/" className="font-serif text-[1.4rem] font-semibold text-deep-brown">
          Redeem <em className="text-amber">Oneness</em>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {[["How It Works","/how-it-works"],["Members","/members"],["Businesses","/businesses"],["Churches","/churches"]].map(([l,h])=>(
            <Link key={l} href={h} className="text-[0.78rem] tracking-[0.08em] uppercase text-muted hover:text-deep-brown transition-colors">{l}</Link>
          ))}
          <Btn href="/login" small>Login</Btn>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(196,131,42,0.06),transparent_65%)] pointer-events-none" />
        <SectionLabel center>Platform Guide</SectionLabel>
        <h1 className="font-serif text-[clamp(2.8rem,5vw,4.5rem)] font-light leading-[1.05] mt-3 mb-5">
          How Redeem <em className="text-amber">Oneness</em> works
        </h1>
        <p className="text-muted text-[0.95rem] leading-[1.75] max-w-[480px] mx-auto mb-10">
          From church QR code to your first job offer — here&apos;s the complete picture.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Btn href="/signup">Join as Member</Btn>
          <Btn href="/church-register" variant="outline">Register a Branch</Btn>
        </div>
      </section>

      {/* Steps */}
      <section className="px-12 pb-28">
        <div className="max-w-[900px] mx-auto space-y-0 divide-y divide-[rgba(60,42,20,0.08)] border border-[rgba(60,42,20,0.08)] rounded-[4px] overflow-hidden">
          {steps.map((s) => (
            <div key={s.n} className="grid md:grid-cols-[120px_1fr_auto] gap-6 items-center p-8 bg-warm-white hover:bg-cream/40 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="font-serif text-[3rem] font-light text-amber/20 leading-none group-hover:text-amber/40 transition-colors">{s.n}</div>
                <div className="w-11 h-11 bg-amber rounded-sm flex items-center justify-center text-[1.1rem] shrink-0">{s.icon}</div>
              </div>
              <div>
                <h3 className="font-serif text-[1.2rem] font-semibold mb-1">{s.title}</h3>
                <p className="text-[0.85rem] leading-[1.7] text-muted">{s.desc}</p>
              </div>
              {s.cta && s.href && (
                <Btn href={s.href} variant="outline" small className="shrink-0">{s.cta}</Btn>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-12 py-24 bg-cream">
        <div className="max-w-[700px] mx-auto">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-serif text-[clamp(2rem,3vw,2.8rem)] font-light mb-12">Common questions</h2>
          <div className="space-y-0 divide-y divide-[rgba(60,42,20,0.1)]">
            {faqs.map((f) => (
              <div key={f.q} className="py-6">
                <h3 className="font-serif text-[1.05rem] font-semibold mb-2">{f.q}</h3>
                <p className="text-[0.85rem] leading-[1.75] text-muted">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-12 py-28 text-center bg-deep-brown relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 60px,white 60px,white 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,white 60px,white 61px)" }} />
        <SectionLabel center>Get Started</SectionLabel>
        <h2 className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] font-light text-cream mt-3 mb-5">
          Ready to connect your <em className="text-gold">faith community</em>?
        </h2>
        <div className="flex justify-center gap-3 flex-wrap mt-8">
          <Btn href="/signup">Join as Member</Btn>
          <Btn href="/church-register" variant="outline">Register a Branch</Btn>
          <Btn href="/business-register" variant="ghost">Register a Business</Btn>
        </div>
      </section>
    </div>
  );
}
