import { PageTitle, Card, Avatar, Btn } from "@/components/ui";

export default function MentorRequestsPage() {
  return (
    <>
      <PageTitle label="Mentorship" title="Requests" />
      <div className="space-y-4 max-w-[680px]">
        {[{n:"Chidera Okafor",sector:"Technology",msg:"Seeking guidance on transitioning from frontend to product design.",date:"Mar 10",c:"bg-amber"},{n:"Emeka Tunde",sector:"Finance",msg:"Need help preparing for interviews at top financial institutions.",date:"Mar 9",c:"bg-sage"},{n:"Blessing Adeyemi",sector:"Design",msg:"Looking for feedback on my portfolio before applying to top agencies.",date:"Mar 7",c:"bg-terra"}].map(r=>(
          <Card key={r.n} hover>
            <div className="flex gap-4 mb-4">
              <Avatar name={r.n} size={46} colorClass={r.c} />
              <div>
                <p className="font-medium mb-0.5">{r.n}</p>
                <p className="text-[0.75rem] text-muted">{r.sector} · Requested {r.date}</p>
              </div>
            </div>
            <p className="text-[0.83rem] leading-[1.7] text-rich-brown bg-cream p-3 rounded-sm mb-4">{r.msg}</p>
            <div className="flex gap-2">
              <Btn small variant="sage">Accept</Btn>
              <Btn small variant="ghost" href="/mentor/messages">Message First</Btn>
              <Btn small variant="danger">Decline</Btn>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
