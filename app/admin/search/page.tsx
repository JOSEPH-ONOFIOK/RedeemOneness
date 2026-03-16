import { PageTitle, Card, FormInput, FormSelect, Avatar, Tag, Btn } from "@/components/ui";

export default function AdminSearchPage() {
  return (
    <>
      <PageTitle label="Network" title="Search Across Branches" />
      <Card className="mb-6">
        <div className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
          <FormInput label="Skill"          placeholder="e.g. React" />
          <FormSelect label="Sector"        options={["All Sectors","Technology","Finance","Design","Healthcare"]} />
          <FormInput label="Distance (km)"  type="number" placeholder="25" />
          <Btn>Search</Btn>
        </div>
      </Card>
      <p className="text-[0.82rem] text-muted mb-4">Showing members across 8 nearby branches</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[{n:"Tunde Afolabi",branch:"Daystar Oregun",skills:["React","Node.js"],dist:"3.2km",c:"bg-sage"},{n:"Sola Badmus",branch:"Winners Lagos",skills:["Finance","IFRS"],dist:"5.1km",c:"bg-amber"},{n:"Chinwe Eze",branch:"Chapel of Grace",skills:["UI/UX","Figma"],dist:"7.8km",c:"bg-terra"},{n:"Femi Oladapo",branch:"RCCG Surulere",skills:["React","TypeScript"],dist:"4.5km",c:"bg-rich-brown"},{n:"Ngozi Nweke",branch:"Mountain of Fire",skills:["Python","Data"],dist:"9.2km",c:"bg-amber"},{n:"Emeka Obi",branch:"Lighthouse Ibadan",skills:["Marketing","Content"],dist:"12km",c:"bg-sage"}].map(m=>(
          <Card key={m.n} hover className="p-4">
            <div className="flex gap-3 mb-3">
              <Avatar name={m.n} size={38} colorClass={m.c} />
              <div>
                <p className="text-[0.85rem] font-medium">{m.n}</p>
                <p className="text-[0.7rem] text-muted">{m.branch}</p>
                <p className="text-[0.68rem] text-amber">{m.dist}</p>
              </div>
            </div>
            <div className="flex gap-1.5 mb-3">{m.skills.map(s=><Tag key={s}>{s}</Tag>)}</div>
            <Btn small variant="ghost">View Profile</Btn>
          </Card>
        ))}
      </div>
    </>
  );
}
