import { PageTitle, Card, FormInput, FormSelect, FormTextarea, Badge, Btn } from "@/components/ui";

export default function CompanyProfilePage() {
  return (
    <>
      <PageTitle label="Company" title="Company Profile" action={<Btn>Save Changes</Btn>} />
      <div className="grid md:grid-cols-[1fr_300px] gap-6 max-w-[900px]">
        <Card>
          <div className="flex gap-4 items-center mb-6">
            <div className="w-16 h-16 bg-deep-brown rounded-[4px] flex items-center justify-center font-serif text-[1.6rem] text-gold shrink-0">X</div>
            <div>
              <p className="font-serif text-[1.4rem] font-semibold">XYZ Tech Ltd</p>
              <p className="text-[0.8rem] text-muted">Technology · Lagos, Nigeria</p>
            </div>
          </div>
          <FormInput    label="Company Name"    placeholder="XYZ Tech Ltd" />
          <FormSelect   label="Industry Sector" options={["Technology","Finance","Healthcare","Education"]} />
          <FormTextarea label="Company Description" placeholder="What does your company do?" rows={4} />
          <FormInput    label="Location"         placeholder="Lagos, Nigeria" />
          <FormInput    label="Contact Email"    type="email" />
          <FormInput    label="Website"          placeholder="https://" />
        </Card>
        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Active Jobs</p>
            {["Frontend Intern","Product Designer","Data Analyst"].map((j)=>(
              <div key={j} className="flex justify-between items-center py-2 border-b border-[rgba(60,42,20,0.06)] text-[0.85rem]">
                <span>{j}</span><Badge type="new">Active</Badge>
              </div>
            ))}
            <Btn small variant="ghost" href="/business/post-job" className="mt-3">+ Post New Job</Btn>
          </Card>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Stats</p>
            {[["Total Applications","84"],["Hired This Month","3"],["Profile Views","210"]].map(([k,v])=>(
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
