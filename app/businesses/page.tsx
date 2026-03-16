import Link from "next/link";
import { Btn, SectionLabel, Tag } from "@/components/ui";

const features = [
  { icon: "🔍", title: "Search Verified Members",   desc: "Filter church members by skills, sector, location, job type preference, and branch. Every candidate is tied to a real faith community." },
  { icon: "📋", title: "Post Job Listings",          desc: "Post internships, full-time roles, freelance gigs, and volunteer opportunities. Your listings appear in matched members' personalised feeds." },
  { icon: "📩", title: "Manage Applications",        desc: "Review applications, update statuses, and message candidates directly — all from your business dashboard." },
  { icon: "💬", title: "Direct Messaging",           desc: "Reach out to any member whose profile you've viewed. Build relationships before making an offer." },
  { icon: "🌍", title: "Cross-Branch Reach",         desc: "Your job posts are visible to members across all registered church branches — not just one location." },
  { icon: "🤝", title: "Community Trust",            desc: "Hiring from a faith-rooted platform means candidates come with accountability, community context, and shared values." },
];

const filterOptions = [
  { label: "Skills",    examples: ["React","Excel","Figma","IFRS","Python","Accounting"] },
  { label: "Sector",    examples: ["Technology","Finance","Healthcare","Engineering","Law"] },
  { label: "Job Type",  examples: ["Internship","Full-time","Freelance","Volunteer"] },
  { label: "Location",  examples: ["Lagos","Abuja","Port Harcourt","Remote"] },
];

export default function BusinessesPage() {
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
      <section className="min-h-[70vh] grid md:grid-cols-2 pt-20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(196,131,42,0.07),transparent_70%)] pointer-events-none" />
        <div className="flex flex-col justify-center px-12 py-20 relative z-10">
          <SectionLabel>For Businesses</SectionLabel>
          <h1 className="font-serif text-[clamp(2.8rem,4.5vw,4.5rem)] font-light leading-[1.05] mt-2 mb-5">
            Hire from a <em className="text-amber">trusted community</em>
          </h1>
          <p className="text-[0.95rem] leading-[1.75] text-muted max-w-[440px] mb-8">
            Access a pool of pre-vetted church members across Nigeria. Search by skills, sector, and location — then hire with confidence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Btn href="/business-register">Register Your Business</Btn>
            <Btn href="/how-it-works" variant="outline">How it works</Btn>
          </div>
          <p className="text-[0.78rem] text-muted mt-4">
            Already registered? <Link href="/login" className="text-amber hover:underline">Sign in →</Link>
          </p>
        </div>
        {/* Stats */}
        <div className="hidden md:flex items-center justify-center bg-deep-brown relative overflow-hidden px-12">
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-amber/10" />
          <div className="grid grid-cols-2 gap-4 relative z-10">
            {[["2,400+","Verified Members"],["95+","Church Branches"],["8","Sectors Covered"],["Free","To Post Jobs"]].map(([n,l])=>(
              <div key={l} className="border border-white/10 rounded-[4px] p-6 text-center">
                <div className="font-serif text-[2.2rem] font-light text-gold mb-1">{n}</div>
                <div className="text-[0.68rem] tracking-[0.1em] uppercase text-white/40">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-12 py-24">
        <SectionLabel>What You Get</SectionLabel>
        <h2 className="font-serif text-[clamp(2rem,3vw,2.8rem)] font-light mb-12">Everything a business needs</h2>
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

      {/* Filter showcase */}
      <section className="px-12 py-20 bg-cream">
        <SectionLabel>Powerful Search</SectionLabel>
        <h2 className="font-serif text-[clamp(2rem,3vw,2.8rem)] font-light mb-4">Find exactly who you need</h2>
        <p className="text-muted text-[0.88rem] mb-10 max-w-[480px]">Filter the full member pool using any combination of these attributes.</p>
        <div className="grid md:grid-cols-4 gap-6">
          {filterOptions.map((f)=>(
            <div key={f.label} className="bg-warm-white border border-[rgba(60,42,20,0.1)] rounded-[4px] p-6">
              <p className="text-[0.68rem] tracking-[0.12em] uppercase text-muted mb-3">{f.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {f.examples.map(e=><Tag key={e}>{e}</Tag>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to start */}
      <section className="px-12 py-24">
        <SectionLabel>Getting Started</SectionLabel>
        <h2 className="font-serif text-[clamp(2rem,3vw,2.8rem)] font-light mb-12">Start hiring in 3 steps</h2>
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(60,42,20,0.1)]">
          {[
            { n:"01", title:"Register your business",  desc:"Fill in your company details — name, sector, location, and contact. Your business profile is live immediately." },
            { n:"02", title:"Post a job or search",     desc:"Post a listing or use the member search to proactively find candidates that match your requirements." },
            { n:"03", title:"Connect & hire",           desc:"Message candidates, review applications, update their status, and make your hire — all from one dashboard." },
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
          Tap into a <em className="text-gold">pre-vetted talent pool</em>
        </h2>
        <p className="text-white/45 text-[0.92rem] mb-8 max-w-[380px] mx-auto">Register your business today — it&apos;s free to post and search.</p>
        <Btn href="/business-register">Register Your Business</Btn>
      </section>
    </div>
  );
}
