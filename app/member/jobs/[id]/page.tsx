import Link from "next/link";
import { SectionLabel, Card, Tag, Badge, Btn } from "@/components/ui";

export default function JobDetailPage() {
  return (
    <div className="max-w-[820px]">
      <Link href="/member/jobs" className="text-[0.8rem] text-muted hover:text-deep-brown transition-colors block mb-6">← Back to Jobs</Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <SectionLabel>Job Opportunity</SectionLabel>
          <h1 className="font-serif text-[2.4rem] font-light leading-tight">
            Frontend Developer <em className="text-amber">Intern</em>
          </h1>
          <p className="text-[0.85rem] text-muted mt-1.5">XYZ Tech Ltd · Lagos, Nigeria · Posted 2 days ago</p>
        </div>
        <div className="flex gap-2 mt-2 shrink-0">
          <Btn href="/member/applications">Apply Now</Btn>
          <Btn variant="ghost">Save Job</Btn>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_270px] gap-6">
        <div className="space-y-4">
          <Card>
            <h3 className="font-serif text-[1.2rem] mb-4">Job Description</h3>
            <p className="text-[0.88rem] leading-[1.8] text-rich-brown mb-4">
              We are looking for a motivated Frontend Developer Intern to join our growing team. You will work on real products used by thousands of users, collaborating with senior engineers and designers.
            </p>
            <p className="text-[0.88rem] leading-[1.8] text-rich-brown">
              This is a 6-month paid internship with the potential for full-time employment. You'll gain exposure to our full development cycle from design handoff to deployment.
            </p>
          </Card>
          <Card>
            <h3 className="font-serif text-[1.2rem] mb-4">Requirements</h3>
            <ul className="space-y-2.5">
              {["Proficiency in React and modern JavaScript (ES6+)","Understanding of CSS, Tailwind, or styled-components","Familiarity with Git and collaborative workflows","Basic understanding of REST APIs","Ability to translate Figma designs into responsive code"].map(r=>(
                <li key={r} className="flex gap-3 text-[0.85rem] leading-[1.6] text-rich-brown">
                  <span className="text-amber shrink-0">→</span>{r}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Job Details</p>
            <dl className="space-y-2.5">
              {[["Type","Internship"],["Sector","Technology"],["Location","Lagos (Hybrid)"],["Deadline","March 30, 2025"],["Duration","6 months"]].map(([k,v])=>(
                <div key={k} className="flex justify-between text-[0.82rem]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Required Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {["React","JavaScript","CSS","Git","Figma"].map(s=><Tag key={s} amber>{s}</Tag>)}
            </div>
          </Card>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-2">About XYZ Tech</p>
            <p className="text-[0.8rem] leading-[1.7] text-muted mb-3">A leading fintech startup building inclusive financial tools for West Africa.</p>
            <Btn small variant="ghost" href="/member/messages">Message Company</Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}
