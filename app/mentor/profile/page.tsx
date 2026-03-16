import { PageTitle, Card, FormInput, FormSelect, FormTextarea, Avatar, Btn } from "@/components/ui";

export default function MentorProfilePage() {
  return (
    <>
      <PageTitle label="Profile" title="My Mentor Profile" action={<Btn>Save Changes</Btn>} />
      <div className="grid md:grid-cols-[1fr_260px] gap-6 max-w-[860px]">
        <Card>
          <div className="flex gap-4 items-center mb-6">
            <Avatar name="A" size={64} colorClass="bg-terra" />
            <div>
              <p className="font-serif text-[1.4rem] font-semibold">Adaeze Obi</p>
              <p className="text-[0.75rem] text-sage">● Available for mentorship</p>
            </div>
          </div>
          <FormInput label="Full Name"           placeholder="Adaeze Obi" />
          <FormInput label="Location"            placeholder="Lagos, Nigeria" />
          <FormSelect label="Sector Expertise"   options={["UX / Product Design","Technology","Finance","Law","Medicine"]} />
          <FormInput label="Years of Experience" type="number" placeholder="8" />
          <FormTextarea label="Bio"              placeholder="Describe your expertise and mentorship approach…" rows={4} />
          <FormSelect label="Availability"       options={["Weekends Only","Weekdays (evenings)","Flexible","Currently Unavailable"]} />
          <FormSelect label="Preferred Contact"  options={["Platform Messages","Email","WhatsApp"]} />
        </Card>
        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Mentorship Stats</p>
            {[["Total Mentees","24"],["Active Sessions","8"],["Avg Rating","4.9/5"]].map(([k,v])=>(
              <div key={k} className="flex justify-between text-[0.82rem] mb-2">
                <span className="text-muted">{k}</span>
                <span className="font-serif font-semibold text-amber">{v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
