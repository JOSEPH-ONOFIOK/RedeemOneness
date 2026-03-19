import Link from "next/link";
import { Btn, SectionLabel, Tag } from "@/components/ui";

const features = [
  { icon: "💼", title: "Personalised Job Feed",     desc: "Jobs matched to your exact skills, sector interests, and job type preferences — updated as new opportunities are posted by businesses in your network." },
  { icon: "🤝", title: "One-on-One Mentorship",     desc: "Browse verified mentors in your sector and send a mentorship request. Build lasting professional relationships grounded in shared faith." },
  { icon: "📨", title: "Direct Messaging",           desc: "Message businesses and mentors directly within the platform. No email chains — everything in one place." },
  { icon: "📋", title: "Application Tracking",      desc: "Track every job application from submitted to accepted. See when a business has viewed your profile." },
  { icon: "🔔", title: "Branch Announcements",      desc: "Stay informed with announcements from your church branch admin — opportunities, events, and community news." },
  { icon: "🌐", title: "Cross-Branch Connections",  desc: "Your profile is visible to businesses and mentors across all registered branches, not just your own." },
];

const jobTypes = ["Internship", "Full-time", "Part-time", "Volunteer", "Freelance"];
const sectors  = ["Technology", "Finance", "Healthcare", "Education", "Creative Arts", "Engineering", "Law", "Business"];

export default function MembersPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-5 bg-warm-white/95 backdrop-blur-md border-b border-[rgba(60,42,20,0.1)]">
        <Link href="/" className="font-serif text-[1.4rem] font-semibold text-deep-brown">
          Redeem <em className="text-amber">Oneness</em>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {[["How It Works","/how-it-works"],["Members","/members"],["Mentors","/mentors"],["Businesses","/businesses"],["Churches","/churches"]].map(([l,h])=>(
            <Link key={l} href={h} className="text-[0.78rem] tracking-[0.08em] uppercase text-muted hover:text-deep-brown transition-colors">{l}</Link>
          ))}
          <Btn href="/login" small>Login</Btn>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-[70vh] grid md:grid-cols-2 pt-20 relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(196,131,42,0.07),transparent_70%)] pointer-events-none" />
        <div className="flex flex-col justify-center px-12 py-20 relative z-10">
          <SectionLabel>For Members</SectionLabel>
          <h1 className="font-serif text-[clamp(2.8rem,4.5vw,4.5rem)] font-light leading-[1.05] mt-2 mb-5">
            Your church is your <em className="text-amber">career network</em>
          </h1>
          <p className="text-[0.95rem] leading-[1.75] text-muted max-w-[440px] mb-8">
            Join Redeem Oneness through your church branch and access jobs, mentors, and a community built on trust — all for free.
          </p>
          <div className="flex flex-wrap gap-3">
            <Btn href="/signup">Join as Member</Btn>
            <Btn href="/how-it-works" variant="outline">How it works</Btn>
          </div>
          <p className="text-[0.78rem] text-muted mt-4">
            Already a member? <Link href="/login" className="text-amber hover:underline">Sign in →</Link>
          </p>
        </div>
        {/* Visual */}
        <div className="hidden md:flex items-center justify-center bg-[linear-gradient(135deg,rgba(196,131,42,0.07),rgba(107,126,90,0.05))] px-12">
          <div className="w-[320px] space-y-3">
            {[
              { title:"Frontend Intern",   co:"XYZ Tech · Lagos",     tags:["React","CSS"],    badge:"New",   bStyle:"bg-amber/20 text-amber" },
              { title:"Junior Accountant", co:"FinCorp · Abuja",      tags:["Excel","IFRS"],   badge:"Match", bStyle:"bg-sage/20 text-sage" },
              { title:"Graphic Design",    co:"CreativeNGO · Remote", tags:["Figma","AI"],     badge:"Open",  bStyle:"bg-terra/20 text-terra" },
            ].map((j)=>(
              <div key={j.title} className="bg-warm-white border border-[rgba(60,42,20,0.1)] rounded-[4px] p-4 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-serif text-[1rem] font-semibold">{j.title}</span>
                  <span className={`text-[0.62rem] px-2 py-0.5 rounded-sm font-medium uppercase tracking-wide ${j.bStyle}`}>{j.badge}</span>
                </div>
                <div className="text-[0.73rem] text-muted mb-2">{j.co}</div>
                <div className="flex gap-1.5">{j.tags.map(t=><Tag key={t}>{t}</Tag>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-12 py-24">
        <SectionLabel>What You Get</SectionLabel>
        <h2 className="font-serif text-[clamp(2rem,3vw,2.8rem)] font-light mb-12">Everything a member needs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f)=>(
            <div key={f.title} className="border border-[rgba(60,42,20,0.1)] rounded-[4px] p-8 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(28,18,8,0.07)] transition-all">
              <div className="text-[1.8rem] mb-4">{f.icon}</div>
              <h3 className="font-serif text-[1.1rem] font-semibold mb-2">{f.title}</h3>
              <p className="text-[0.83rem] leading-[1.7] text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors + job types */}
      <section className="px-12 py-20 bg-cream">
        <div className="grid md:grid-cols-2 gap-16 max-w-[800px]">
          <div>
            <SectionLabel>Coverage</SectionLabel>
            <h2 className="font-serif text-[1.8rem] font-light mb-6">Sectors covered</h2>
            <div className="flex flex-wrap gap-2">
              {sectors.map(s=><Tag key={s} amber>{s}</Tag>)}
            </div>
          </div>
          <div>
            <SectionLabel>Opportunities</SectionLabel>
            <h2 className="font-serif text-[1.8rem] font-light mb-6">Job types</h2>
            <div className="flex flex-wrap gap-2">
              {jobTypes.map(s=><Tag key={s}>{s}</Tag>)}
            </div>
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="px-12 py-24">
        <SectionLabel>Getting Started</SectionLabel>
        <h2 className="font-serif text-[clamp(2rem,3vw,2.8rem)] font-light mb-12">Join in 3 steps</h2>
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(60,42,20,0.1)]">
          {[
            { n:"01", title:"Scan your branch QR",   desc:"Open the signup page and scan your church's QR code with your camera. Your branch is linked to your account." },
            { n:"02", title:"Build your profile",     desc:"Add your skills, sector interests, and the kind of work you're looking for. The more detail, the better your matches." },
            { n:"03", title:"Apply & connect",        desc:"Browse your personalised job feed, apply directly, and reach out to mentors. Track every step in your dashboard." },
          ].map((s)=>(
            <div key={s.n} className="bg-warm-white p-10 relative group overflow-hidden">
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber group-hover:w-full transition-all duration-500" />
              <div className="font-serif text-[4rem] font-light text-amber/10 leading-none mb-3">{s.n}</div>
              <h3 className="font-serif text-[1.15rem] font-semibold mb-2">{s.title}</h3>
              <p className="text-[0.83rem] leading-[1.7] text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-12 py-28 bg-deep-brown text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 60px,white 60px,white 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,white 60px,white 61px)" }} />
        <h2 className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] font-light text-cream mb-5">
          Your community is your <em className="text-gold">greatest asset</em>
        </h2>
        <p className="text-white/45 text-[0.92rem] mb-8 max-w-[380px] mx-auto">Scan your branch QR code to get started — it takes less than 2 minutes.</p>
        <Btn href="/signup">Join as Member</Btn>
      </section>
    </div>
  );
}
