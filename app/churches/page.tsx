import Link from "next/link";
import { Btn, SectionLabel } from "@/components/ui";

const features = [
  { icon: "📲", title: "Unique Branch QR Code",     desc: "Every registered branch gets a unique QR code. Print it, project it on Sunday, or share it digitally — members scan it to join your branch." },
  { icon: "👥", title: "Member Management",          desc: "View all members linked to your branch, see their profiles, skills, and activity. Export member data for offline use." },
  { icon: "📢", title: "Branch Announcements",       desc: "Post announcements directly to your congregation's feed — opportunities, events, prayer requests, and community news." },
  { icon: "🔍", title: "Search Across Branches",     desc: "Admins with multi-branch access can search members across all linked branches to coordinate opportunities." },
  { icon: "📊", title: "Branch Analytics",           desc: "Track QR code scans, member growth, job applications, and mentorship activity across your branch." },
  { icon: "⚙️", title: "Admin Controls",             desc: "Manage admin accounts, update branch details, regenerate your QR code, and control branch settings from one place." },
];

const branches = [
  { l:"R", name:"Redeemed CC",        loc:"Lagos Mainland" },
  { l:"H", name:"House on the Rock",  loc:"Victoria Island" },
  { l:"D", name:"Daystar",            loc:"Oregun, Lagos" },
  { l:"C", name:"Chapel of Grace",    loc:"Abuja" },
  { l:"W", name:"Winners Chapel",     loc:"Port Harcourt" },
  { l:"L", name:"Lighthouse",         loc:"Ibadan" },
  { l:"M", name:"Mountain of Fire",   loc:"Enugu" },
];

export default function ChurchesPage() {
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
      <section className="min-h-[70vh] flex flex-col justify-center px-12 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(196,131,42,0.06),transparent_70%)] pointer-events-none" />
        <div className="max-w-[640px] relative z-10">
          <SectionLabel>For Churches</SectionLabel>
          <h1 className="font-serif text-[clamp(2.8rem,5vw,5rem)] font-light leading-[1.05] mt-2 mb-5">
            Equip your <em className="text-amber">congregation</em> with opportunity
          </h1>
          <p className="text-[0.95rem] leading-[1.75] text-muted mb-8">
            Register your church branch, generate a QR code, and watch your members connect to jobs and mentors. Faith-rooted. Community-powered.
          </p>
          <div className="flex flex-wrap gap-3">
            <Btn href="/church-register">Register a Branch</Btn>
            <Btn href="/how-it-works" variant="outline">How it works</Btn>
          </div>
          <p className="text-[0.78rem] text-muted mt-4">
            Already registered? <Link href="/login" className="text-amber hover:underline">Admin sign in →</Link>
          </p>
        </div>
      </section>

      {/* QR flow highlight */}
      <section className="bg-deep-brown px-12 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 60px,white 60px,white 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,white 60px,white 61px)" }} />
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <SectionLabel center>The QR System</SectionLabel>
          <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] font-light text-cream mt-3 mb-5">
            One QR code. Your entire congregation.
          </h2>
          <p className="text-white/50 text-[0.9rem] leading-[1.75] max-w-[480px] mx-auto mb-12">
            When your branch registers, the system generates a unique QR code. Every new member scans it during signup — permanently linking them to your branch.
          </p>
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.08]">
            {[
              { icon:"⛪", step:"Register Branch",  desc:"Complete your branch registration. The system instantly generates your unique QR code." },
              { icon:"🖨️", step:"Share the QR",     desc:"Print it on a bulletin, project it on screen, or share the link via WhatsApp with your congregation." },
              { icon:"👥", step:"Members Join",      desc:"Members scan the QR to begin registration. Their branch is permanently tied to their account." },
            ].map((s)=>(
              <div key={s.step} className="p-10 text-center">
                <div className="text-[2rem] mb-3">{s.icon}</div>
                <h3 className="font-serif text-[1.05rem] font-semibold text-cream mb-2">{s.step}</h3>
                <p className="text-[0.82rem] text-white/45 leading-[1.7]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin features */}
      <section className="px-12 py-24">
        <SectionLabel>Admin Features</SectionLabel>
        <h2 className="font-serif text-[clamp(2rem,3vw,2.8rem)] font-light mb-12">Everything you need to manage your branch</h2>
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

      {/* Branches already on platform */}
      <section className="px-12 py-24 bg-cream">
        <SectionLabel>Community</SectionLabel>
        <h2 className="font-serif text-[clamp(2rem,3vw,2.8rem)] font-light mb-3">Branches already transforming communities</h2>
        <p className="text-muted text-[0.88rem] mb-12 max-w-[440px]">
          Join branches across Nigeria turning Sunday pews into Monday opportunities.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {branches.map((b)=>(
            <div key={b.name} className="bg-warm-white border border-[rgba(60,42,20,0.1)] rounded-[4px] p-6 text-center">
              <div className="w-12 h-12 rounded-full border border-amber/30 flex items-center justify-center font-serif text-[1.1rem] font-semibold text-amber mx-auto mb-3">{b.l}</div>
              <div className="font-serif text-[0.95rem] font-semibold mb-0.5">{b.name}</div>
              <div className="text-[0.7rem] text-muted">{b.loc}</div>
            </div>
          ))}
          <div className="bg-amber rounded-[4px] p-6 text-center flex flex-col items-center justify-center">
            <div className="font-serif text-[2rem] font-light text-deep-brown mb-1">+</div>
            <div className="font-serif text-[0.95rem] font-semibold text-deep-brown">Your Branch</div>
            <div className="text-[0.7rem] text-deep-brown/60 mt-0.5">Register today</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-12 py-28 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(196,131,42,0.06),transparent_65%)] pointer-events-none" />
        <h2 className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] font-light leading-[1.05] max-w-[600px] mx-auto mb-5">
          Ready to activate your <em className="text-amber">congregation&apos;s</em> potential?
        </h2>
        <p className="text-muted text-[0.92rem] mb-8 max-w-[400px] mx-auto">Registration takes less than 5 minutes. Your QR code is generated instantly.</p>
        <Btn href="/church-register">Register a Branch</Btn>
      </section>
    </div>
  );
}
