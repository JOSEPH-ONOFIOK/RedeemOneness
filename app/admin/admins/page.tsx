"use client";
import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, Avatar, Badge, Btn } from "@/components/ui";

type AdminMember = {
  id: string;
  full_name: string;
  email: string;
  is_head: boolean;
};

type Invite = {
  id: string;
  email: string;
  status: string;
  created_at: string;
};

const COLORS = ["bg-amber","bg-forest","bg-sky","bg-terra","bg-sage"];

export default function AdminAdminsPage() {
  const [branchId,    setBranchId]    = useState<string | null>(null);
  const [isHead,      setIsHead]      = useState(false);
  const [admins,      setAdmins]      = useState<AdminMember[]>([]);
  const [invites,     setInvites]     = useState<Invite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [msg,         setMsg]         = useState("");
  const [loading,     setLoading]     = useState(true);
  const [isPending,   startTransition]= useTransition();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: branch } = await supabase
        .from("branches")
        .select("id")
        .eq("admin_id", user.id)
        .single();

      if (!branch) { setLoading(false); return; }
      setBranchId(branch.id);
      setIsHead(true); // branch.admin_id === user.id means head admin

      // Current admins
      const { data: ba } = await supabase
        .from("branch_admins")
        .select("id, is_head, profiles(id, full_name, email)")
        .eq("branch_id", branch.id);

      setAdmins((ba ?? []).map((a: any) => ({
        id:        a.id,
        full_name: a.profiles?.full_name ?? "—",
        email:     a.profiles?.email     ?? "—",
        is_head:   a.is_head,
      })));

      // Pending invites
      const { data: inv } = await supabase
        .from("admin_invites")
        .select("id, email, status, created_at")
        .eq("branch_id", branch.id)
        .eq("status", "pending");

      setInvites(inv ?? []);
      setLoading(false);
    }
    load();
  }, []);

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim() || !branchId) return;
    setMsg("");
    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("admin_invites").insert({
        branch_id:  branchId,
        email:      inviteEmail.trim().toLowerCase(),
        invited_by: user?.id,
        status:     "pending",
      });

      if (error) {
        setMsg(error.code === "23505" ? "This email has already been invited." : error.message);
      } else {
        setMsg(`Invite sent to ${inviteEmail.trim()}`);
        setInvites(prev => [...prev, {
          id: Date.now().toString(), email: inviteEmail.trim(), status: "pending", created_at: new Date().toISOString()
        }]);
        setInviteEmail("");
      }
    });
  }

  async function revokeInvite(inviteId: string, email: string) {
    const supabase = createClient();
    await supabase.from("admin_invites").update({ status: "revoked" }).eq("id", inviteId);
    setInvites(prev => prev.filter(i => i.id !== inviteId));
    setMsg(`Invite for ${email} revoked.`);
  }

  async function revokeAdmin(adminId: string, name: string) {
    if (!confirm(`Remove ${name} as admin?`)) return;
    const supabase = createClient();
    await supabase.from("branch_admins").delete().eq("id", adminId);
    setAdmins(prev => prev.filter(a => a.id !== adminId));
    setMsg(`${name} removed as admin.`);
  }

  return (
    <>
      <PageTitle label="Administration" title="Admin Management" />

      <div className="max-w-[640px] space-y-5">
        {/* Current admins */}
        <Card>
          <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">
            Current Admins {admins.length > 0 && <span className="text-amber">({admins.length})</span>}
          </p>

          {loading ? (
            <p className="text-muted text-[0.85rem] py-4">Loading…</p>
          ) : admins.length === 0 ? (
            <p className="text-muted text-[0.85rem] py-4">No additional admins yet</p>
          ) : (
            admins.map((a, i) => (
              <div key={a.id} className="flex items-center gap-4 py-4 border-b border-[rgba(60,42,20,0.06)] last:border-0">
                <Avatar name={a.full_name} size={44} colorClass={COLORS[i % COLORS.length]} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[0.88rem] truncate">{a.full_name}</p>
                  <p className="text-[0.72rem] text-muted truncate">{a.email}</p>
                </div>
                {a.is_head
                  ? <Badge type="new">Head Admin</Badge>
                  : isHead && (
                    <Btn small variant="danger" onClick={() => revokeAdmin(a.id, a.full_name)}>
                      Revoke
                    </Btn>
                  )}
              </div>
            ))
          )}

          {/* Invite */}
          {isHead && (
            <div className="pt-5 border-t border-[rgba(60,42,20,0.08)] mt-2">
              <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Invite New Admin</p>
              <form onSubmit={handleInvite} className="flex gap-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Admin email address"
                  required
                  className="flex-1 px-3.5 py-2 border border-[rgba(60,42,20,0.12)] rounded-sm bg-warm-white text-[0.85rem] outline-none focus:border-amber transition-colors"
                />
                <Btn type="submit" small disabled={isPending}>
                  {isPending ? "Sending…" : "Send Invite"}
                </Btn>
              </form>
              <p className="text-[0.68rem] text-muted mt-2">
                The invited person will be recorded as a pending admin. Ask them to register using this branch's QR code or contact Redeem Oneness support to link their account.
              </p>
              {msg && (
                <p className={`text-[0.78rem] mt-3 p-3 rounded-sm border ${msg.includes("sent") || msg.includes("revoked") || msg.includes("removed") ? "text-forest bg-forest/5 border-forest/20" : "text-terra bg-terra/5 border-terra/20"}`}>
                  {msg}
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Pending invites */}
        {invites.length > 0 && (
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">
              Pending Invites <span className="text-amber">({invites.length})</span>
            </p>
            {invites.map(inv => (
              <div key={inv.id} className="flex items-center justify-between py-3 border-b border-[rgba(60,42,20,0.06)] last:border-0">
                <div>
                  <p className="text-[0.85rem]">{inv.email}</p>
                  <p className="text-[0.68rem] text-muted">Invited {new Date(inv.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge type="pending">Pending</Badge>
                  {isHead && (
                    <Btn small variant="danger" onClick={() => revokeInvite(inv.id, inv.email)}>
                      Revoke
                    </Btn>
                  )}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </>
  );
}
