import Link from "next/link";
import { SectionLabel, Card, Tag, Badge, Btn, Avatar } from "@/components/ui";

export default function AdminMemberDetailPage() {
  return (
    <div className="max-w-[860px]">
      <Link href="/admin/members" className="text-[0.8rem] text-muted hover:text-deep-brown block mb-6">← Back to Members</Link>
      <div className="grid md:grid-cols-[1fr_260px] gap-6">
        <div>
          <div className="flex gap-6 items-start mb-8">
            <Avatar name="C" size={64} colorClass="bg-amber" />
            <div>
              <SectionLabel>Member Details</SectionLabel>
              <h1 className="font-serif text-[2rem] font-light">Chidera <em className="text-amber">Okafor</em></h1>
              <p className="text-[0.82rem] text-muted">Lagos · RCCG Lagos Island · Joined Mar 10</p>
            </div>
          </div>
          <Card className="mb-4">
            <h3 className="font-serif text-[1.1rem] mb-3">Skills</h3>
            <div className="flex flex-wrap gap-1.5">{["React","JavaScript","CSS","Figma"].map(s=><Tag key={s} amber>{s}</Tag>)}</div>
          </Card>
          <Card className="mb-4">
            <h3 className="font-serif text-[1.1rem] mb-3">Sector Interests</h3>
            <div className="flex flex-wrap gap-1.5">{["Technology","Creative Arts"].map(s=><Tag key={s}>{s}</Tag>)}</div>
          </Card>
          <Card>
            <h3 className="font-serif text-[1.1rem] mb-3">Activity</h3>
            <dl className="space-y-2">
              {[["Applications Submitted","5"],["Jobs Viewed","18"],["Mentor Sessions","2"],["Last Active","Today"]].map(([k,v])=>(
                <div key={k} className="flex justify-between text-[0.82rem] pb-2 border-b border-[rgba(60,42,20,0.06)]">
                  <dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Admin Actions</p>
            <div className="space-y-2">
              <Btn variant="sage" className="w-full justify-center">Approve Member</Btn>
              <Btn variant="ghost" className="w-full justify-center">Message Member</Btn>
              <Btn variant="danger" className="w-full justify-center">Suspend Member</Btn>
            </div>
          </Card>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-2">Status</p>
            <Badge type="pending">Pending Approval</Badge>
          </Card>
        </div>
      </div>
    </div>
  );
}
