"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, FormInput, Btn, QRCodeImage } from "@/components/ui";

type Branch = {
  id: string;
  church_name: string;
  branch_name: string;
  city: string;
  state: string;
  country: string;
  code: string;
};

export default function AdminSettingsPage() {
  const [branch, setBranch]       = useState<Branch | null>(null);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading]     = useState(true);
  const [saved, setSaved]         = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: b } = await supabase
        .from("branches")
        .select("id, church_name, branch_name, city, state, country, code")
        .eq("admin_id", user.id)
        .single();

      if (b) {
        setBranch(b);
        // Count members in this branch
        const { count } = await supabase
          .from("members")
          .select("id", { count: "exact", head: true })
          .eq("branch_id", b.id);
        setMemberCount(count ?? 0);
      }
      setLoading(false);
    }
    load();
  }, []);

  const signupUrl = branch
    ? `${window.location.origin}/signup?branch=${branch.code}`
    : null;

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up save to Supabase update
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <>
      <PageTitle label="Configuration" title="Branch Settings"
        action={<Btn type="submit" form="settings-form">{saved ? "Saved ✓" : "Save Changes"}</Btn>} />

      {loading ? (
        <div className="text-muted text-[0.85rem]">Loading branch data…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4 md:gap-6 max-w-[900px]">
          <Card>
            <form id="settings-form" onSubmit={handleSave}>
              <h3 className="font-serif text-[1.2rem] mb-5">Branch Information</h3>
              <FormInput label="Church Name"   name="church_name"  defaultValue={branch?.church_name} placeholder="Church name" />
              <FormInput label="Branch Name"   name="branch_name"  defaultValue={branch?.branch_name} placeholder="Branch name" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput label="City"  name="city"  defaultValue={branch?.city}  placeholder="City" />
                <FormInput label="State" name="state" defaultValue={branch?.state} placeholder="State" />
              </div>
              <FormInput label="Country" name="country" defaultValue={branch?.country ?? "Nigeria"} placeholder="Nigeria" />
              <div className="border-t border-[rgba(60,42,20,0.1)] pt-5 mt-2">
                <h3 className="font-serif text-[1.1rem] mb-4">Admin Settings</h3>
                <FormInput label="Admin Email" type="email" name="email" placeholder="admin@branch.org" />
                <FormInput label="New Password" type="password" name="password" placeholder="Leave blank to keep current" />
              </div>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="text-center">
              <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Branch QR Code</p>
              {signupUrl ? (
                <>
                  <div className="inline-block mb-3">
                    <QRCodeImage value={signupUrl} size={144} />
                  </div>
                  <p className="text-[0.72rem] text-muted mt-2 mb-1 break-all font-mono">{branch?.code}</p>
                  <p className="text-[0.68rem] text-muted/60 mb-4">Members scan this to register to your branch</p>
                  <Btn small className="w-full justify-center">Download QR Code</Btn>
                </>
              ) : (
                <p className="text-[0.8rem] text-muted py-8">No branch registered yet</p>
              )}
            </Card>

            <Card>
              <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Branch Stats</p>
              {[
                ["Total Members", memberCount.toString()],
                ["Branch Code",   branch?.code ?? "—"],
                ["City",          branch?.city ?? "—"],
                ["Church",        branch?.church_name ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[0.82rem] mb-2 last:mb-0">
                  <span className="text-muted">{k}</span>
                  <span className="font-serif font-semibold text-amber truncate max-w-[140px] text-right">{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
