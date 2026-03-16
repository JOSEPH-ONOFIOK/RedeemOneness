import { PageTitle, Card, Badge, Tag, Btn, Avatar } from "@/components/ui";

const APPS = [
  { n:"Chidera Okafor",  role:"Frontend Intern",  date:"Mar 10", skills:["React","CSS"],      status:"interview" as const, c:"bg-amber" },
  { n:"Blessing Adeyemi",role:"Frontend Intern",  date:"Mar 9",  skills:["Vue.js","Figma"],   status:"new"       as const, c:"bg-sage"  },
  { n:"Emeka Tunde",     role:"Data Analyst",     date:"Mar 8",  skills:["Python","Excel"],   status:"viewed"    as const, c:"bg-amber" },
  { n:"Ngozi Okonkwo",   role:"Product Designer", date:"Mar 7",  skills:["Figma","UX"],       status:"pending"   as const, c:"bg-terra" },
];

export default function BizApplicationsPage() {
  return (
    <>
      <PageTitle label="Recruitment" title="Applications" />
      <div className="flex gap-2 mb-5 flex-wrap">
        {["All Jobs","Frontend Intern","Product Designer","Data Analyst"].map((f,i)=>(
          <button key={f} className={`px-4 py-1.5 rounded-sm text-[0.75rem] border transition-colors ${i===0?"bg-deep-brown text-cream border-deep-brown":"border-[rgba(60,42,20,0.15)] text-muted hover:border-deep-brown"}`}>{f}</button>
        ))}
      </div>
      <div className="space-y-3">
        {APPS.map((a)=>(
          <Card key={a.n} hover>
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center flex-1">
                <Avatar name={a.n} size={40} colorClass={a.c} />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-[0.9rem]">{a.n}</span>
                    <Badge type={a.status}>{a.status}</Badge>
                  </div>
                  <p className="text-[0.75rem] text-muted mb-1">{a.role} · Applied {a.date}</p>
                  <div className="flex gap-1.5">{a.skills.map(s=><Tag key={s}>{s}</Tag>)}</div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Btn small variant="ghost" href="/business/search-members/1">Profile</Btn>
                <Btn small variant="sage">Shortlist</Btn>
                <Btn small variant="danger">Reject</Btn>
                <Btn small variant="ghost" href="/business/messages">Message</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
