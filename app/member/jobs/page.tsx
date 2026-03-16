import { PageTitle, Card, Badge, Tag, Btn, FormSelect, FormInput } from "@/components/ui";

const JOBS = [
  { co:"XYZ Tech",    role:"Frontend Intern",           loc:"Lagos",         tags:["React","TypeScript","CSS"],      type:"Internship", deadline:"Mar 30", badge:"new"     as const },
  { co:"FinCorp Ltd", role:"Junior Accountant",         loc:"Abuja",         tags:["Excel","IFRS","QuickBooks"],     type:"Job",        deadline:"Apr 5",  badge:"default" as const },
  { co:"Healthbridge",role:"Community Health Officer",  loc:"Port Harcourt", tags:["Public Health","Communication"], type:"Job",        deadline:"Apr 12", badge:"new"     as const },
  { co:"CreativeNGO", role:"Graphic Designer",          loc:"Remote",        tags:["Figma","Illustrator"],           type:"Volunteer",  deadline:"Open",   badge:"default" as const },
  { co:"EduStart",    role:"Teaching Assistant",        loc:"Ibadan",        tags:["Education","Maths"],             type:"Internship", deadline:"Apr 20", badge:"viewed"  as const },
];

export default function JobsPage() {
  return (
    <>
      <PageTitle label="Opportunities" title="Job Feed" />
      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar filters */}
        <div>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4 font-medium">Filters</p>
            <FormSelect label="Sector"        options={["All Sectors","Technology","Finance","Healthcare","Education"]} />
            <FormSelect label="Job Category"  options={["All Categories","Engineering","Design","Marketing","Operations"]} />
            <FormSelect label="Type"          options={["All Types","Job","Internship","Volunteer"]} />
            <FormInput  label="Distance (km)" type="number" placeholder="50" />
            <Btn small className="w-full justify-center">Apply Filters</Btn>
          </Card>
        </div>

        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-[0.82rem] text-muted">{JOBS.length} opportunities found</p>
            <FormSelect label="" options={["Most Recent","Best Match","Closest"]} />
          </div>
          <div className="space-y-3">
            {JOBS.map((j)=>(
              <Card key={j.role} hover>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif text-[1.05rem] font-semibold">{j.role}</span>
                      <Badge type={j.badge}>{j.badge}</Badge>
                    </div>
                    <p className="text-[0.75rem] text-muted mb-2">{j.co} · {j.loc} · Deadline: {j.deadline}</p>
                    <div className="flex flex-wrap gap-1.5">{j.tags.map(t=><Tag key={t}>{t}</Tag>)}</div>
                  </div>
                  <div className="flex flex-col gap-1.5 ml-4 items-end">
                    <Btn small href="/member/jobs/1">View</Btn>
                    <Tag>{j.type}</Tag>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
