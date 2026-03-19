"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, StatCard, Card, Badge, Btn, Avatar } from "@/components/ui";

type Job = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  appCount?: number;
};

type RecentApp = {
  id: string;
  status: string;
  created_at: string;
  job_id: string;
  member_id: string;
  jobTitle: string;
  memberName: string;
};

const AVATAR_COLORS = ["bg-amber", "bg-sage", "bg-terra", "bg-sky", "bg-rich-brown", "bg-forest"];

export default function BusinessHomePage() {
  const supabase = createClient();

  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);

  const [totalJobs, setTotalJobs] = useState(0);
  const [totalApps, setTotalApps] = useState(0);
  const [acceptedApps, setAcceptedApps] = useState(0);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [recentApps, setRecentApps] = useState<RecentApp[]>([]);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      // Fetch business profile
      const { data: biz } = await supabase
        .from("businesses")
        .select("company_name, industry")
        .eq("id", user.id)
        .single();
      setCompanyName(biz?.company_name ?? "");

      // Fetch all jobs for this business
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title, status, created_at")
        .eq("business_id", user.id);

      const allJobs: Job[] = jobs ?? [];
      setTotalJobs(allJobs.length);

      if (allJobs.length === 0) {
        setLoading(false);
        return;
      }

      const jobIds = allJobs.map((j) => j.id);

      // Fetch all applications for these jobs
      const { data: applications } = await supabase
        .from("applications")
        .select("id, job_id, member_id, status, created_at, message")
        .in("job_id", jobIds);

      const allApps = applications ?? [];
      setTotalApps(allApps.length);
      setAcceptedApps(allApps.filter((a) => a.status === "accepted").length);

      // Count applications per job
      const appCountMap: Record<string, number> = {};
      for (const app of allApps) {
        appCountMap[app.job_id] = (appCountMap[app.job_id] ?? 0) + 1;
      }

      const openJobs = allJobs
        .filter((j) => j.status === "open")
        .map((j) => ({ ...j, appCount: appCountMap[j.id] ?? 0 }));
      setActiveJobs(openJobs);

      // Recent 5 applications — join with profiles and jobs
      const sorted = [...allApps].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const recent5 = sorted.slice(0, 5);

      if (recent5.length === 0) {
        setLoading(false);
        return;
      }

      const memberIds = [...new Set(recent5.map((a) => a.member_id))];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", memberIds);

      const profileMap: Record<string, string> = {};
      for (const p of profiles ?? []) profileMap[p.id] = p.full_name ?? "";

      const jobMap: Record<string, string> = {};
      for (const j of allJobs) jobMap[j.id] = j.title;

      setRecentApps(
        recent5.map((a) => ({
          ...a,
          jobTitle: jobMap[a.job_id] ?? "Unknown Job",
          memberName: profileMap[a.member_id] ?? "Unknown Member",
        }))
      );

      setLoading(false);
    }

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const statusBadgeType = (s: string) => {
    const map: Record<string, "pending" | "viewed" | "interview" | "accepted" | "rejected" | "new"> = {
      pending: "pending",
      viewed: "viewed",
      interview: "interview",
      accepted: "accepted",
      rejected: "rejected",
    };
    return map[s] ?? "new";
  };

  if (loading) {
    return (
      <>
        <PageTitle label="Overview" title="Business Dashboard" action={<Btn href="/business/post-job">+ Post New Job</Btn>} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {["Active Jobs", "Applications", "Accepted", "Total Jobs"].map((label) => (
            <Card key={label} className="text-center animate-pulse">
              <div className="h-10 bg-[rgba(60,42,20,0.06)] rounded mb-2" />
              <div className="h-3 bg-[rgba(60,42,20,0.06)] rounded w-2/3 mx-auto" />
            </Card>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle
        label="Overview"
        title={companyName ? `${companyName} Dashboard` : "Business Dashboard"}
        action={<Btn href="/business/post-job">+ Post New Job</Btn>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard number={String(activeJobs.length)} label="Active Jobs"     icon="⚡" colorClass="text-amber"  />
        <StatCard number={String(totalApps)}          label="Applications"   icon="◈"  colorClass="text-sage"   />
        <StatCard number={String(acceptedApps)}       label="Accepted"       icon="✓"  colorClass="text-forest" />
        <StatCard number={String(totalJobs)}          label="Total Jobs"     icon="✦"  colorClass="text-terra"  />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Active job postings */}
        <div>
          <h2 className="font-serif text-[1.3rem] font-semibold mb-4">Active Job Postings</h2>
          {activeJobs.length === 0 ? (
            <Card>
              <p className="text-[0.85rem] text-muted text-center py-6">No active jobs. Post your first job to get started.</p>
              <div className="flex justify-center">
                <Btn href="/business/post-job">+ Post New Job</Btn>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeJobs.map((j) => (
                <Card key={j.id} hover>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-serif text-[1.05rem] font-semibold mb-0.5">{j.title}</p>
                      <p className="text-[0.75rem] text-muted">
                        {j.appCount} applicant{j.appCount !== 1 ? "s" : ""} · Posted{" "}
                        {new Date(j.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge type="new">Active</Badge>
                      <Btn small variant="ghost" href="/business/applications">View</Btn>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Recent Applications</p>
            {recentApps.length === 0 ? (
              <p className="text-[0.8rem] text-muted py-2">No applications yet.</p>
            ) : (
              recentApps.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 mb-3 last:mb-0">
                  <Avatar
                    name={a.memberName}
                    size={36}
                    colorClass={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.85rem] font-medium truncate">{a.memberName}</p>
                    <p className="text-[0.7rem] text-muted truncate">{a.jobTitle}</p>
                  </div>
                  <Badge type={statusBadgeType(a.status)}>{a.status}</Badge>
                </div>
              ))
            )}
            <Btn small variant="ghost" href="/business/applications" className="mt-2">
              All Applications
            </Btn>
          </Card>

          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Quick Stats</p>
            {[
              ["Total Jobs Posted", String(totalJobs)],
              ["Active Jobs",       String(activeJobs.length)],
              ["Total Applications",String(totalApps)],
              ["Accepted",          String(acceptedApps)],
            ].map(([k, v]) => (
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
