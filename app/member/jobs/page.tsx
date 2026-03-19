"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, Badge, Tag, Btn, FormSelect } from "@/components/ui";

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  sector: string;
  skills_required: string[];
  created_at: string;
  businesses: { company_name: string; industry: string } | null;
}

export default function JobsPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [sectorFilter, setSectorFilter] = useState("All Sectors");
  const [sectors, setSectors] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      const [jobsRes, appsRes] = await Promise.all([
        supabase
          .from("jobs")
          .select("id, title, location, type, sector, skills_required, created_at, businesses(company_name, industry)")
          .eq("status", "open")
          .order("created_at", { ascending: false }),
        user
          ? supabase
              .from("applications")
              .select("job_id")
              .eq("member_id", user.id)
          : Promise.resolve({ data: [] }),
      ]);

      const fetchedJobs = (jobsRes.data ?? []) as unknown as Job[];
      setJobs(fetchedJobs);

      // Derive unique sectors
      const uniqueSectors = Array.from(
        new Set(fetchedJobs.map((j) => j.sector).filter(Boolean))
      ).sort();
      setSectors(uniqueSectors);

      const applied = new Set<string>(
        ((appsRes as any).data ?? []).map((a: { job_id: string }) => a.job_id)
      );
      setAppliedJobIds(applied);

      setLoading(false);
    }

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  const filteredJobs =
    sectorFilter === "All Sectors"
      ? jobs
      : jobs.filter((j) => j.sector === sectorFilter);

  const sectorOptions = ["All Sectors", ...sectors];

  if (loading) {
    return (
      <>
        <PageTitle label="Opportunities" title="Job Feed" />
        <p className="text-[0.85rem] text-muted">Loading opportunities…</p>
      </>
    );
  }

  return (
    <>
      <PageTitle label="Opportunities" title="Job Feed" />
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-8">

        {/* Sidebar filters */}
        <div>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4 font-medium">Filters</p>
            <FormSelect
              label="Sector"
              options={sectorOptions}
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
            />
          </Card>
        </div>

        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-[0.82rem] text-muted">{filteredJobs.length} opportunit{filteredJobs.length === 1 ? "y" : "ies"} found</p>
          </div>

          {filteredJobs.length === 0 ? (
            <Card>
              <p className="text-[0.85rem] text-muted text-center py-6">
                No open jobs found{sectorFilter !== "All Sectors" ? ` in "${sectorFilter}"` : ""}. Check back soon.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((j) => {
                const alreadyApplied = appliedJobIds.has(j.id);
                return (
                  <Card key={j.id} hover>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-serif text-[1.05rem] font-semibold">{j.title}</span>
                          {alreadyApplied ? (
                            <Badge type="viewed">Applied</Badge>
                          ) : (
                            <Badge type="new">Open</Badge>
                          )}
                        </div>
                        <p className="text-[0.75rem] text-muted mb-2">
                          {j.businesses?.company_name ?? "Company"} · {j.location} · Posted {formatDate(j.created_at)}
                        </p>
                        {j.skills_required && j.skills_required.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {j.skills_required.map((t) => (
                              <Tag key={t}>{t}</Tag>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 ml-4 items-end shrink-0">
                        <Btn small href={`/member/jobs/${j.id}`}>
                          {alreadyApplied ? "View" : "Apply"}
                        </Btn>
                        <Tag>{j.type}</Tag>
                        {j.sector && <Tag>{j.sector}</Tag>}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
