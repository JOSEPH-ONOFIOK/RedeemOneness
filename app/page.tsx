import Link from "next/link";
import { Btn, SectionLabel, Tag, Badge } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="bg-warm-white min-h-screen">
      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-5 bg-warm-white/95 backdrop-blur-md border-b border-[rgba(60,42,20,0.1)]">
        <Link href="/" className="font-serif text-[1.4rem] font-semibold text-deep-brown">
          Redeem <em className="text-amber">Oneness</em>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {[["How It Works","/how-it-works"],["Members","/members"],["Businesses","/businesses"],["Churches","/churches"]].map(([l,h]) => (
            <Link key={l} href={h} className="text-[0.78rem] tracking-[0.08em] uppercase text-muted hover:text-deep-brown transition-colors">
              {l}
            </Link>
          ))}
          <Btn href="/login" small>Login</Btn>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="min-h-screen grid md:grid-cols-2 pt-20 relative overflow-hidden">
        {/* bg circles */}
        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(196,131,42,0.07)_0%,transparent_70%)] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-0 left-[100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(46,107,82,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-[30%] right-[5%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(62,126,166,0.05)_0%,transparent_70%)] pointer-events-none" />

        {/* Left copy */}
        <div className="flex flex-col justify-center px-4 md:px-12 py-10 md:py-20 relative z-10">
          <div className="flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.18em] uppercase text-amber mb-5 animate-fade-up">
            <span className="block w-6 h-px bg-amber" /> Faith. Community. Opportunity.
          </div>
          <h1 className="font-serif text-[clamp(2rem,5vw,5rem)] font-light leading-[1.05] tracking-[-0.02em] text-deep-brown mb-6 animate-fade-up delay-200">
            Where your church<br />becomes your <em className="text-amber">network</em>
          </h1>
          <p className="text-[1rem] leading-[1.75] text-muted max-w-[440px] mb-10 animate-fade-up delay-300">
            Connecting church members with jobs, mentors, and businesses — turning faith communities into powerful engines of economic opportunity.
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-up delay-500">
            <Btn href="/signup">Join as Member</Btn>
            <Btn href="/business-register" variant="amber">Register a Business</Btn>
            <Btn href="/church-register" variant="outline">Register a Church</Btn>
            <Btn href="/mentor-register" variant="ghost">Become a Mentor</Btn>
          </div>
        </div>

        {/* Right preview cards */}
        <div className="hidden md:flex items-center justify-center bg-[linear-gradient(135deg,rgba(196,131,42,0.07),rgba(107,126,90,0.05))] relative overflow-hidden py-20">
          <div className="flex flex-col gap-4 w-[340px]">
            {[
              { role: "Frontend Intern", co: "XYZ Tech · Lagos", tags: ["React", "CSS"], badge: "new" as const, delay: "" },
              { role: "Junior Accountant", co: "FinCorp · Abuja", tags: ["Excel", "IFRS"], badge: "viewed" as const, delay: "delay-200" },
              { role: "UI Design Mentor", co: "Adaeze Obi · 8yrs exp", tags: ["Figma", "UX"], badge: "default" as const, delay: "delay-300" },
            ].map((j) => (
              <div key={j.role} className={`bg-warm-white border border-[rgba(60,42,20,0.1)] rounded-[4px] p-5 shadow-[0_4px_20px_rgba(28,18,8,0.05)] animate-fade-up ${j.delay}`}>
                <div className="flex justify-between items-start mb-1.5">
                  <span className="font-serif text-[1rem] font-semibold">{j.role}</span>
                  <Badge type={j.badge}>{j.badge}</Badge>
                </div>
                <div className="text-[0.75rem] text-muted mb-2">{j.co}</div>
                <div className="flex gap-1.5">{j.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
              </div>
            ))}
          </div>
          {/* Floating stat card */}
          <div className="absolute bottom-16 left-8 bg-warm-white border border-[rgba(60,42,20,0.12)] rounded-[4px] p-4 shadow-lg animate-float">
            <div className="text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-1">Active Mentors</div>
            <div className="font-serif text-2xl font-light text-amber">38</div>
            <div className="text-[0.7rem] text-sage mt-0.5">Across 12 sectors</div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <div className="bg-deep-brown px-4 md:px-12 py-6 md:py-10 flex justify-around flex-wrap gap-4 md:gap-8">
        {[["2,400+","Members","text-gold"],["180+","Businesses","text-sky"],["95+","Branches","text-gold"],["38","Mentors","text-forest"],["640+","Jobs Placed","text-sky"]].map(([n,l,c]) => (
          <div key={l} className="text-center">
            <div className={`font-serif text-[2.6rem] font-light ${c}`}>{n}</div>
            <div className="text-[0.7rem] tracking-[0.12em] uppercase text-white/40 mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="px-4 md:px-12 py-10 md:py-28" id="how">
        <SectionLabel>How It Works</SectionLabel>
        <h2 className="font-serif text-[clamp(2.2rem,3.5vw,3.2rem)] font-light mb-12">
          Simple steps to <em className="text-amber">opportunity</em>
        </h2>
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(60,42,20,0.12)]">
          {[
            { n:"01", icon:"⛪", title:"Scan & Join",   desc:"Scan your church branch's QR code to sign up. Your branch becomes your community anchor on the platform.", iconBg:"bg-amber",  numColor:"text-amber/10",  lineColor:"bg-amber" },
            { n:"02", icon:"✦",  title:"Build Profile", desc:"Add your skills, sector interests, and job preferences. Businesses and mentors find you based on what you bring.", iconBg:"bg-sky",    numColor:"text-sky/10",    lineColor:"bg-sky" },
            { n:"03", icon:"⚡",  title:"Get Matched",   desc:"Receive personalised job and mentorship opportunities. Apply, message directly, and track every step.", iconBg:"bg-forest", numColor:"text-forest/10", lineColor:"bg-forest" },
          ].map((s) => (
            <div key={s.n} className="bg-warm-white p-6 md:p-12 relative overflow-hidden group">
              <div className={`absolute bottom-0 left-0 w-0 h-0.5 ${s.lineColor} group-hover:w-full transition-all duration-500`} />
              <div className={`font-serif text-[4rem] font-light ${s.numColor} leading-none mb-4`}>{s.n}</div>
              <div className={`w-11 h-11 ${s.iconBg} rounded-sm flex items-center justify-center text-[1.1rem] mb-4 text-cream`}>{s.icon}</div>
              <h3 className="font-serif text-[1.3rem] font-semibold mb-3">{s.title}</h3>
              <p className="text-[0.85rem] leading-[1.7] text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOR MEMBERS ─────────────────────────────────────── */}
      <section className="px-4 md:px-12 py-10 md:py-24 bg-cream relative overflow-hidden" id="members">
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(196,131,42,0.05),transparent_70%)] pointer-events-none" />
        <div className="grid md:grid-cols-2 gap-8 md:gap-24 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="bg-deep-brown rounded-[4px] p-6 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-amber/10" />
              <div className="text-[0.65rem] tracking-[0.1em] uppercase text-white/40 mb-4">Your Job Feed</div>
              {[
                { title:"Frontend Intern",   co:"XYZ Tech · Lagos",      tags:["React","CSS"],     badge:"New",   badgeStyle:"bg-amber/30 text-gold" },
                { title:"Junior Accountant", co:"FinCorp · Abuja",       tags:["Excel","IFRS"],    badge:"Match", badgeStyle:"bg-forest/30 text-[#7ecba8]" },
                { title:"Graphic Design",    co:"CreativeNGO · Remote",  tags:["Figma","AI"],      badge:"Open",  badgeStyle:"bg-terra/30 text-[#e8a089]" },
              ].map((j) => (
                <div key={j.title} className="bg-white/5 border border-white/10 rounded-[4px] p-4 mb-3 last:mb-0 relative z-10">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-serif text-[1rem] font-semibold text-cream">{j.title}</span>
                    <span className={`text-[0.62rem] px-2 py-0.5 rounded-sm font-medium tracking-wide uppercase ${j.badgeStyle}`}>{j.badge}</span>
                  </div>
                  <div className="text-[0.75rem] text-white/40 mb-2">{j.co}</div>
                  <div className="flex gap-1.5">{j.tags.map(t=><span key={t} className="text-[0.65rem] px-2 py-0.5 border border-white/15 rounded-sm text-white/50">{t}</span>)}</div>
                </div>
              ))}
            </div>
            {/* Sub card */}
            <div className="absolute -bottom-6 -right-6 bg-warm-white border border-[rgba(60,42,20,0.12)] rounded-[4px] p-4 shadow-xl">
              <div className="text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-2">Mentors Online</div>
              <div className="flex">
                {[["K","bg-amber"],["A","bg-forest"],["T","bg-sky"],["R","bg-terra"]].map(([l,c],i)=>(
                  <div key={i} className={`w-9 h-9 rounded-full ${c} flex items-center justify-center font-serif text-[0.85rem] font-semibold text-cream border-2 border-warm-white ${i>0?"-ml-2":""}`}>{l}</div>
                ))}
              </div>
              <div className="text-[0.7rem] text-sage mt-1.5">4 available now</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <SectionLabel>For Members</SectionLabel>
            <h2 className="font-serif text-[clamp(2.2rem,3.5vw,3.2rem)] font-light leading-[1.1] mt-1 mb-5">
              Your faith community opens <em className="text-amber">real doors</em>
            </h2>
            <p className="text-[0.92rem] leading-[1.75] text-muted mb-8">
              Access a curated feed of jobs, internships, and volunteer opportunities matched to your skills — all connected through your church.
            </p>
            <ul className="space-y-3 mb-8">
              {["Personalised job feed based on your skills","Direct messaging with businesses and mentors","Track every application through to acceptance","One-on-one mentorship from verified professionals","Branch announcements and community updates"].map(f=>(
                <li key={f} className="flex gap-3 text-[0.88rem] leading-[1.6] text-rich-brown">
                  <span className="text-amber shrink-0 mt-0.5">→</span>{f}
                </li>
              ))}
            </ul>
            <Btn href="/signup">Join as a Member</Btn>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE CARDS ──────────────────────────────────── */}
      <section className="px-4 md:px-12 py-10 md:py-24" id="businesses">
        <SectionLabel>Who It's For</SectionLabel>
        <h2 className="font-serif text-[clamp(2.2rem,3.5vw,3.2rem)] font-light mb-12">
          Built for every <em className="text-amber">role</em>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { bg:"bg-sky",        titleColor:"text-cream",      title:"Businesses", desc:"Search and recruit from pre-vetted church members. Filter by skills, sector, location, and branch.",    cta:"Register as Business",  href:"/business-register", textColor:"text-white/70", btn:"primary" as const },
            { bg:"bg-forest",     titleColor:"text-cream",      title:"Mentors",    desc:"Share expertise with members who need guidance. Post mentorship opportunities and shape the next generation.", cta:"Become a Mentor",       href:"/mentor-register",   textColor:"text-white/70", btn:"primary" as const },
            { bg:"bg-amber",      titleColor:"text-deep-brown", title:"Churches",   desc:"Equip your congregation with opportunity. Manage your branch and watch members thrive through faith-rooted connections.", cta:"Register a Branch",     href:"/church-register",   textColor:"text-deep-brown/60", btn:"primary" as const },
          ].map((a)=>(
            <div key={a.title} className={`${a.bg} p-6 md:p-10 rounded-[4px] border border-[rgba(60,42,20,0.1)] flex flex-col`}>
              <h3 className={`font-serif text-[1.6rem] font-semibold ${a.titleColor} mb-3`}>{a.title}</h3>
              <p className={`text-[0.85rem] leading-[1.7] ${a.textColor} mb-8 flex-1`}>{a.desc}</p>
              <Btn href={a.href} variant={a.btn} small>{a.cta}</Btn>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHURCHES ────────────────────────────────────────── */}
      <section className="px-4 md:px-12 py-10 md:py-24 bg-deep-brown relative overflow-hidden" id="churches">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 60px,white 60px,white 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,white 60px,white 61px)" }} />
        <SectionLabel>Community</SectionLabel>
        <h2 className="font-serif text-[clamp(2.2rem,3.5vw,3.2rem)] font-light text-cream mb-4">
          Churches already <em className="text-gold">transforming</em> communities
        </h2>
        <p className="text-[0.92rem] leading-[1.75] text-white/45 max-w-md mb-12">Join branches across Nigeria and beyond turning Sunday pews into Monday opportunities.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.08]">
          {[["R","Redeemed CC","Lagos Mainland"],["H","House on the Rock","Victoria Island"],["D","Daystar","Oregun, Lagos"],["C","Chapel of Grace","Abuja"],["W","Winners Chapel","Port Harcourt"],["L","Lighthouse","Ibadan"],["M","Mountain of Fire","Enugu"],["+","Your Branch","Register today →"]].map(([l,n,loc])=>(
            <div key={n} className="bg-deep-brown hover:bg-amber/10 transition-colors p-4 md:p-8 text-center">
              <div className="w-14 h-14 rounded-full border border-amber/30 flex items-center justify-center font-serif text-[1.3rem] font-semibold text-gold mx-auto mb-3">{l}</div>
              <div className="font-serif text-[1rem] font-semibold text-cream mb-0.5">{n}</div>
              <div className="text-[0.7rem] tracking-wide text-white/35">{loc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="px-4 md:px-12 py-14 md:py-36 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(196,131,42,0.06),transparent_65%)] pointer-events-none" />
        <div className="flex items-center justify-center gap-2 text-[0.7rem] tracking-[0.18em] uppercase text-amber mb-4">
          <span className="w-6 h-px bg-amber block" /> Get Started Today <span className="w-6 h-px bg-amber block" />
        </div>
        <h2 className="font-serif text-[clamp(2.5rem,4.5vw,4.5rem)] font-light leading-[1.05] max-w-[650px] mx-auto mb-5">
          Your community is your <em className="text-amber">greatest asset</em>
        </h2>
        <p className="text-muted leading-[1.75] max-w-[440px] mx-auto mb-10 text-[0.95rem]">
          Join thousands of church members, businesses, and mentors building something bigger than themselves.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Btn href="/signup">Join as Member</Btn>
          <Btn href="/login" variant="outline">Login</Btn>
          <Btn href="/business-register" variant="ghost">Register Business</Btn>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="bg-deep-brown px-4 md:px-12 pt-8 md:pt-16 pb-6 md:pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 pb-8 md:pb-12 border-b border-white/[0.06] mb-8">
          <div>
            <div className="font-serif text-[1.3rem] font-semibold text-cream mb-3">Redeem <em className="text-gold">Oneness</em></div>
            <p className="text-[0.82rem] leading-[1.7] text-white/40 max-w-[260px]">Connecting faith communities with economic opportunity — one branch at a time.</p>
          </div>
          {[["Platform",["Member Sign Up","Business Registration","Church Branch","Mentor Portal","Login"]],["Company",["About Us","Our Mission","Blog","Careers","Contact"]],["Legal",["Privacy Policy","Terms of Service","Cookie Policy"]]].map(([h,ls])=>(
            <div key={h as string}>
              <div className="text-[0.68rem] tracking-[0.14em] uppercase text-gold mb-4 font-medium">{h}</div>
              {(ls as string[]).map(l=><div key={l} className="text-[0.8rem] text-white/40 mb-2 cursor-pointer hover:text-cream/70 transition-colors">{l}</div>)}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-1 text-[0.72rem] text-white/25">
          <span>© 2025 Redeem Oneness. All rights reserved.</span>
          <span>Built with faith &amp; purpose.</span>
        </div>
      </footer>
    </div>
  );
}
