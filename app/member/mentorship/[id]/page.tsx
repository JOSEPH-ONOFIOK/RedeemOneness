import Link from "next/link";
import { SectionLabel, Card, Tag, Btn, Avatar } from "@/components/ui";

export default function MentorProfilePage() {
  return (
    <div className="max-w-[860px]">
      <Link href="/member/mentorship" className="text-[0.8rem] text-muted hover:text-deep-brown block mb-6">← Back to Mentors</Link>
      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        <div>
          <div className="flex gap-6 items-start mb-8">
            <Avatar name="A" size={72} colorClass="bg-terra" />
            <div>
              <SectionLabel>Mentor Profile</SectionLabel>
              <h1 className="font-serif text-[2.2rem] font-light">Adaeze <em className="text-amber">Obi</em></h1>
              <p className="text-[0.85rem] text-muted">UX / Product Design · Lagos · 8 years experience</p>
              <p className="text-[0.73rem] text-sage mt-1">● Currently Available</p>
            </div>
          </div>
          <Card className="mb-4">
            <h3 className="font-serif text-[1.2rem] mb-3">About</h3>
            <p className="text-[0.88rem] leading-[1.8] text-rich-brown">
              Principal designer at a leading fintech with over 8 years experience building products used by millions. I'm passionate about growing the next generation of African designers and technologists through hands-on mentorship.
            </p>
          </Card>
          <Card>
            <h3 className="font-serif text-[1.2rem] mb-3">Mentorship Areas</h3>
            <div className="flex flex-wrap gap-1.5">
              {["UI Design","UX Research","Product Thinking","Figma","Portfolio Review","Career Guidance"].map(s=><Tag key={s} amber>{s}</Tag>)}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Details</p>
            <dl className="space-y-2">
              {[["Sector","UX / Product Design"],["Experience","8 years"],["Location","Lagos, Nigeria"],["Availability","Weekends"],["Contact Via","Platform Messages"]].map(([k,v])=>(
                <div key={k} className="flex justify-between text-[0.82rem]">
                  <dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Btn className="w-full justify-center">Request Mentorship</Btn>
          <Btn variant="ghost" className="w-full justify-center" href="/member/messages">Send Message</Btn>
        </div>
      </div>
    </div>
  );
}
