"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, Avatar, Btn } from "@/components/ui";

interface MentorCard {
  id: string;
  full_name: string | null;
  location: string | null;
  sector_expertise: string | null;
  years_experience: number | null;
  bio: string | null;
  requestStatus: "none" | "pending" | "accepted" | "rejected";
}

const AVATAR_COLORS = ["bg-terra", "bg-amber", "bg-sage", "bg-rich-brown"];

export default function MentorshipPage() {
  const supabase = createClient();
  const [mentors, setMentors] = useState<MentorCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const [{ data: mentorRows }, { data: myRequests }] = await Promise.all([
        supabase.from("mentors").select("id, sector_expertise, years_experience, bio"),
        supabase
          .from("mentorship_requests")
          .select("mentor_id, status")
          .eq("member_id", user.id),
      ]);

      if (!mentorRows || mentorRows.length === 0) {
        setLoading(false);
        return;
      }

      const mentorIds = mentorRows.map((m) => m.id);
      const { data: profileRows } = await supabase
        .from("profiles")
        .select("id, full_name, location")
        .in("id", mentorIds);

      const profileMap: Record<string, { full_name: string | null; location: string | null }> = {};
      (profileRows ?? []).forEach((p) => {
        profileMap[p.id] = { full_name: p.full_name, location: p.location };
      });

      const requestMap: Record<string, string> = {};
      (myRequests ?? []).forEach((r) => {
        requestMap[r.mentor_id] = r.status;
      });

      setMentors(
        mentorRows.map((m) => ({
          id: m.id,
          full_name: profileMap[m.id]?.full_name ?? null,
          location: profileMap[m.id]?.location ?? null,
          sector_expertise: m.sector_expertise,
          years_experience: m.years_experience,
          bio: m.bio,
          requestStatus: (requestMap[m.id] as MentorCard["requestStatus"]) ?? "none",
        }))
      );

      setLoading(false);
    }

    load();
  }, []);

  const handleRequest = async (mentorId: string) => {
    if (!userId) return;
    setRequesting(mentorId);

    const { error } = await supabase.from("mentorship_requests").insert({
      mentor_id: mentorId,
      member_id: userId,
      status: "pending",
      message: null,
    });

    if (!error) {
      setMentors((prev) =>
        prev.map((m) => (m.id === mentorId ? { ...m, requestStatus: "pending" } : m))
      );
    }

    setRequesting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted text-[0.9rem]">Loading mentors…</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle label="Growth" title="Find a Mentor" />
      {mentors.length === 0 ? (
        <Card className="max-w-[480px]">
          <p className="text-muted text-[0.85rem] text-center py-10">
            No mentors are available at the moment.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mentors.map((m, i) => {
            const name = m.full_name ?? "Unknown Mentor";
            const colorClass = AVATAR_COLORS[i % AVATAR_COLORS.length];

            return (
              <Card key={m.id} hover>
                <div className="flex gap-3 mb-3">
                  <Avatar name={name} size={48} colorClass={colorClass} />
                  <div>
                    <p className="font-serif text-[1.05rem] font-semibold">{name}</p>
                    <p className="text-[0.73rem] text-muted">{m.sector_expertise ?? "—"}</p>
                    {m.location && (
                      <p className="text-[0.68rem] text-muted mt-0.5">{m.location}</p>
                    )}
                  </div>
                </div>
                {m.years_experience != null && (
                  <p className="text-[0.78rem] text-muted mb-1">{m.years_experience} years experience</p>
                )}
                {m.bio && (
                  <p className="text-[0.8rem] leading-[1.6] text-rich-brown mb-4 line-clamp-3">{m.bio}</p>
                )}
                <div className="flex gap-2">
                  <Btn small href={`/member/mentorship/${m.id}`} variant="ghost">
                    View Profile
                  </Btn>
                  {m.requestStatus === "pending" && (
                    <span className="text-[0.75rem] text-muted self-center px-2">Request Sent</span>
                  )}
                  {m.requestStatus === "accepted" && (
                    <span className="text-[0.75rem] text-sage self-center px-2">● Connected</span>
                  )}
                  {m.requestStatus === "none" && (
                    <Btn
                      small
                      onClick={() => handleRequest(m.id)}
                      disabled={requesting === m.id}
                    >
                      {requesting === m.id ? "Sending…" : "Request Mentorship"}
                    </Btn>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
