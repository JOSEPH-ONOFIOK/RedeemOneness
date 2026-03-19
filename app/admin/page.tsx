"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, StatCard, Card, Avatar, Badge, Btn } from "@/components/ui";
import BranchQRCard from "./BranchQRCard";
import Link from "next/link";

type RecentMember = {
  id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  skills: string[];
  employment_status: boolean | null;
};

export default function AdminHomePage() {
  const [branchName,    setBranchName]    = useState("Branch Dashboard");
  const [totalMembers,  setTotalMembers]  = useState(0);
  const [recentMembers, setRecentMembers] = useState<RecentMember[]>([]);
  const [skillStats,    setSkillStats]    = useState<{ label: string; count: number }[]>([]);
  const [annCount,      setAnnCount]      = useState(0);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: branch } = await supabase
        .from("branches")
        .select("id, church_name, branch_name")
        .eq("admin_id", user.id)
        .single();

      if (!branch) { setLoading(false); return; }
      setBranchName(`${branch.church_name} — ${branch.branch_name}`);

      const sixDaysAgo = new Date();
      sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

      const [
        { count: total },
        { data: recent },
        { data: allM },
        { count: ann },
      ] = await Promise.all([
        supabase.from("members").select("id", { count: "exact", head: true }).eq("branch_id", branch.id),
        supabase.from("members")
          .select("id, skills, employment_status, profiles(full_name, phone, created_at)")
          .eq("branch_id", branch.id)
          .gte("profiles.created_at", sixDaysAgo.toISOString())
          .limit(10),
        supabase.from("members").select("skills").eq("branch_id", branch.id),
        supabase.from("announcements").select("id", { count: "exact", head: true }).eq("branch_id", branch.id),
      ]);

      setTotalMembers(total ?? 0);
      setAnnCount(ann ?? 0);

      if (recent) {
        setRecentMembers(recent.map((m: any) => ({
          id:                m.id,
          full_name:         m.profiles?.full_name  ?? "—",
          phone:             m.profiles?.phone       ?? null,
          created_at:        m.profiles?.created_at ?? "",
          skills:            m.skills ?? [],
          employment_status: m.employment_status,
        })));
      }

      if (allM) {
        const counts: Record<string, number> = {};
        allM.forEach((m: any) => (m.skills ?? []).forEach((s: string) => { counts[s] = (counts[s] ?? 0) + 1; }));
        setSkillStats(Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([label,count])=>({label,count})));
      }

      setLoading(false);
    }
    load();
  }, []);

  function fmtDate(iso: string) {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  }

  const colors    = ["bg-amber","bg-forest","bg-terra","bg-sky","bg-sage","bg-rich-brown"];
  const barColors = ["bg-amber","bg-forest","bg-terra","bg-sky","bg-muted"];
  const maxSkill  = skillStats[0]?.count || 1;

  return (
    <>
      <PageTitle label="Branch Admin" title={branchName} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
        <StatCard number={loading ? "…" : totalMembers.toString()}             label="Total Members"   icon="◉" colorClass="text-amber"  />
        <StatCard number={loading ? "…" : recentMembers.length.toString()}     label="New (6 days)"    icon="✦" colorClass="text-forest" />
        <StatCard number={loading ? "…" : skillStats.length.toString()}        label="Skill Areas"     icon="⚡" colorClass="text-sky"    />
        <StatCard number={loading ? "…" : annCount.toString()}                 label="Announcements"   icon="📢" colorClass="text-terra"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 lg:gap-6">
        <div>
          {/* Skills */}
          <h2 className="font-serif text-[1.3rem] font-semibold mb-4">Skills Distribution</h2>
          <Card className="mb-6">
            {loading ? <p className="text-muted text-[0.85rem]">Loading…</p>
              : skillStats.length === 0 ? <p className="text-muted text-[0.85rem]">No skills data yet</p>
              : skillStats.map(({ label, count }, i) => (
                <div key={label} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-[0.8rem] mb-1.5">
                    <span>{label}</span><span className="text-muted">{count} member{count !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[rgba(60,42,20,0.1)] rounded-sm">
                    <div className={`h-full ${barColors[i]} rounded-sm`} style={{ width: `${(count/maxSkill)*100}%` }} />
                  </div>
                </div>
              ))}
          </Card>

          {/* Recent registrations */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-[1.3rem] font-semibold">Recent Registrations — last 6 days</h2>
            <Link href="/admin/members" className="text-[0.75rem] text-amber hover:underline">View all →</Link>
          </div>

          {loading ? (
            <Card><p className="text-muted text-[0.85rem] py-4">Loading…</p></Card>
          ) : recentMembers.length === 0 ? (
            <Card><p className="text-muted text-[0.85rem] py-6 text-center">No new members in the last 6 days</p></Card>
          ) : (
            <div className="space-y-2">
              {recentMembers.map((m, i) => (
                <Card key={m.id} hover className="py-3 px-5">
                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div className="flex gap-3 items-center">
                      <Avatar name={m.full_name} size={36} colorClass={colors[i % colors.length]} />
                      <div>
                        <p className="text-[0.88rem] font-medium">{m.full_name}</p>
                        <p className="text-[0.72rem] text-muted">
                          {m.phone
                            ? <a href={`tel:${m.phone}`} className="text-sky hover:underline">{m.phone}</a>
                            : <span className="italic">No phone</span>}
                          {" · "}{m.created_at ? fmtDate(m.created_at) : ""}
                        </p>
                        {m.skills.length > 0 && <p className="text-[0.68rem] text-amber mt-0.5">{m.skills.slice(0,3).join(", ")}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.employment_status === true  && <Badge type="forest">Employed</Badge>}
                      {m.employment_status === false && <Badge type="sky">Job Seeker</Badge>}
                      <Btn small variant="ghost" href="/admin/members">View</Btn>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <BranchQRCard />
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Quick Actions</p>
            {[
              ["📢 Post Announcement", "/admin/announcements"],
              ["🔍 Search by Skill",   "/admin/search"],
              ["🎂 Upcoming Birthdays","/admin/birthdays"],
              ["👥 Manage Admins",     "/admin/admins"],
            ].map(([l,h]) => (
              <a key={l} href={h} className="block py-2 border-b border-[rgba(60,42,20,0.06)] text-[0.82rem] text-amber hover:text-deep-brown transition-colors last:border-0">{l} →</a>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
