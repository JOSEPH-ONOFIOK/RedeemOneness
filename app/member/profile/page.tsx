"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  PageTitle,
  Card,
  Tag,
  Btn,
  Avatar,
  FormInput,
  FormTextarea,
  FormSelect,
  SkillTagsInput,
} from "@/components/ui";

interface ProfileForm {
  full_name: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  sector_interests: string[];
  job_categories: string[];
  employment_status: boolean;
}

const SECTOR_OPTIONS = [
  "Technology",
  "Finance",
  "Creative Arts",
  "Education",
  "Health",
  "Law",
  "Engineering",
  "Public Service",
  "Media",
  "Other",
];

const JOB_CATEGORY_OPTIONS = [
  "Internship",
  "Full-time",
  "Part-time",
  "Freelance",
  "Contract",
  "Graduate Trainee",
];

const EMPLOYMENT_OPTIONS = ["Employed", "Unemployed / Seeking"];

export default function MemberProfilePage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [branchLabel, setBranchLabel] = useState<string | null>(null);
  const [applicationCount, setApplicationCount] = useState(0);
  const [activeMentor, setActiveMentor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<ProfileForm>({
    full_name: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    sector_interests: [],
    job_categories: [],
    employment_status: false,
  });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      setEmail(user.email ?? "");

      const [
        { data: profile },
        { data: member },
        { count: appCount },
        { count: mentorCount },
      ] = await Promise.all([
        supabase.from("profiles").select("full_name, phone, location").eq("id", user.id).single(),
        supabase.from("members").select("branch_id, skills, sector_interests, job_categories, bio, employment_status").eq("id", user.id).single(),
        supabase.from("applications").select("*", { count: "exact", head: true }).eq("member_id", user.id),
        supabase.from("mentorship_requests").select("*", { count: "exact", head: true }).eq("member_id", user.id).eq("status", "accepted"),
      ]);

      setApplicationCount(appCount ?? 0);
      setActiveMentor(mentorCount ?? 0);

      if (member?.branch_id) {
        const { data: branch } = await supabase
          .from("branches")
          .select("church_name, branch_name")
          .eq("id", member.branch_id)
          .single();
        if (branch) {
          setBranchLabel(`${branch.church_name} ${branch.branch_name}`.trim());
        }
      }

      setForm({
        full_name: profile?.full_name ?? "",
        phone: profile?.phone ?? "",
        location: profile?.location ?? "",
        bio: member?.bio ?? "",
        skills: member?.skills ?? [],
        sector_interests: member?.sector_interests ?? [],
        job_categories: member?.job_categories ?? [],
        employment_status: member?.employment_status ?? false,
      });

      setLoading(false);
    }

    load();
  }, []);

  const set = (field: keyof ProfileForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const [{ error: profileError }, { error: memberError }] = await Promise.all([
      supabase.from("profiles").update({
        full_name: form.full_name,
        phone: form.phone,
        location: form.location,
      }).eq("id", userId),
      supabase.from("members").update({
        bio: form.bio,
        skills: form.skills,
        sector_interests: form.sector_interests,
        job_categories: form.job_categories,
        employment_status: form.employment_status,
      }).eq("id", userId),
    ]);

    if (profileError || memberError) {
      setSaveError("Failed to save changes. Please try again.");
    } else {
      setSaveSuccess(true);
      setIsEditing(false);
    }

    setSaving(false);
  };

  const profileStrength = (() => {
    let score = 0;
    if (form.full_name) score += 20;
    if (form.location) score += 15;
    if (form.bio) score += 20;
    if (form.skills.length > 0) score += 20;
    if (form.sector_interests.length > 0) score += 15;
    if (form.phone) score += 10;
    return score;
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted text-[0.9rem]">Loading profile…</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        label="Your Profile"
        title="Profile"
        action={
          isEditing ? (
            <div className="flex gap-2">
              <Btn onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </Btn>
              <Btn variant="ghost" onClick={() => { setIsEditing(false); setSaveError(null); }}>
                Cancel
              </Btn>
            </div>
          ) : (
            <Btn variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Btn>
          )
        }
      />

      {saveError && <p className="text-[0.8rem] text-red-600 mb-4">{saveError}</p>}
      {saveSuccess && <p className="text-[0.8rem] text-sage mb-4">Profile updated successfully.</p>}

      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        <div className="space-y-4">
          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar name={form.full_name || "M"} size={80} colorClass="bg-amber" />
            </div>
            <p className="font-serif text-[1.4rem] font-semibold mb-1">
              {form.full_name || "—"}
            </p>
            {form.location && (
              <p className="text-[0.78rem] text-muted mb-3">{form.location}</p>
            )}
            {branchLabel && (
              <div className="inline-block text-[0.7rem] bg-cream px-3 py-1 rounded-sm text-rich-brown mb-2">
                {branchLabel}
              </div>
            )}
            <p className="text-[0.68rem] text-sage">
              {form.employment_status ? "● Employed" : "● Seeking Opportunities"}
            </p>
          </Card>

          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-2">Profile Strength</p>
            <div className="w-full h-1.5 bg-[rgba(60,42,20,0.1)] rounded-sm mb-1.5">
              <div className="h-full bg-amber rounded-sm" style={{ width: `${profileStrength}%` }} />
            </div>
            <p className="text-[0.75rem] text-muted">
              {profileStrength}%{profileStrength < 100 && " — complete your profile to improve match score"}
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <Card>
              <h3 className="font-serif text-[1.1rem] mb-4">Edit Details</h3>
              <FormInput
                label="Full Name"
                placeholder="Your full name"
                value={form.full_name}
                onChange={set("full_name")}
              />
              <FormInput
                label="Phone"
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={set("phone")}
              />
              <FormInput
                label="Location"
                placeholder="Lagos, Nigeria"
                value={form.location}
                onChange={set("location")}
              />
              <FormTextarea
                label="Bio"
                placeholder="Tell us about yourself…"
                rows={3}
                value={form.bio}
                onChange={set("bio")}
              />
              <FormSelect
                label="Employment Status"
                options={EMPLOYMENT_OPTIONS}
                value={form.employment_status ? "Employed" : "Unemployed / Seeking"}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setForm((prev) => ({ ...prev, employment_status: e.target.value === "Employed" }))
                }
              />
              <SkillTagsInput
                label="Skills"
                initial={form.skills}
                onChange={(tags: string[]) => setForm((prev) => ({ ...prev, skills: tags }))}
              />
              <SkillTagsInput
                label="Sector Interests"
                initial={form.sector_interests}
                onChange={(tags: string[]) => setForm((prev) => ({ ...prev, sector_interests: tags }))}
              />
              <SkillTagsInput
                label="Job Categories"
                initial={form.job_categories}
                onChange={(tags: string[]) => setForm((prev) => ({ ...prev, job_categories: tags }))}
              />
            </Card>
          ) : (
            <>
              {form.bio && (
                <Card>
                  <h3 className="font-serif text-[1.1rem] mb-2">Bio</h3>
                  <p className="text-[0.85rem] leading-[1.7] text-rich-brown">{form.bio}</p>
                </Card>
              )}
              <Card>
                <h3 className="font-serif text-[1.1rem] mb-3">Skills</h3>
                {form.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {form.skills.map((s) => <Tag key={s} amber>{s}</Tag>)}
                  </div>
                ) : (
                  <p className="text-muted text-[0.82rem]">No skills added yet.</p>
                )}
              </Card>
              <Card>
                <h3 className="font-serif text-[1.1rem] mb-3">Sector Interests</h3>
                {form.sector_interests.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {form.sector_interests.map((s) => <Tag key={s}>{s}</Tag>)}
                  </div>
                ) : (
                  <p className="text-muted text-[0.82rem]">No sector interests added yet.</p>
                )}
              </Card>
              <Card>
                <h3 className="font-serif text-[1.1rem] mb-3">Job Categories</h3>
                {form.job_categories.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {form.job_categories.map((s) => <Tag key={s}>{s}</Tag>)}
                  </div>
                ) : (
                  <p className="text-muted text-[0.82rem]">No job categories added yet.</p>
                )}
              </Card>
            </>
          )}

          <Card>
            <h3 className="font-serif text-[1.1rem] mb-4">Activity</h3>
            <div className="flex gap-8 flex-wrap">
              {[
                [String(applicationCount), "Applications"],
                [String(activeMentor), "Mentor"],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div className="font-serif text-[1.8rem] font-light text-amber">{n}</div>
                  <div className="text-[0.68rem] uppercase tracking-[0.08em] text-muted">{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
