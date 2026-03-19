"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, FormInput, FormSelect, FormTextarea, Avatar, Btn } from "@/components/ui";

interface FormState {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  sector_expertise: string;
  years_experience: string;
  bio: string;
  preferred_contact: string;
}

const SECTOR_OPTIONS = [
  "UX / Product Design",
  "Technology",
  "Finance",
  "Law",
  "Medicine",
  "Education",
  "Creative Arts",
  "Public Health",
  "Engineering",
  "Other",
];

const CONTACT_OPTIONS = ["Platform Messages", "Email", "WhatsApp"];

export default function MentorProfilePage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [totalMentees, setTotalMentees] = useState(0);
  const [activeMentees, setActiveMentees] = useState(0);

  const [form, setForm] = useState<FormState>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    sector_expertise: "",
    years_experience: "",
    bio: "",
    preferred_contact: "",
  });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const [
        { data: profile },
        { data: mentor },
        { count: total },
        { count: active },
      ] = await Promise.all([
        supabase.from("profiles").select("full_name, email, phone, location").eq("id", user.id).single(),
        supabase.from("mentors").select("sector_expertise, years_experience, bio, preferred_contact").eq("id", user.id).single(),
        supabase.from("mentorship_requests").select("*", { count: "exact", head: true }).eq("mentor_id", user.id).neq("status", "rejected"),
        supabase.from("mentorship_requests").select("*", { count: "exact", head: true }).eq("mentor_id", user.id).eq("status", "accepted"),
      ]);

      setTotalMentees(total ?? 0);
      setActiveMentees(active ?? 0);

      setForm({
        full_name: profile?.full_name ?? "",
        email: profile?.email ?? user.email ?? "",
        phone: profile?.phone ?? "",
        location: profile?.location ?? "",
        sector_expertise: mentor?.sector_expertise ?? "",
        years_experience: mentor?.years_experience != null ? String(mentor.years_experience) : "",
        bio: mentor?.bio ?? "",
        preferred_contact: mentor?.preferred_contact ?? "",
      });

      setLoading(false);
    }

    load();
  }, []);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const [{ error: profileError }, { error: mentorError }] = await Promise.all([
      supabase.from("profiles").update({
        full_name: form.full_name,
        phone: form.phone,
        location: form.location,
      }).eq("id", userId),
      supabase.from("mentors").upsert({
        id: userId,
        sector_expertise: form.sector_expertise,
        years_experience: form.years_experience ? Number(form.years_experience) : null,
        bio: form.bio,
        preferred_contact: form.preferred_contact,
      }),
    ]);

    if (profileError || mentorError) {
      setSaveError("Failed to save changes. Please try again.");
    } else {
      setSaveSuccess(true);
    }

    setSaving(false);
  };

  const firstName = form.full_name.split(" ")[0] || "Mentor";

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
        label="Profile"
        title="My Mentor Profile"
        action={
          <Btn onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Btn>
        }
      />
      {saveError && (
        <p className="text-[0.8rem] text-red-600 mb-4">{saveError}</p>
      )}
      {saveSuccess && (
        <p className="text-[0.8rem] text-sage mb-4">Profile updated successfully.</p>
      )}
      <div className="grid md:grid-cols-[1fr_260px] gap-6 max-w-[860px]">
        <Card>
          <div className="flex gap-4 items-center mb-6">
            <Avatar name={form.full_name || "M"} size={64} colorClass="bg-terra" />
            <div>
              <p className="font-serif text-[1.4rem] font-semibold">{form.full_name || "—"}</p>
              <p className="text-[0.75rem] text-sage">● Available for mentorship</p>
            </div>
          </div>
          <FormInput
            label="Full Name"
            placeholder="Your full name"
            value={form.full_name}
            onChange={set("full_name")}
          />
          <FormInput
            label="Email"
            placeholder="your@email.com"
            value={form.email}
            disabled
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
          <FormSelect
            label="Sector Expertise"
            options={SECTOR_OPTIONS}
            value={form.sector_expertise}
            onChange={set("sector_expertise")}
          />
          <FormInput
            label="Years of Experience"
            type="number"
            placeholder="e.g. 8"
            value={form.years_experience}
            onChange={set("years_experience")}
          />
          <FormTextarea
            label="Bio"
            placeholder="Describe your expertise and mentorship approach…"
            rows={4}
            value={form.bio}
            onChange={set("bio")}
          />
          <FormSelect
            label="Preferred Contact"
            options={CONTACT_OPTIONS}
            value={form.preferred_contact}
            onChange={set("preferred_contact")}
          />
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Mentorship Stats</p>
            {[
              ["Total Mentees", String(totalMentees)],
              ["Active Sessions", String(activeMentees)],
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
