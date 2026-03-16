import { PageTitle, Card, FormInput, FormSelect, FormTextarea, SkillTagsInput, Btn } from "@/components/ui";

export default function PostJobPage() {
  return (
    <>
      <PageTitle label="Recruit" title="Post a Job" />
      <div className="max-w-[640px]">
        <Card>
          <FormInput label="Job Title" placeholder="e.g. Frontend Developer Intern" required />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Sector"       options={["Select sector…","Technology","Finance","Healthcare","Education","Creative"]} required />
            <FormSelect label="Job Category" options={["Select category…","Engineering","Design","Marketing","Finance","Operations"]} required />
          </div>
          <SkillTagsInput label="Skills Required" initial={["React","CSS","Git"]} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Location"            placeholder="Lagos, Nigeria" />
            <FormInput label="Search Radius (km)"  type="number" placeholder="50" />
          </div>
          <FormSelect label="Job Type" options={["Select type…","Internship","Full-time","Part-time","Volunteer","Contract"]} required />
          <FormInput label="Application Deadline" type="date" />
          <FormTextarea label="Job Description" placeholder="Describe the role, responsibilities, and what success looks like…" rows={5} />
          <div className="flex gap-3 mt-2">
            <Btn href="/business" className="flex-1 justify-center">Publish Job</Btn>
            <Btn variant="ghost">Save Draft</Btn>
          </div>
        </Card>
      </div>
    </>
  );
}
