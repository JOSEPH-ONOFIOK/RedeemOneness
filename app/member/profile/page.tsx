import { PageTitle, Card, Tag, Btn, Avatar } from "@/components/ui";

export default function MemberProfilePage() {
  return (
    <>
      <PageTitle label="Your Profile" title="Profile"
        action={<><Btn variant="outline" href="/member/profile/edit">Edit Profile</Btn><Btn variant="ghost">Visibility</Btn></>} />
      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        <div className="space-y-4">
          <Card className="text-center">
            <div className="flex justify-center mb-4"><Avatar name="C" size={80} colorClass="bg-amber" /></div>
            <p className="font-serif text-[1.4rem] font-semibold mb-1">Chidera Okafor</p>
            <p className="text-[0.78rem] text-muted mb-3">Lagos, Nigeria</p>
            <div className="inline-block text-[0.7rem] bg-cream px-3 py-1 rounded-sm text-rich-brown mb-2">RCCG Lagos Island</div>
            <p className="text-[0.68rem] text-sage">● Active Member</p>
          </Card>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-2">Profile Strength</p>
            <div className="w-full h-1.5 bg-[rgba(60,42,20,0.1)] rounded-sm mb-1.5">
              <div className="w-[72%] h-full bg-amber rounded-sm" />
            </div>
            <p className="text-[0.75rem] text-muted">72% — Add a bio</p>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <h3 className="font-serif text-[1.1rem] mb-3">Skills</h3>
            <div className="flex flex-wrap gap-1.5">{["React","JavaScript","Figma","CSS","Excel","Communication"].map(s=><Tag key={s} amber>{s}</Tag>)}</div>
          </Card>
          <Card>
            <h3 className="font-serif text-[1.1rem] mb-3">Sector Interests</h3>
            <div className="flex flex-wrap gap-1.5">{["Technology","Finance","Creative Arts"].map(s=><Tag key={s}>{s}</Tag>)}</div>
          </Card>
          <Card>
            <h3 className="font-serif text-[1.1rem] mb-3">Job Categories</h3>
            <div className="flex flex-wrap gap-1.5">{["Internship","Full-time","Freelance"].map(s=><Tag key={s}>{s}</Tag>)}</div>
          </Card>
          <Card>
            <h3 className="font-serif text-[1.1rem] mb-4">Activity</h3>
            <div className="flex gap-8 flex-wrap">
              {[["5","Applications"],["3","Saved Jobs"],["1","Mentor"],["12","Connections"]].map(([n,l])=>(
                <div key={l} className="text-center">
                  <div className="font-serif text-[1.8rem] font-light text-amber">{n}</div>
                  <div className="text-[0.68rem] uppercase tracking-[0.08em] text-muted">{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
