"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, Badge, Tag, Btn, Avatar } from "@/components/ui";

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  sector: string;
  skills_required: string[];
  created_at: string;
  businesses: { company_name: string } | null;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface MemberProfile {
  skills: string[];
  bio: string | null;
  sector_interests: string[];
  branches: { branch_name: string; church_name: string } | null;
}

interface ProfileData {
  full_name: string | null;
  phone: string | null;
  location: string | null;
}

export default function MemberHomePage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [mentorCount, setMentorCount] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [profileRes, memberRes, jobsRes, mentorsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, phone, location")
          .eq("id", user.id)
          .single(),
        supabase
          .from("members")
          .select("skills, bio, sector_interests, branches(branch_name, church_name)")
          .eq("id", user.id)
          .single(),
        supabase
          .from("jobs")
          .select("id, title, location, type, sector, skills_required, created_at, businesses(company_name)")
          .eq("status", "open")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("mentors")
          .select("id", { count: "exact", head: true }),
      ]);

      const profileData = profileRes.data ?? null;
      const memberData = memberRes.data ?? null;

      setProfile(profileData);
      setMember(memberData as MemberProfile | null);
      setJobs((jobsRes.data ?? []) as Job[]);
      setMentorCount(mentorsRes.count ?? 0);

      // Fetch announcements for the member's branch
      if (memberData) {
        const branchId = (memberData as any).branch_id;
        if (branchId) {
          const { data: annData } = await supabase
            .from("announcements")
            .select("id, title, content, created_at")
            .eq("branch_id", branchId)
            .order("created_at", { ascending: false })
            .limit(3);
          setAnnouncements(annData ?? []);
        }
      }

      setLoading(false);
    }

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Profile strength: skills, bio, location, phone, sector_interests
  function getProfileStrength() {
    let filled = 0;
    const total = 5;
    if (member?.skills && member.skills.length > 0) filled++;
    if (member?.bio) filled++;
    if (profile?.location) filled++;
    if (profile?.phone) filled++;
    if (member?.sector_interests && member.sector_interests.length > 0) filled++;
    return Math.round((filled / total) * 100);
  }

  function getMissingField() {
    if (!member?.bio) return "add a bio";
    if (!profile?.phone) return "add a phone number";
    if (!profile?.location) return "add your location";
    if (!member?.skills?.length) return "add skills";
    if (!member?.sector_interests?.length) return "add sector interests";
    return null;
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  const branchName = member?.branches
    ? `${member.branches.church_name} — ${member.branches.branch_name}`
    : "Your Branch";

  const firstName = profile?.full_name?.split(" ")[0] ?? "Member";
  const strength = getProfileStrength();
  const missingField = getMissingField();

  if (loading) {
    return (
      <>
        <PageTitle label="Loading" title="Please wait…" />
        <div className="text-[0.85rem] text-muted">Fetching your feed…</div>
      </>
    );
  }

  return (
    <>
      <PageTitle label="Good Morning" title={`${firstName}'s Feed`} />
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">

        {/* Feed */}
        <div>
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["All", "Jobs", "Internships", "Mentors", "Announcements"].map((f, i) => (
              <button
                key={f}
                className={`px-4 py-1.5 rounded-sm text-[0.75rem] border transition-colors ${
                  i === 0
                    ? "bg-deep-brown text-cream border-deep-brown"
                    : "border-[rgba(60,42,20,0.15)] text-muted hover:border-deep-brown hover:text-deep-brown"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Job cards */}
          {jobs.length === 0 ? (
            <Card>
              <p className="text-[0.85rem] text-muted text-center py-4">No open opportunities right now. Check back soon.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.map((j) => (
                <Card key={j.id} hover>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif text-[1.1rem] font-semibold">{j.title}</span>
                        <Badge type="new">new</Badge>
                      </div>
                      <div className="text-[0.78rem] text-muted">
                        {j.businesses?.company_name ?? "Company"} · {j.location}
                      </div>
                    </div>
                    <Tag>{j.type}</Tag>
                  </div>
                  {j.skills_required && j.skills_required.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {j.skills_required.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Btn small href={`/member/jobs/${j.id}`}>Apply</Btn>
                    <Btn small variant="ghost" href={`/member/jobs/${j.id}`}>View Details</Btn>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Branch card */}
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-2">Your Branch</p>
            <p className="font-serif text-[1rem] font-semibold mb-0.5">{branchName}</p>
            {announcements.length === 0 ? (
              <p className="text-[0.78rem] text-muted mt-2">No recent announcements.</p>
            ) : (
              <div className="space-y-2 mt-3">
                {announcements.map((a) => (
                  <div key={a.id} className="bg-cream rounded-sm p-3 text-[0.8rem] text-rich-brown leading-[1.6]">
                    <strong>{a.title}</strong>
                    <p className="mt-0.5 text-muted text-[0.75rem]">{a.content}</p>
                    <p className="text-[0.68rem] text-muted mt-1">{formatDate(a.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Profile strength */}
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-2">Profile Strength</p>
            <div className="w-full h-1.5 bg-[rgba(60,42,20,0.1)] rounded-sm mb-1.5">
              <div
                className="h-full bg-amber rounded-sm transition-all duration-500"
                style={{ width: `${strength}%` }}
              />
            </div>
            <p className="text-[0.75rem] text-muted mb-3">
              {strength}% complete{missingField ? ` — ${missingField} to improve` : " — great job!"}
            </p>
            <Btn small variant="ghost" href="/member/profile/edit">Complete Profile</Btn>
          </Card>

          {/* Mentors */}
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">
              Mentors Available
              {mentorCount > 0 && (
                <span className="ml-2 text-amber font-semibold">{mentorCount}</span>
              )}
            </p>
            <Btn small variant="ghost" href="/member/mentorship">Browse Mentors</Btn>
          </Card>

        </div>
      </div>
    </>
  );
}
