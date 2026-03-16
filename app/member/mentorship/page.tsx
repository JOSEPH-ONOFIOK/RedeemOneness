import { PageTitle, Card, Avatar, Btn, FormSelect } from "@/components/ui";

const MENTORS = [
  { name:"Adaeze Obi",    sector:"UX / Product Design",  years:8,  bio:"Principal designer at a top fintech. Passionate about growing the next generation of African designers.", colorClass:"bg-terra",       available:true  },
  { name:"Kemi Adeyemi",  sector:"Finance & Investment",  years:12, bio:"CFO with deep experience in corporate finance, fundraising, and financial strategy.",                    colorClass:"bg-amber",       available:true  },
  { name:"Tunde Bakare",  sector:"Software Engineering",  years:10, bio:"Senior engineer at a global tech company. Specialises in backend systems and cloud architecture.",         colorClass:"bg-sage",        available:false },
  { name:"Dr. Ngozi Eze", sector:"Public Health",         years:15, bio:"Health consultant with a focus on community health systems in Sub-Saharan Africa.",                       colorClass:"bg-rich-brown",  available:true  },
];

export default function MentorshipPage() {
  return (
    <>
      <PageTitle label="Growth" title="Find a Mentor" />
      <div className="grid md:grid-cols-[200px_1fr] gap-8">
        <div>
          <div className="border border-[rgba(60,42,20,0.12)] rounded-[4px] bg-warm-white p-5">
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Filter Mentors</p>
            <FormSelect label="Sector"     options={["All Sectors","Technology","Finance","Law","Medicine"]} />
            <FormSelect label="Location"   options={["Any Location","Lagos","Abuja","Port Harcourt"]} />
            <FormSelect label="Experience" options={["Any Level","5-10 years","10-15 years","15+ years"]} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {MENTORS.map((m)=>(
            <Card key={m.name} hover>
              <div className="flex gap-3 mb-3">
                <Avatar name={m.name} size={48} colorClass={m.colorClass} />
                <div>
                  <p className="font-serif text-[1.05rem] font-semibold">{m.name}</p>
                  <p className="text-[0.73rem] text-muted">{m.sector}</p>
                  <p className={`text-[0.68rem] mt-0.5 ${m.available?"text-sage":"text-muted"}`}>
                    {m.available ? "● Available" : "○ Busy"}
                  </p>
                </div>
              </div>
              <p className="text-[0.78rem] text-muted mb-1">{m.years} years experience</p>
              <p className="text-[0.8rem] leading-[1.6] text-rich-brown mb-4">{m.bio}</p>
              <Btn small href="/member/mentorship/1">Request Mentorship</Btn>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
