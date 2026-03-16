import { PageTitle, Card, FormSelect, Avatar, Badge, Btn } from "@/components/ui";

export default function AdminMembersPage() {
  return (
    <>
      <PageTitle label="Branch" title="Members" action={<Badge type="pending">6 Pending</Badge>} />
      <div className="grid md:grid-cols-[200px_1fr] gap-6">
        <Card>
          <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Filter</p>
          <FormSelect label="Sector" options={["All Sectors","Technology","Finance","Design"]} />
          <FormSelect label="Status" options={["All Members","Active","Pending","Inactive"]} />
        </Card>
        <div>
          <p className="text-[0.82rem] text-muted mb-4">248 members total</p>
          <div className="space-y-2">
            {[{n:"Chidera Okafor",s:"Technology",loc:"Lagos",status:"active",date:"Mar 10"},{n:"Emeka Tunde",s:"Finance",loc:"Lagos",status:"pending",date:"Mar 9"},{n:"Blessing Adeyemi",s:"Design",loc:"Lagos",status:"active",date:"Mar 8"},{n:"Ngozi Okonkwo",s:"Education",loc:"Lagos",status:"pending",date:"Mar 7"},{n:"Kemi Adesanya",s:"Healthcare",loc:"Lagos",status:"active",date:"Feb 28"}].map((m,i)=>(
              <Card key={m.n} hover className="py-3 px-5">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Avatar name={m.n} size={38} colorClass={i%3===0?"bg-amber":i%3===1?"bg-sage":"bg-terra"} />
                    <div>
                      <p className="font-medium text-[0.88rem]">{m.n}</p>
                      <p className="text-[0.7rem] text-muted">{m.s} · {m.loc} · Joined {m.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge type={m.status==="active"?"accepted":"pending"}>{m.status}</Badge>
                    {m.status==="pending" && <Btn small variant="sage">Approve</Btn>}
                    <Btn small variant="ghost" href={`/admin/members/1`}>Details</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
