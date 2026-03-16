import { PageTitle, Card, FormInput, FormTextarea, FormSelect, SkillTagsInput, Btn } from "@/components/ui";

export default function EditProfilePage() {
  return (
    <>
      <PageTitle label="Settings" title="Edit Profile" action={<Btn href="/member/profile">Save Changes</Btn>} />
      <div className="max-w-[600px]">
        <Card>
          <FormInput label="Full Name" placeholder="Chidera Okafor" />
          <FormInput label="Location"  placeholder="Lagos, Nigeria" />
          <FormTextarea label="Bio" placeholder="Tell employers and mentors about yourself…" rows={4} />
          <SkillTagsInput label="Skills" initial={["React","JavaScript","Figma","CSS","Excel"]} />
          <FormSelect label="Sector Interests"  options={["Technology","Finance","Healthcare","Education","Creative Arts"]} />
          <FormSelect label="Job Categories"    options={["Internship","Full-time","Part-time","Volunteer","Freelance"]} />
          <FormSelect label="Contact Visibility" options={["Visible to All","Visible to Businesses Only","Hidden"]} />
        </Card>
      </div>
    </>
  );
}
