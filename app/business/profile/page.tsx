"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, FormInput, FormSelect, FormTextarea, Badge, Btn } from "@/components/ui";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Agriculture",
  "Manufacturing",
  "Retail",
  "Construction",
  "Media & Entertainment",
  "Logistics",
  "Other",
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

type ActiveJob = { id: string; title: string };

export default function CompanyProfilePage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Form state
  const [companyName, setCompanyName]   = useState("");
  const [industry, setIndustry]         = useState(INDUSTRIES[0]);
  const [description, setDescription]   = useState("");
  const [website, setWebsite]           = useState("");
  const [size, setSize]                 = useState(COMPANY_SIZES[0]);
  const [location, setLocation]         = useState("");
  const [email, setEmail]               = useState("");

  const [activeJobs, setActiveJobs]     = useState<ActiveJob[]>([]);
  const [totalApps, setTotalApps]       = useState(0);
  const [acceptedApps, setAcceptedApps] = useState(0);

  // Track user id for updates
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;
      setUserId(user.id);

      // Fetch business row
      const { data: biz } = await supabase
        .from("businesses")
        .select("company_name, industry, description, website, size")
        .eq("id", user.id)
        .single();

      // Fetch profile row
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, location")
        .eq("id", user.id)
        .single();

      if (biz) {
        setCompanyName(biz.company_name ?? "");
        setIndustry(
          INDUSTRIES.includes(biz.industry) ? biz.industry : INDUSTRIES[0]
        );
        setDescription(biz.description ?? "");
        setWebsite(biz.website ?? "");
        setSize(COMPANY_SIZES.includes(biz.size) ? biz.size : COMPANY_SIZES[0]);
      }

      if (profile) {
        setLocation(profile.location ?? "");
        setEmail(profile.email ?? user.email ?? "");
      } else {
        setEmail(user.email ?? "");
      }

      // Fetch active jobs
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title")
        .eq("business_id", user.id)
        .eq("status", "open");

      const openJobs: ActiveJob[] = jobs ?? [];
      setActiveJobs(openJobs);

      // Fetch application stats
      if (openJobs.length > 0) {
        const jobIds = openJobs.map((j) => j.id);
        const { data: apps } = await supabase
          .from("applications")
          .select("id, status")
          .in("job_id", jobIds);

        setTotalApps((apps ?? []).length);
        setAcceptedApps((apps ?? []).filter((a) => a.status === "accepted").length);
      }

      setLoading(false);
    }

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setSaveMsg("");

    const [bizResult, profileResult] = await Promise.all([
      supabase.from("businesses").update({
        company_name: companyName,
        industry,
        description,
        website,
        size,
      }).eq("id", userId),

      supabase.from("profiles").update({
        location,
        email,
      }).eq("id", userId),
    ]);

    setSaving(false);
    if (bizResult.error || profileResult.error) {
      setSaveMsg("Error saving changes. Please try again.");
    } else {
      setSaveMsg("Changes saved successfully.");
      setTimeout(() => setSaveMsg(""), 3000);
    }
  }

  const initials = companyName ? companyName.charAt(0).toUpperCase() : "?";

  if (loading) {
    return (
      <>
        <PageTitle label="Company" title="Company Profile" />
        <div className="grid md:grid-cols-[1fr_300px] gap-6 max-w-[900px]">
          <Card className="animate-pulse space-y-4">
            <div className="h-16 bg-[rgba(60,42,20,0.06)] rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-[rgba(60,42,20,0.06)] rounded" />
            ))}
          </Card>
          <div className="space-y-4">
            <Card className="animate-pulse">
              <div className="h-32 bg-[rgba(60,42,20,0.06)] rounded" />
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle
        label="Company"
        title="Company Profile"
        action={
          <Btn onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Btn>
        }
      />

      {saveMsg && (
        <div
          className={`mb-4 px-4 py-2 rounded-sm text-[0.82rem] ${
            saveMsg.startsWith("Error")
              ? "bg-[rgba(184,92,56,0.1)] text-terra"
              : "bg-[rgba(46,107,82,0.1)] text-forest"
          }`}
        >
          {saveMsg}
        </div>
      )}

      <div className="grid md:grid-cols-[1fr_300px] gap-6 max-w-[900px]">
        <Card>
          {/* Company header */}
          <div className="flex gap-4 items-center mb-6">
            <div className="w-16 h-16 bg-deep-brown rounded-[4px] flex items-center justify-center font-serif text-[1.6rem] text-gold shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-serif text-[1.4rem] font-semibold">
                {companyName || "Your Company"}
              </p>
              <p className="text-[0.8rem] text-muted">
                {industry}
                {location ? ` · ${location}` : ""}
              </p>
            </div>
          </div>

          <FormInput
            label="Company Name"
            placeholder="Your company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <FormSelect
            label="Industry Sector"
            options={INDUSTRIES}
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />

          <FormTextarea
            label="Company Description"
            placeholder="What does your company do?"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormSelect
            label="Company Size"
            options={COMPANY_SIZES}
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />

          <FormInput
            label="Location"
            placeholder="e.g. Lagos, Nigeria"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <FormInput
            label="Contact Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            label="Website"
            placeholder="https://"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </Card>

        <div className="space-y-4">
          {/* Active jobs */}
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">
              Active Jobs ({activeJobs.length})
            </p>
            {activeJobs.length === 0 ? (
              <p className="text-[0.8rem] text-muted py-2">No active jobs.</p>
            ) : (
              activeJobs.map((j) => (
                <div
                  key={j.id}
                  className="flex justify-between items-center py-2 border-b border-[rgba(60,42,20,0.06)] text-[0.85rem] last:border-b-0"
                >
                  <span>{j.title}</span>
                  <Badge type="new">Active</Badge>
                </div>
              ))
            )}
            <Btn small variant="ghost" href="/business/post-job" className="mt-3">
              + Post New Job
            </Btn>
          </Card>

          {/* Stats */}
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Stats</p>
            {[
              ["Active Jobs",        String(activeJobs.length)],
              ["Total Applications", String(totalApps)],
              ["Accepted",           String(acceptedApps)],
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
