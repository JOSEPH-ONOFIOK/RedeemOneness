import Link from "next/link";
import { SectionLabel, Card, Tag, Btn, Avatar } from "@/components/ui";

export default function MemberProfileBizPage() {
  return (
    <div className="max-w-[860px]">
      <Link href="/business/search-members" className="text-[0.8rem] text-muted hover:text-deep-brown block mb-6">← Back to Search</Link>
      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        <div>
          <div className="flex gap-6 items-start mb-8">
            <Avatar name="C" size={72} colorClass="bg-amber" />
            <div>
              <SectionLabel>Member Profile</SectionLabel>
              <h1 className="font-serif text-[2.2rem] font-light">Chidera <em className="text-amber">Okafor</em></h1>
              <p className="text-[0.85rem] text-muted">Lagos, Nigeria · RCCG Lagos Island</p>
            </div>
          </div>
          <Card className="mb-4">
            <h3 className="font-serif text-[1.2rem] mb-3">Skills</h3>
            <div className="flex flex-wrap gap-1.5">{["React","JavaScript","CSS","Figma","Git","Node.js"].map(s=><Tag key={s} amber>{s}</Tag>)}</div>
          </Card>
          <Card className="mb-4">
            <h3 className="font-serif text-[1.2rem] mb-3">Sector Interests</h3>
            <div className="flex flex-wrap gap-1.5">{["Technology","Finance","Creative Arts"].map(s=><Tag key={s}>{s}</Tag>)}</div>
          </Card>
          <Card>
            <h3 className="font-serif text-[1.2rem] mb-2">Portfolio</h3>
            <p className="text-[0.85rem] text-muted">Portfolio items visible to verified businesses.</p>
          </Card>
        </div>
        <div className="space-y-4">
          <Btn className="w-full justify-center" href="/business/messages">Message Member</Btn>
          <Btn variant="outline" className="w-full justify-center">Invite to Apply</Btn>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Details</p>
            <dl className="space-y-2">
              {[["Location","Lagos, NG"],["Branch","RCCG Lagos Island"],["Job Type","Internship, Freelance"],["Availability","Immediately"]].map(([k,v])=>(
                <div key={k} className="flex justify-between text-[0.82rem]">
                  <dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
