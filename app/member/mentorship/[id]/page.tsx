"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Card, Tag, Btn, Avatar, FormTextarea } from "@/components/ui";

interface MentorDetail {
  id: string;
  full_name: string | null;
  location: string | null;
  sector_expertise: string | null;
  years_experience: number | null;
  bio: string | null;
  preferred_contact: string | null;
}

type RequestStatus = "none" | "pending" | "accepted" | "rejected";

export default function MentorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: mentorId } = use(params);
  const supabase = createClient();

  const [mentor, setMentor] = useState<MentorDetail | null>(null);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("none");
  const [existingRequestId, setExistingRequestId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const [{ data: mentorRow }, { data: profile }, { data: existingRequest }] = await Promise.all([
        supabase.from("mentors").select("id, sector_expertise, years_experience, bio, preferred_contact").eq("id", mentorId).single(),
        supabase.from("profiles").select("id, full_name, location").eq("id", mentorId).single(),
        supabase.from("mentorship_requests").select("id, status").eq("mentor_id", mentorId).eq("member_id", user.id).maybeSingle(),
      ]);

      if (mentorRow && profile) {
        setMentor({
          id: mentorRow.id,
          full_name: profile.full_name,
          location: profile.location,
          sector_expertise: mentorRow.sector_expertise,
          years_experience: mentorRow.years_experience,
          bio: mentorRow.bio,
          preferred_contact: mentorRow.preferred_contact,
        });
      }

      if (existingRequest) {
        setRequestStatus(existingRequest.status as RequestStatus);
        setExistingRequestId(existingRequest.id);
      }

      setLoading(false);
    }

    load();
  }, [mentorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !mentor) return;

    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("mentorship_requests").insert({
      mentor_id: mentor.id,
      member_id: userId,
      status: "pending",
      message: message.trim() || null,
    });

    if (error) {
      setSubmitError("Failed to send request. Please try again.");
    } else {
      setRequestStatus("pending");
      setMessage("");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted text-[0.9rem]">Loading mentor profile…</p>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="max-w-[860px]">
        <Link href="/member/mentorship" className="text-[0.8rem] text-muted hover:text-deep-brown block mb-6">
          ← Back to Mentors
        </Link>
        <Card>
          <p className="text-muted text-[0.85rem] text-center py-10">Mentor not found.</p>
        </Card>
      </div>
    );
  }

  const name = mentor.full_name ?? "Unknown Mentor";
  const nameParts = name.split(" ");
  const lastName = nameParts.slice(1).join(" ");

  return (
    <div className="max-w-[860px]">
      <Link href="/member/mentorship" className="text-[0.8rem] text-muted hover:text-deep-brown block mb-6">
        ← Back to Mentors
      </Link>
      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        <div>
          <div className="flex gap-6 items-start mb-8">
            <Avatar name={name} size={72} colorClass="bg-terra" />
            <div>
              <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-1">Mentor Profile</p>
              <h1 className="font-serif text-[2.2rem] font-light">
                {nameParts[0]}{lastName && <> <em className="text-amber">{lastName}</em></>}
              </h1>
              <p className="text-[0.85rem] text-muted">
                {[mentor.sector_expertise, mentor.location, mentor.years_experience != null ? `${mentor.years_experience} years experience` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>

          {mentor.bio && (
            <Card className="mb-4">
              <h3 className="font-serif text-[1.2rem] mb-3">About</h3>
              <p className="text-[0.88rem] leading-[1.8] text-rich-brown">{mentor.bio}</p>
            </Card>
          )}

          {mentor.sector_expertise && (
            <Card className="mb-4">
              <h3 className="font-serif text-[1.2rem] mb-3">Sector</h3>
              <div className="flex flex-wrap gap-1.5">
                <Tag amber>{mentor.sector_expertise}</Tag>
              </div>
            </Card>
          )}

          {requestStatus === "none" && (
            <Card>
              <h3 className="font-serif text-[1.2rem] mb-3">Request Mentorship</h3>
              <form onSubmit={handleSubmit}>
                <FormTextarea
                  label="Message (optional)"
                  placeholder="Introduce yourself and explain what kind of guidance you're looking for…"
                  rows={4}
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                />
                {submitError && (
                  <p className="text-[0.78rem] text-red-600 mb-3">{submitError}</p>
                )}
                <Btn className="w-full justify-center" type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Send Mentorship Request"}
                </Btn>
              </form>
            </Card>
          )}

          {requestStatus === "pending" && (
            <Card>
              <p className="text-[0.85rem] text-muted text-center py-4">
                Your mentorship request has been sent and is awaiting a response.
              </p>
            </Card>
          )}

          {requestStatus === "accepted" && (
            <Card>
              <p className="text-[0.85rem] text-sage text-center py-4">
                ● You are connected with this mentor.
              </p>
            </Card>
          )}

          {requestStatus === "rejected" && (
            <Card>
              <p className="text-[0.85rem] text-muted text-center py-4">
                Your previous request was not accepted. You may reach out through messages.
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Details</p>
            <dl className="space-y-2">
              {[
                ["Sector", mentor.sector_expertise],
                ["Experience", mentor.years_experience != null ? `${mentor.years_experience} years` : null],
                ["Location", mentor.location],
                ["Contact Via", mentor.preferred_contact],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[0.82rem]">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
