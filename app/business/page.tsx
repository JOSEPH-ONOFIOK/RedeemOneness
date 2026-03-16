import { PageTitle, StatCard, Card, Badge, Btn, Avatar } from "@/components/ui";

export default function BusinessHomePage() {
  return (
    <>
      <PageTitle label="Overview" title="Business Dashboard" action={<Btn href="/business/post-job">+ Post New Job</Btn>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard number="6"  label="Active Jobs"    icon="⚡" colorClass="text-amber"      />
        <StatCard number="84" label="Applications"   icon="◈" colorClass="text-sage"       />
        <StatCard number="12" label="Shortlisted"    icon="✦" colorClass="text-terra"      />
        <StatCard number="3"  label="Hired"          icon="✓" colorClass="text-deep-brown" />
      </div>
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <h2 className="font-serif text-[1.3rem] font-semibold mb-4">Active Job Postings</h2>
          <div className="space-y-3">
            {[{role:"Frontend Intern",apps:18,deadline:"Mar 30"},{role:"Product Designer",apps:24,deadline:"Apr 5"},{role:"Data Analyst",apps:15,deadline:"Apr 10"}].map(j=>(
              <Card key={j.role} hover>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-serif text-[1.05rem] font-semibold mb-0.5">{j.role}</p>
                    <p className="text-[0.75rem] text-muted">{j.apps} applicants · Deadline: {j.deadline}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge type="new">Active</Badge>
                    <Btn small variant="ghost" href="/business/applications">View</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Recommended Candidates</p>
            {[{n:"Chidera O.",s:"React, Figma",c:"bg-amber"},{n:"Emeka T.",s:"Finance, Excel",c:"bg-sage"},{n:"Blessing A.",s:"UI Design, CSS",c:"bg-terra"}].map(c=>(
              <div key={c.n} className="flex items-center gap-3 mb-3 last:mb-0">
                <Avatar name={c.n} size={36} colorClass={c.c} />
                <div className="flex-1">
                  <p className="text-[0.85rem] font-medium">{c.n}</p>
                  <p className="text-[0.7rem] text-muted">{c.s}</p>
                </div>
                <Btn small variant="ghost" href="/business/search-members/1">View</Btn>
              </div>
            ))}
          </Card>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Recent Applications</p>
            {[["Chidera Okafor","Frontend Intern","new"],["Emeka Tunde","Data Analyst","viewed"]].map(([n,r,s],i)=>(
              <div key={i} className="flex justify-between items-center mb-2 text-[0.82rem]">
                <span>{n} — <span className="text-muted">{r}</span></span>
                <Badge type={s as "new"|"viewed"}>{s}</Badge>
              </div>
            ))}
            <Btn small variant="ghost" href="/business/applications" className="mt-2">All Applications</Btn>
          </Card>
        </div>
      </div>
    </>
  );
}
