import { PageTitle, StatCard, Card, Avatar, Btn } from "@/components/ui";

export default function MentorHomePage() {
  return (
    <>
      <PageTitle label="Mentor Dashboard" title="Welcome, Adaeze" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard number="8" label="Active Mentees"   icon="◈" colorClass="text-amber" />
        <StatCard number="3" label="Pending Requests" icon="⌛" colorClass="text-terra" />
        <StatCard number="2" label="Announcements"    icon="📢" colorClass="text-sage"  />
      </div>
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div>
          <h2 className="font-serif text-[1.3rem] font-semibold mb-4">Recent Requests</h2>
          {[{n:"Chidera O.",msg:"Hi Adaeze! I'd love guidance on breaking into product design from frontend development.",c:"bg-amber"},{n:"Emeka T.",msg:"I'm preparing for a UX interview and could use your advice on portfolio presentation.",c:"bg-sage"}].map(r=>(
            <Card key={r.n} hover className="mb-3">
              <div className="flex gap-4 items-start mb-4">
                <Avatar name={r.n} size={42} colorClass={r.c} />
                <div>
                  <p className="font-medium mb-1">{r.n}</p>
                  <p className="text-[0.82rem] text-muted leading-[1.6]">{r.msg}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Btn small variant="sage">Accept</Btn>
                <Btn small variant="ghost" href="/mentor/messages">Message</Btn>
                <Btn small variant="danger">Decline</Btn>
              </div>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Recent Conversations</p>
            {[{n:"Chidera O.",l:"Thanks for the feedback!",c:"bg-amber"},{n:"Blessing A.",l:"I updated my portfolio.",c:"bg-terra"}].map(c=>(
              <div key={c.n} className="flex gap-3 items-center mb-3 cursor-pointer hover:opacity-80">
                <Avatar name={c.n} size={34} colorClass={c.c} />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.83rem] font-medium">{c.n}</p>
                  <p className="text-[0.72rem] text-muted truncate">{c.l}</p>
                </div>
              </div>
            ))}
            <Btn small variant="ghost" href="/mentor/messages" className="mt-1">View all messages</Btn>
          </Card>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Your Announcements</p>
            <div className="bg-cream rounded-sm p-3 text-[0.82rem] leading-[1.6] text-rich-brown mb-3">
              Looking for 3 students interested in UI design mentorship...
            </div>
            <Btn small variant="ghost" href="/mentor/announcements">Post New Announcement</Btn>
          </Card>
        </div>
      </div>
    </>
  );
}
