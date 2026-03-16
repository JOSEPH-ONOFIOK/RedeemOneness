import { PageTitle, Card, FormSelect, FormInput, FormTextarea, SkillTagsInput, Btn } from "@/components/ui";

export default function MentorAnnouncementsPage() {
  return (
    <>
      <PageTitle label="Outreach" title="Post Announcement" />
      <div className="grid md:grid-cols-[1fr_300px] gap-6 max-w-[900px]">
        <Card>
          <FormTextarea label="Your Message" placeholder="e.g. Looking for 3 students interested in UI design mentorship…" rows={5} />
          <div className="border-t border-[rgba(60,42,20,0.1)] pt-5 mt-1">
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Target Audience</p>
            <FormSelect label="Sector" options={["All Sectors","Technology","Finance","Design","Education"]} />
            <SkillTagsInput label="Skills" initial={["Figma"]} />
            <FormInput label="Location Filter" placeholder="Lagos" />
          </div>
          <Btn className="w-full justify-center">Publish Announcement</Btn>
        </Card>
        <Card>
          <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Previous Announcements</p>
          {["Looking for 3 students in UI design mentorship. Open to all levels.","Finance mentorship cohort starting April. 4 spots available."].map((a,i)=>(
            <div key={i} className="bg-cream rounded-sm p-3 mb-3 text-[0.82rem] leading-[1.6] text-rich-brown">
              {a}
              <p className="text-[0.68rem] text-muted mt-1">Posted 2 weeks ago · 12 responses</p>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
