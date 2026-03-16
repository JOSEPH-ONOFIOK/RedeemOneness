import { PageTitle, StatCard, Card, Avatar, Badge, Btn } from "@/components/ui";

export default function AdminHomePage() {
  return (
    <>
      <PageTitle label="Branch Admin" title="RCCG Lagos Island" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard number="248" label="Total Members"    icon="◉" colorClass="text-amber"      />
        <StatCard number="12"  label="New This Week"    icon="✦" colorClass="text-sage"       />
        <StatCard number="6"   label="Pending Approval" icon="⌛" colorClass="text-terra"      />
        <StatCard number="3"   label="Announcements"    icon="📢" colorClass="text-rich-brown" />
      </div>
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div>
          <h2 className="font-serif text-[1.3rem] font-semibold mb-4">Skills Distribution</h2>
          <Card className="mb-6">
            {[["Technology",68,"bg-amber"],["Finance",42,"bg-sage"],["Creative",35,"bg-terra"],["Education",28,"bg-rich-brown"],["Healthcare",22,"bg-muted"]].map(([l,v,c])=>(
              <div key={l as string} className="mb-4 last:mb-0">
                <div className="flex justify-between text-[0.8rem] mb-1.5">
                  <span>{l}</span><span className="text-muted">{v} members</span>
                </div>
                <div className="w-full h-1.5 bg-[rgba(60,42,20,0.1)] rounded-sm">
                  <div className={`h-full ${c} rounded-sm`} style={{width:`${(Number(v)/68)*100}%`}} />
                </div>
              </div>
            ))}
          </Card>
          <h2 className="font-serif text-[1.3rem] font-semibold mb-4">Recent Registrations</h2>
          <div className="space-y-2">
            {[{n:"Chidera Okafor",s:"Technology",date:"Today",c:"bg-amber"},{n:"Emeka Tunde",s:"Finance",date:"Yesterday",c:"bg-sage"},{n:"Blessing Adeyemi",s:"Design",date:"2 days ago",c:"bg-terra"}].map(m=>(
              <Card key={m.n} hover className="py-3 px-5">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Avatar name={m.n} size={34} colorClass={m.c} />
                    <div>
                      <p className="text-[0.85rem] font-medium">{m.n}</p>
                      <p className="text-[0.7rem] text-muted">{m.s} · {m.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Btn small variant="sage">Approve</Btn>
                    <Btn small variant="ghost" href="/admin/members">View</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Recent Announcements</p>
            {["Job fair this Saturday at the main hall. All members welcome!","New mentorship cohort launching in April — register your interest."].map((a,i)=>(
              <div key={i} className="bg-cream rounded-sm p-3 mb-2 text-[0.8rem] leading-[1.6] text-rich-brown">📢 {a}</div>
            ))}
            <Btn small variant="ghost" href="/admin/announcements">Post Announcement</Btn>
          </Card>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Quick Actions</p>
            {[["Approve Pending Members","/admin/members"],["Post Announcement","/admin/announcements"],["Search Members","/admin/search"],["Manage Admins","/admin/admins"]].map(([l,h])=>(
              <a key={l} href={h} className="block py-2 border-b border-[rgba(60,42,20,0.06)] text-[0.82rem] text-amber hover:text-deep-brown transition-colors">
                {l} →
              </a>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
