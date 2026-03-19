"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SectionLabel, Card, Tag, Badge, Btn, Avatar } from "@/components/ui";
import Link from "next/link";

type MemberDetail = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  created_at: string;
  bio: string | null;
  skills: string[];
  sector_interests: string[];
  job_categories: string[];
  employment_status: boolean | null;
  date_of_birth: string | null;
  branch_id: string | null;
  branch_name: string | null;
  church_name: string | null;
  branch_city: string | null;
  branch_state: string | null;
};

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function calcAge(dob: string | null) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

export default function AdminMemberDetailPage({ params }: { params: { id: string } }) {
  const [member,     setMember]     = useState<MemberDetail | null>(null);
  const [appCount,   setAppCount]   = useState<number>(0);
  const [loading,    setLoading]    = useState(true);
  const [notFound,   setNotFound]   = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const memberId = params.id;

      const [{ data: memberRow }, { count: apps }] = await Promise.all([
        supabase
          .from("members")
          .select(`
            id,
            bio,
            skills,
            sector_interests,
            job_categories,
            employment_status,
            date_of_birth,
            branch_id,
            profiles (
              full_name,
              email,
              phone,
              location,
              avatar_url,
              created_at
            ),
            branches (
              branch_name,
              church_name,
              city,
              state
            )
          `)
          .eq("id", memberId)
          .single(),
        supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .eq("member_id", memberId),
      ]);

      if (!memberRow) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = memberRow as any;
      setMember({
        id:                r.id,
        full_name:         r.profiles?.full_name      ?? "Unknown",
        email:             r.profiles?.email          ?? "—",
        phone:             r.profiles?.phone          ?? null,
        location:          r.profiles?.location       ?? null,
        avatar_url:        r.profiles?.avatar_url     ?? null,
        created_at:        r.profiles?.created_at     ?? "",
        bio:               r.bio,
        skills:            r.skills            ?? [],
        sector_interests:  r.sector_interests  ?? [],
        job_categories:    r.job_categories    ?? [],
        employment_status: r.employment_status ?? null,
        date_of_birth:     r.date_of_birth     ?? null,
        branch_id:         r.branch_id         ?? null,
        branch_name:       r.branches?.branch_name ?? null,
        church_name:       r.branches?.church_name ?? null,
        branch_city:       r.branches?.city         ?? null,
        branch_state:      r.branches?.state        ?? null,
      });

      setAppCount(apps ?? 0);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-[860px]">
        <Link href="/admin/members" className="text-[0.8rem] text-muted hover:text-deep-brown block mb-6">
          ← Back to Members
        </Link>
        <Card>
          <p className="text-muted text-[0.85rem] py-8 text-center">Loading member details…</p>
        </Card>
      </div>
    );
  }

  if (notFound || !member) {
    return (
      <div className="max-w-[860px]">
        <Link href="/admin/members" className="text-[0.8rem] text-muted hover:text-deep-brown block mb-6">
          ← Back to Members
        </Link>
        <Card>
          <p className="text-muted text-[0.85rem] py-8 text-center">Member not found.</p>
          <div className="flex justify-center mt-2">
            <Btn variant="ghost" href="/admin/members">Back to Members</Btn>
          </div>
        </Card>
      </div>
    );
  }

  const age = calcAge(member.date_of_birth);
  const branchLabel = [member.church_name, member.branch_name].filter(Boolean).join(" — ");
  const branchLocation = [member.branch_city, member.branch_state].filter(Boolean).join(", ");

  return (
    <div className="max-w-[860px]">
      <Link href="/admin/members" className="text-[0.8rem] text-muted hover:text-deep-brown block mb-6">
        ← Back to Members
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4 md:gap-6">

        {/* Left column */}
        <div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-start mb-4 sm:mb-8">
            <Avatar name={member.full_name} size={64} colorClass="bg-amber" />
            <div>
              <SectionLabel>Member Details</SectionLabel>
              <h1 className="font-serif text-[2rem] font-light leading-tight">
                {member.full_name.split(" ")[0]}{" "}
                <em className="text-amber not-italic">
                  {member.full_name.split(" ").slice(1).join(" ")}
                </em>
              </h1>
              <p className="text-[0.82rem] text-muted mt-1">
                {member.location && `${member.location} · `}
                {branchLabel && `${branchLabel}`}
                {branchLocation && ` · ${branchLocation}`}
                {member.created_at && ` · Joined ${fmtDate(member.created_at)}`}
              </p>
            </div>
          </div>

          {/* Contact */}
          <Card className="mb-4">
            <h3 className="font-serif text-[1.1rem] mb-3">Contact</h3>
            <dl className="space-y-2">
              <div className="flex justify-between text-[0.82rem] pb-2 border-b border-[rgba(60,42,20,0.06)]">
                <dt className="text-muted">Email</dt>
                <dd className="font-medium">
                  <a href={`mailto:${member.email}`} className="text-sky hover:underline">{member.email}</a>
                </dd>
              </div>
              <div className="flex justify-between text-[0.82rem] pb-2 border-b border-[rgba(60,42,20,0.06)]">
                <dt className="text-muted">Phone</dt>
                <dd className="font-medium">
                  {member.phone
                    ? <a href={`tel:${member.phone}`} className="text-sky hover:underline">{member.phone}</a>
                    : <span className="italic text-muted">Not provided</span>}
                </dd>
              </div>
              <div className="flex justify-between text-[0.82rem] pb-2 border-b border-[rgba(60,42,20,0.06)]">
                <dt className="text-muted">Location</dt>
                <dd className="font-medium">{member.location ?? "—"}</dd>
              </div>
              <div className="flex justify-between text-[0.82rem]">
                <dt className="text-muted">Date of Birth</dt>
                <dd className="font-medium">
                  {member.date_of_birth
                    ? `${fmtDate(member.date_of_birth)}${age !== null ? ` (${age} yrs)` : ""}`
                    : "—"}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Skills */}
          {member.skills.length > 0 && (
            <Card className="mb-4">
              <h3 className="font-serif text-[1.1rem] mb-3">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {member.skills.map((s) => <Tag key={s} amber>{s}</Tag>)}
              </div>
            </Card>
          )}

          {/* Sector interests */}
          {member.sector_interests.length > 0 && (
            <Card className="mb-4">
              <h3 className="font-serif text-[1.1rem] mb-3">Sector Interests</h3>
              <div className="flex flex-wrap gap-1.5">
                {member.sector_interests.map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
            </Card>
          )}

          {/* Job categories */}
          {member.job_categories.length > 0 && (
            <Card className="mb-4">
              <h3 className="font-serif text-[1.1rem] mb-3">Job Categories</h3>
              <div className="flex flex-wrap gap-1.5">
                {member.job_categories.map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
            </Card>
          )}

          {/* Bio */}
          {member.bio && (
            <Card className="mb-4">
              <h3 className="font-serif text-[1.1rem] mb-3">Bio</h3>
              <p className="text-[0.85rem] text-rich-brown leading-[1.7]">{member.bio}</p>
            </Card>
          )}

          {/* Activity */}
          <Card>
            <h3 className="font-serif text-[1.1rem] mb-3">Activity</h3>
            <dl className="space-y-2">
              {[
                ["Applications Submitted", appCount.toString()],
                ["Member Since",           fmtDate(member.created_at)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[0.82rem] pb-2 border-b border-[rgba(60,42,20,0.06)] last:border-0 last:pb-0">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Status */}
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Employment Status</p>
            {member.employment_status === true  && <Badge type="forest">Employed</Badge>}
            {member.employment_status === false && <Badge type="sky">Job Seeker</Badge>}
            {member.employment_status === null  && <Badge type="default">Not Set</Badge>}
          </Card>

          {/* Branch info */}
          {branchLabel && (
            <Card>
              <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-2">Branch</p>
              <p className="text-[0.85rem] font-medium text-deep-brown">{branchLabel}</p>
              {branchLocation && (
                <p className="text-[0.75rem] text-muted mt-0.5">{branchLocation}</p>
              )}
            </Card>
          )}

          {/* Admin actions */}
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Admin Actions</p>
            <div className="space-y-2">
              <Btn variant="ghost" className="w-full justify-center" href={`/admin/members`}>
                Back to Members
              </Btn>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
