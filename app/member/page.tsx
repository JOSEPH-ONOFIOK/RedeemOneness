import Link from "next/link";
import { PageTitle, SectionLabel, Card, Badge, Tag, Btn, Avatar } from "@/components/ui";

const JOBS = [
  { co:"XYZ Tech",    role:"Frontend Intern",             loc:"Lagos",         tags:["React","CSS"],          type:"Internship", badge:"new"     as const },
  { co:"FinCorp Ltd", role:"Junior Accountant",           loc:"Abuja",         tags:["Excel","IFRS"],         type:"Job",        badge:"viewed"  as const },
  { co:"CreativeNGO", role:"Graphic Designer (Volunteer)",loc:"Remote",        tags:["Figma","Illustrator"],  type:"Volunteer",  badge:"default" as const },
  { co:"Healthbridge",role:"Community Health Officer",    loc:"Port Harcourt", tags:["Public Health"],        type:"Job",        badge:"new"     as const },
];

export default function MemberHomePage() {
  return (
    <>
      <PageTitle label="Good Morning" title="Chidera's Feed" />
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* Feed */}
        <div>
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["All","Jobs","Internships","Mentors","Announcements"].map((f,i)=>(
              <button key={f} className={`px-4 py-1.5 rounded-sm text-[0.75rem] border transition-colors ${i===0?"bg-deep-brown text-cream border-deep-brown":"border-[rgba(60,42,20,0.15)] text-muted hover:border-deep-brown hover:text-deep-brown"}`}>{f}</button>
            ))}
          </div>

          {/* Job cards */}
          <div className="space-y-4">
            {JOBS.map((j)=>(
              <Card key={j.role} hover>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif text-[1.1rem] font-semibold">{j.role}</span>
                      <Badge type={j.badge}>{j.badge}</Badge>
                    </div>
                    <div className="text-[0.78rem] text-muted">{j.co} · {j.loc}</div>
                  </div>
                  <Tag>{j.type}</Tag>
                </div>
                <div className="flex gap-1.5 mb-4">{j.tags.map(t=><Tag key={t}>{t}</Tag>)}</div>
                <div className="flex gap-2">
                  <Btn small href="/member/jobs/1">Apply</Btn>
                  <Btn small variant="ghost" href="/member/jobs/1">View Details</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Branch card */}
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-2">Your Branch</p>
            <p className="font-serif text-[1rem] font-semibold mb-0.5">RCCG Lagos Island</p>
            <p className="text-[0.78rem] text-muted mb-3">248 members · Pastor E. Adeyemi</p>
            <div className="bg-cream rounded-sm p-3 text-[0.8rem] text-rich-brown leading-[1.6]">
              📢 <strong>Announcement:</strong> Job fair this Saturday at the main hall. All members welcome!
            </div>
          </Card>

          {/* Profile strength */}
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-2">Profile Strength</p>
            <div className="w-full h-1.5 bg-[rgba(60,42,20,0.1)] rounded-sm mb-1.5">
              <div className="w-[72%] h-full bg-amber rounded-sm" />
            </div>
            <p className="text-[0.75rem] text-muted mb-3">72% complete — add a bio to improve</p>
            <Btn small variant="ghost" href="/member/profile/edit">Complete Profile</Btn>
          </Card>

          {/* Mentors */}
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Mentors Online</p>
            {[{n:"Kemi A.",s:"Finance",c:"bg-amber"},{n:"Tunde B.",s:"Tech",c:"bg-sage"},{n:"Adaeze",s:"Design",c:"bg-terra"}].map((m)=>(
              <div key={m.n} className="flex items-center gap-3 mb-3 last:mb-0">
                <Avatar name={m.n} size={34} colorClass={m.c} />
                <div className="flex-1">
                  <p className="text-[0.82rem] font-medium">{m.n}</p>
                  <p className="text-[0.7rem] text-muted">{m.s}</p>
                </div>
                <Btn small variant="ghost" href="/member/mentorship">Connect</Btn>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
