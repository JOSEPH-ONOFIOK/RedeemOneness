import { PageTitle, Card, FormSelect, FormInput, FormTextarea, Btn } from "@/components/ui";

export default function AdminAnnouncementsPage() {
  return (
    <>
      <PageTitle label="Broadcast" title="Send Announcement" />
      <div className="grid md:grid-cols-[1fr_280px] gap-6 max-w-[900px]">
        <Card>
          <FormTextarea label="Announcement Message" placeholder="Type your announcement to branch members…" rows={5} />
          <div className="border-t border-[rgba(60,42,20,0.1)] pt-5 mt-1">
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Target Recipients</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {["All Members","By Sector","By Skills","By Location"].map((f,i)=>(
                <button key={f} className={`px-3 py-1.5 rounded-sm text-[0.73rem] border transition-colors ${i===0?"bg-deep-brown text-cream border-deep-brown":"border-[rgba(60,42,20,0.15)] text-muted hover:border-deep-brown"}`}>{f}</button>
              ))}
            </div>
            <FormSelect label="Sector Filter" options={["All Sectors","Technology","Finance","Design"]} />
            <FormInput  label="Location Radius (km)" type="number" placeholder="10" />
          </div>
          <div className="flex gap-3">
            <Btn className="flex-1 justify-center">Send to 248 Members</Btn>
            <Btn variant="ghost">Preview</Btn>
          </div>
        </Card>
        <Card>
          <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Previous Announcements</p>
          {["Job fair this Saturday at the main hall — all members welcome!","New mentorship cohort launching in April.","Skill-up workshop: Public speaking — next Sunday after service."].map((a,i)=>(
            <div key={i} className="bg-cream rounded-sm p-3 mb-3 text-[0.8rem] leading-[1.6] text-rich-brown">
              {a}
              <p className="text-[0.68rem] text-muted mt-1">{["2 days ago","1 week ago","2 weeks ago"][i]} · Sent to all</p>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
