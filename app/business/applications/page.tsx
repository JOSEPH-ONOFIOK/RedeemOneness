"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, Badge, Tag, Btn, Avatar } from "@/components/ui";

type AppStatus = "pending" | "viewed" | "interview" | "accepted" | "rejected";

type Application = {
  id: string;
  job_id: string;
  member_id: string;
  status: AppStatus;
  created_at: string;
  message: string | null;
  // joined
  jobTitle: string;
  memberName: string;
  phone: string | null;
  location: string | null;
  skills: string[];
};

const AVATAR_COLORS = ["bg-amber", "bg-sage", "bg-terra", "bg-sky", "bg-rich-brown", "bg-forest"];

const STATUS_OPTIONS: AppStatus[] = ["pending", "viewed", "interview", "accepted", "rejected"];

export default function BizApplicationsPage() {
  const supabase = createClient();

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobFilters, setJobFilters] = useState<{ id: string; title: string }[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      // Get all jobs for this business
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title")
        .eq("business_id", user.id);

      const allJobs = jobs ?? [];
      setJobFilters(allJobs);

      if (allJobs.length === 0) {
        setLoading(false);
        return;
      }

      const jobIds = allJobs.map((j) => j.id);
      const jobMap: Record<string, string> = {};
      for (const j of allJobs) jobMap[j.id] = j.title;

      // Fetch applications for those jobs
      const { data: apps } = await supabase
        .from("applications")
        .select("id, job_id, member_id, status, created_at, message")
        .in("job_id", jobIds)
        .order("created_at", { ascending: false });

      const rawApps = apps ?? [];
      if (rawApps.length === 0) {
        setLoading(false);
        return;
      }

      const memberIds = [...new Set(rawApps.map((a) => a.member_id))];

      // Fetch profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, phone, location")
        .in("id", memberIds);

      const profileMap: Record<string, { full_name: string; phone: string | null; location: string | null }> = {};
      for (const p of profiles ?? []) {
        profileMap[p.id] = { full_name: p.full_name ?? "", phone: p.phone ?? null, location: p.location ?? null };
      }

      // Fetch members (for skills)
      const { data: members } = await supabase
        .from("members")
        .select("id, skills")
        .in("id", memberIds);

      const skillsMap: Record<string, string[]> = {};
      for (const m of members ?? []) skillsMap[m.id] = m.skills ?? [];

      const enriched: Application[] = rawApps.map((a) => ({
        ...a,
        status: a.status as AppStatus,
        jobTitle: jobMap[a.job_id] ?? "Unknown Job",
        memberName: profileMap[a.member_id]?.full_name ?? "Unknown",
        phone: profileMap[a.member_id]?.phone ?? null,
        location: profileMap[a.member_id]?.location ?? null,
        skills: skillsMap[a.member_id] ?? [],
      }));

      setApplications(enriched);
      setLoading(false);
    }

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function updateStatus(appId: string, newStatus: AppStatus) {
    setUpdatingId(appId);
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", appId);

    if (!error) {
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    }
    setUpdatingId(null);
  }

  const filteredApps =
    activeFilter === "all"
      ? applications
      : applications.filter((a) => a.job_id === activeFilter);

  const badgeType = (s: AppStatus) => s as "pending" | "viewed" | "interview" | "accepted" | "rejected";

  if (loading) {
    return (
      <>
        <PageTitle label="Recruitment" title="Applications" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-[rgba(60,42,20,0.06)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[rgba(60,42,20,0.06)] rounded w-1/3" />
                  <div className="h-3 bg-[rgba(60,42,20,0.06)] rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle label="Recruitment" title="Applications" />

      {/* Job filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-1.5 rounded-sm text-[0.75rem] border transition-colors ${
            activeFilter === "all"
              ? "bg-deep-brown text-cream border-deep-brown"
              : "border-[rgba(60,42,20,0.15)] text-muted hover:border-deep-brown"
          }`}
        >
          All Jobs
        </button>
        {jobFilters.map((j) => (
          <button
            key={j.id}
            onClick={() => setActiveFilter(j.id)}
            className={`px-4 py-1.5 rounded-sm text-[0.75rem] border transition-colors ${
              activeFilter === j.id
                ? "bg-deep-brown text-cream border-deep-brown"
                : "border-[rgba(60,42,20,0.15)] text-muted hover:border-deep-brown"
            }`}
          >
            {j.title}
          </button>
        ))}
      </div>

      {filteredApps.length === 0 ? (
        <Card>
          <p className="text-[0.85rem] text-muted text-center py-8">
            No applications found{activeFilter !== "all" ? " for this job" : ""}.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((a, i) => (
            <Card key={a.id} hover>
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <Avatar
                    name={a.memberName}
                    size={40}
                    colorClass={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-medium text-[0.9rem]">{a.memberName}</span>
                      <Badge type={badgeType(a.status)}>{a.status}</Badge>
                    </div>
                    <p className="text-[0.75rem] text-muted mb-1">
                      {a.jobTitle} · Applied{" "}
                      {new Date(a.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {a.location ? ` · ${a.location}` : ""}
                    </p>
                    {a.skills.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {a.skills.slice(0, 5).map((s) => (
                          <Tag key={s}>{s}</Tag>
                        ))}
                        {a.skills.length > 5 && (
                          <Tag>+{a.skills.length - 5}</Tag>
                        )}
                      </div>
                    )}
                    {a.phone && (
                      <p className="text-[0.7rem] text-muted mt-1">
                        <a href={`tel:${a.phone}`} className="hover:text-deep-brown transition-colors">
                          {a.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {/* Status update dropdown */}
                  <select
                    value={a.status}
                    disabled={updatingId === a.id}
                    onChange={(e) => updateStatus(a.id, e.target.value as AppStatus)}
                    className="text-[0.72rem] px-3 py-1.5 border border-[rgba(60,42,20,0.15)] rounded-sm bg-warm-white text-deep-brown outline-none focus:border-amber transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Btn small variant="ghost" href="/business/messages">
                      Message
                    </Btn>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
