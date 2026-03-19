import Link from "next/link";
import { Btn, SectionLabel, Tag } from "@/components/ui";

const features = [
  { icon: "🎯", title: "Reach Those Who Need You",   desc: "Church members actively looking for guidance in your sector will find your profile and send mentorship requests. You choose who to accept." },
  { icon: "📅", title: "Flexible Commitment",        desc: "There are no fixed schedules. Accept as many or as few mentees as you like. Mentor on your own terms, at your own pace." },
  { icon: "💬", title: "Built-In Messaging",         desc: "Communicate with mentees directly within the platform. No need to share personal contact details until you're ready." },
  { icon: "📢", title: "Post Announcements",         desc: "Share industry insights, job tips, or encouragement with all your mentees at once via the announcement feature." },
  { icon: "🌍", title: "Platform-Wide Visibility",   desc: "Your mentor profile is visible to all registered members across every church branch — not just one location." },
  { icon: "🤝", title: "Faith-Rooted Community",     desc: "Mentor within a community where shared values create deeper trust, greater accountability, and more meaningful impact." },
];

const sectors = [
  "Technology", "Finance", "Law", "Medicine",
  "Engineering", "Education", "Creative Arts", "Public Health",
];

const NAV = [
  ["How It Works", "/how-it-works"],
  ["Members",      "/members"],
  ["Mentors",      "/mentors"],
  ["Businesses",   "/businesses"],
  ["Churches",     "/churches"],
];

export default function MentorsPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-5 bg-warm-white/95 backdrop-blur-md border-b border-[rgba(60,42,20,0.1)]">
        <Link href="/" className="font-serif text-[1.4rem] font-semibold text-deep-brown">
          Redeem <em className="text-amber">Oneness</em>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {NAV.map(([l, h]) => (
            <Link key={l} href={h} className="text-[0.78rem] tracking-[0.08em] uppercase text-muted hover:text-deep-brown transition-colors">{l}</Link>
          ))}
          <Btn href="/login" small>Login</Btn>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-[70vh] grid md:grid-cols-2 pt-20 relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(46,107,82,0.07),transparent_70%)] pointer-events-none" />
        <div className="flex flex-col justify-center px-4 md:px-12 py-10 md:py-20 relative z-10">
          <SectionLabel>For Mentors</SectionLabel>
          <h1 className="font-serif text-[clamp(2.4rem,4.5vw,4.5rem)] font-light leading-[1.05] mt-2 mb-5">
            Give back to the next <em className="text-forest">generation</em>
          </h1>
          <p className="text-[0.95rem] leading-[1.75] text-muted max-w-[440px] mb-8">
            Share your expertise with church members who need guidance in your field. Build meaningful mentorship relationships rooted in community and shared values.
          </p>
          <div className="flex flex-wrap gap-3">
            <Btn href="/mentor-register" variant="sage">Become a Mentor</Btn>
            <Btn href="/how-it-works" variant="outline">How it works</Btn>
          </div>
          <p className="text-[0.78rem] text-muted mt-4">
            Already registered? <Link href="/login" className="text-forest hover:underline">Sign in →</Link>
          </p>
        </div>

        {/* Visual */}
        <div className="hidden md:flex items-center justify-center bg-[linear-gradient(135deg,rgba(46,107,82,0.07),rgba(107,126,90,0.05))] px-12">
          <div className="w-[320px] space-y-3">
            {[
              { name: "Adaeze Obi",    sector: "UX / Product Design", exp: "8 yrs",  tags: ["Figma", "UX Research"] },
              { name: "Chukwudi Eze",  sector: "Technology",          exp: "12 yrs", tags: ["React", "Node.js"] },
              { name: "Funmilayo A.",  sector: "Finance",             exp: "10 yrs", tags: ["IFRS", "Audit"] },
            ].map((m) => (
              <div key={m.name} className="bg-warm-white border border-[rgba(60,42,20,0.1)] rounded-[4px] p-4 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-serif text-[1rem] font-semibold">{m.name}</span>
                  <span className="text-[0.62rem] px-2 py-0.5 rounded-sm font-medium uppercase tracking-wide bg-forest/10 text-forest">{m.exp}</span>
                </div>
                <div className="text-[0.73rem] text-muted mb-2">{m.sector}</div>
                <div className="flex gap-1.5">{m.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-12 py-10 md:py-24">
        <SectionLabel>What You Get</SectionLabel>
        <h2 className="font-serif text-[clamp(2rem,3vw,2.8rem)] font-light mb-12">Built for busy professionals</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="border border-[rgba(60,42,20,0.1)] rounded-[4px] p-8 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(28,18,8,0.07)] transition-all">
              <div className="text-[1.8rem] mb-4">{f.icon}</div>
              <h3 className="font-serif text-[1.1rem] font-semibold mb-2">{f.title}</h3>
              <p className="text-[0.83rem] leading-[1.7] text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section className="px-4 md:px-12 py-10 md:py-20 bg-cream">
        <div className="max-w-[600px]">
          <SectionLabel>Coverage</SectionLabel>
          <h2 className="font-serif text-[1.8rem] font-light mb-6">Sectors we support</h2>
          <p className="text-[0.88rem] leading-[1.75] text-muted mb-6">
            Mentors are needed across a wide range of industries. If your sector isn't listed, you can still register — we're always growing.
          </p>
          <div className="flex flex-wrap gap-2">
            {sectors.map((s) => <Tag key={s} amber>{s}</Tag>)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 md:px-12 py-10 md:py-24">
        <SectionLabel>Getting Started</SectionLabel>
        <h2 className="font-serif text-[clamp(2rem,3vw,2.8rem)] font-light mb-12">Start mentoring in 3 steps</h2>
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(60,42,20,0.1)]">
          {[
            { n: "01", title: "Create your profile",  desc: "Register as a mentor and fill in your sector, years of experience, bio, and preferred contact method. Your profile goes live immediately." },
            { n: "02", title: "Receive requests",      desc: "Members browsing mentors in your sector will send you a mentorship request with a short message. You decide who to accept." },
            { n: "03", title: "Start the journey",     desc: "Once you accept a request, connect via the platform messaging system and begin the mentorship on your own terms." },
          ].map((s) => (
            <div key={s.n} className="bg-warm-white p-10 relative group overflow-hidden">
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-forest group-hover:w-full transition-all duration-500" />
              <div className="font-serif text-[4rem] font-light text-forest/10 leading-none mb-3">{s.n}</div>
              <h3 className="font-serif text-[1.15rem] font-semibold mb-2">{s.title}</h3>
              <p className="text-[0.83rem] leading-[1.7] text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-12 py-16 md:py-28 bg-deep-brown text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 60px,white 60px,white 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,white 60px,white 61px)" }} />
        <h2 className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] font-light text-cream mb-5">
          Your experience can <em className="text-gold">change a life</em>
        </h2>
        <p className="text-white/45 text-[0.92rem] mb-8 max-w-[380px] mx-auto">
          Register in minutes. No commitment required to start. Give back to a community that shares your values.
        </p>
        <div className="flex justify-center flex-wrap gap-3">
          <Btn href="/mentor-register" variant="sage">Become a Mentor</Btn>
          <Btn href="/login" variant="ghost">Sign in</Btn>
        </div>
      </section>
    </div>
  );
}
