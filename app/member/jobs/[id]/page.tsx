"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SectionLabel, Card, Tag, Btn, Badge } from "@/components/ui";

interface Business {
  company_name: string;
  industry: string;
  description: string | null;
  website: string | null;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  sector: string;
  skills_required: string[];
  created_at: string;
  businesses: Business | null;
}

interface Application {
  id: string;
  status: "pending" | "viewed" | "interview" | "accepted" | "rejected";
}

export default function JobDetailPage() {
  const supabase = createClient();
  const params = useParams();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      const [jobRes, appRes] = await Promise.all([
        supabase
          .from("jobs")
          .select("id, title, description, location, type, sector, skills_required, created_at, businesses(company_name, industry, description, website)")
          .eq("id", jobId)
          .single(),
        user
          ? supabase
              .from("applications")
              .select("id, status")
              .eq("job_id", jobId)
              .eq("member_id", user.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      setJob(jobRes.data as Job | null);
      setApplication((appRes as any).data ?? null);
      setLoading(false);
    }

    load();
  }, [jobId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleApply() {
    if (!userId || !jobId) return;
    setApplying(true);
    setSubmitError(null);

    const { data, error } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        member_id: userId,
        status: "pending",
        message: message.trim() || null,
      })
      .select("id, status")
      .single();

    if (error) {
      setSubmitError(error.message);
    } else {
      setApplication(data as Application);
      setSubmitSuccess(true);
      setShowForm(false);
    }
    setApplying(false);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  if (loading) {
    return (
      <div className="max-w-[820px]">
        <Link href="/member/jobs" className="text-[0.8rem] text-muted hover:text-deep-brown transition-colors block mb-6">
          ← Back to Jobs
        </Link>
        <p className="text-[0.85rem] text-muted">Loading job details…</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-[820px]">
        <Link href="/member/jobs" className="text-[0.8rem] text-muted hover:text-deep-brown transition-colors block mb-6">
          ← Back to Jobs
        </Link>
        <Card>
          <p className="text-[0.85rem] text-muted text-center py-6">This job listing could not be found.</p>
        </Card>
      </div>
    );
  }

  const business = job.businesses;

  return (
    <div className="max-w-[820px]">
      <Link href="/member/jobs" className="text-[0.8rem] text-muted hover:text-deep-brown transition-colors block mb-6">
        ← Back to Jobs
      </Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <SectionLabel>Job Opportunity</SectionLabel>
          <h1 className="font-serif text-[2.4rem] font-light leading-tight">{job.title}</h1>
          <p className="text-[0.85rem] text-muted mt-1.5">
            {business?.company_name ?? "Company"} · {job.location} · Posted {formatDate(job.created_at)}
          </p>
        </div>
        <div className="flex gap-2 mt-2 shrink-0">
          {application ? (
            <Badge type={application.status}>{application.status}</Badge>
          ) : (
            <Btn onClick={() => setShowForm(true)}>Apply Now</Btn>
          )}
        </div>
      </div>

      {/* Apply form (shown inline when Apply Now is clicked) */}
      {showForm && !application && (
        <Card className="mb-6">
          <h3 className="font-serif text-[1.1rem] mb-3">Submit Application</h3>
          <div className="mb-4">
            <label className="block text-[0.72rem] tracking-[0.1em] uppercase text-muted mb-1.5">
              Cover Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you're a great fit…"
              rows={4}
              className="w-full px-3.5 py-2.5 border border-[rgba(60,42,20,0.12)] rounded-sm bg-warm-white text-deep-brown text-[0.88rem] outline-none resize-y transition-colors duration-200 focus:border-amber font-sans"
            />
          </div>
          {submitError && (
            <p className="text-[0.78rem] text-terra mb-3">{submitError}</p>
          )}
          <div className="flex gap-2">
            <Btn onClick={handleApply} disabled={applying}>
              {applying ? "Submitting…" : "Submit Application"}
            </Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {submitSuccess && (
        <Card className="mb-6">
          <p className="text-[0.88rem] text-forest font-medium">Application submitted successfully! We will notify you of any updates.</p>
        </Card>
      )}

      <div className="grid md:grid-cols-[1fr_270px] gap-6">
        <div className="space-y-4">
          <Card>
            <h3 className="font-serif text-[1.2rem] mb-4">Job Description</h3>
            <p className="text-[0.88rem] leading-[1.8] text-rich-brown whitespace-pre-line">{job.description}</p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Job Details</p>
            <dl className="space-y-2.5">
              {([
                ["Type", job.type],
                ["Sector", job.sector],
                ["Location", job.location],
                ["Posted", formatDate(job.created_at)],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between text-[0.82rem]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {job.skills_required && job.skills_required.length > 0 && (
            <Card>
              <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Required Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {job.skills_required.map((s) => (
                  <Tag key={s} amber>{s}</Tag>
                ))}
              </div>
            </Card>
          )}

          {business && (
            <Card>
              <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-2">
                About {business.company_name}
              </p>
              {business.industry && (
                <p className="text-[0.72rem] text-amber font-medium mb-2">{business.industry}</p>
              )}
              {business.description && (
                <p className="text-[0.8rem] leading-[1.7] text-muted mb-3">{business.description}</p>
              )}
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.75rem] text-amber hover:underline"
                >
                  {business.website}
                </a>
              )}
            </Card>
          )}

          {/* Application status if already applied */}
          {application && (
            <Card>
              <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-2">Your Application</p>
              <div className="flex items-center gap-2">
                <Badge type={application.status}>{application.status}</Badge>
                <span className="text-[0.78rem] text-muted">You have already applied for this role.</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
