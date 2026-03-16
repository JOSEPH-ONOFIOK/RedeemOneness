import { PageTitle, Card, FormSelect, FormInput, SkillTagsInput, Avatar, Tag, Btn } from "@/components/ui";

const MEMBERS = [
  { n:"Chidera Okafor",  loc:"Lagos", branch:"RCCG Lagos Island", skills:["React","Figma","JavaScript"], c:"bg-amber"      },
  { n:"Emeka Tunde",     loc:"Lagos", branch:"Daystar",            skills:["Finance","Excel","IFRS"],     c:"bg-sage"       },
  { n:"Blessing Adeyemi",loc:"Lagos", branch:"House on the Rock",  skills:["UI Design","CSS","Figma"],    c:"bg-terra"      },
  { n:"Ngozi Okonkwo",   loc:"Abuja", branch:"RCCG Abuja",         skills:["Marketing","Content"],        c:"bg-rich-brown" },
];

export default function SearchMembersPage() {
  return (
    <>
      <PageTitle label="Recruit" title="Search Members" />
      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <div>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Filters</p>
            <SkillTagsInput label="Skills" initial={["React"]} />
            <FormSelect label="Sector"         options={["All Sectors","Technology","Finance","Healthcare"]} />
            <FormInput  label="Location (km)"  type="number" placeholder="50" />
            <FormSelect label="Church Branch"  options={["All Branches","RCCG Lagos Island","Daystar","House on the Rock"]} />
            <FormSelect label="Experience"     options={["Any Level","Student","Entry Level","Mid Level"]} />
            <Btn small className="w-full justify-center">Search</Btn>
          </Card>
        </div>
        <div>
          <p className="text-[0.82rem] text-muted mb-4">43 members match your criteria</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {MEMBERS.map(m=>(
              <Card key={m.n} hover>
                <div className="flex gap-3 mb-3">
                  <Avatar name={m.n} size={42} colorClass={m.c} />
                  <div>
                    <p className="font-serif text-[0.95rem] font-semibold">{m.n}</p>
                    <p className="text-[0.7rem] text-muted">{m.loc} · {m.branch}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">{m.skills.map(s=><Tag key={s}>{s}</Tag>)}</div>
                <div className="flex gap-2">
                  <Btn small href={`/business/search-members/1`}>View Profile</Btn>
                  <Btn small variant="ghost">Invite</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
