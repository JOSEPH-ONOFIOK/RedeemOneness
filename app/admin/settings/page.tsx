import { PageTitle, Card, FormInput, Btn, QRCodeImage } from "@/components/ui";

const BRANCH_CODE = "RCCG-LAGS-ISL-2025";
const BRANCH_URL = `https://redeemoneness.org/signup?branch=${BRANCH_CODE}`;

export default function AdminSettingsPage() {
  return (
    <>
      <PageTitle label="Configuration" title="Branch Settings" action={<Btn>Save Changes</Btn>} />
      <div className="grid md:grid-cols-[1fr_280px] gap-6 max-w-[900px]">
        <Card>
          <h3 className="font-serif text-[1.2rem] mb-5">Branch Information</h3>
          <FormInput label="Church Name"  placeholder="Redeemed Christian Church of God" />
          <FormInput label="Branch Name"  placeholder="Lagos Island Branch" />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="City"  placeholder="Lagos" />
            <FormInput label="State" placeholder="Lagos State" />
          </div>
          <FormInput label="Country"         placeholder="Nigeria" />
          <FormInput label="Branch Address"  placeholder="123 Marina Road, Lagos Island" />
          <div className="border-t border-[rgba(60,42,20,0.1)] pt-5 mt-2">
            <h3 className="font-serif text-[1.1rem] mb-4">Admin Settings</h3>
            <FormInput label="Admin Email" type="email" placeholder="admin@branch.org" />
            <FormInput label="New Password" type="password" placeholder="Leave blank to keep current" />
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="text-center">
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Branch QR Code</p>
            <QRCodeImage value={BRANCH_URL} size={144} />
            <p className="text-[0.72rem] text-muted mt-3 mb-4">{BRANCH_CODE}</p>
            <Btn small className="w-full justify-center mb-2">Download QR Code</Btn>
            <Btn small variant="ghost" className="w-full justify-center">Regenerate Code</Btn>
          </Card>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Branch Stats</p>
            {[["Total Members","248"],["Businesses","12"],["Active Mentors","5"],["QR Scans","340"]].map(([k,v])=>(
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
