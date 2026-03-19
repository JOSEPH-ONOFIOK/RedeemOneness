"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, Avatar, Btn, Badge } from "@/components/ui";

interface MentorRequest {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
  member_id: string;
  member_name: string | null;
  member_phone: string | null;
  member_location: string | null;
  member_skills: string[];
  member_sector_interests: string[];
}

const AVATAR_COLORS = ["bg-amber", "bg-sage", "bg-terra", "bg-rich-brown"];

export default function MentorRequestsPage() {
  const supabase = createClient();
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: rawRequests } = await supabase
        .from("mentorship_requests")
        .select("id, status, message, created_at, member_id")
        .eq("mentor_id", user.id)
        .order("created_at", { ascending: false });

      if (!rawRequests || rawRequests.length === 0) {
        setLoading(false);
        return;
      }

      const memberIds = rawRequests.map((r) => r.member_id);

      const [{ data: memberProfiles }, { data: memberData }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, phone, location").in("id", memberIds),
        supabase.from("members").select("id, skills, sector_interests").in("id", memberIds),
      ]);

      const profileMap: Record<string, { full_name: string | null; phone: string | null; location: string | null }> = {};
      (memberProfiles ?? []).forEach((p) => {
        profileMap[p.id] = { full_name: p.full_name, phone: p.phone, location: p.location };
      });

      const memberMap: Record<string, { skills: string[]; sector_interests: string[] }> = {};
      (memberData ?? []).forEach((m) => {
        memberMap[m.id] = { skills: m.skills ?? [], sector_interests: m.sector_interests ?? [] };
      });

      setRequests(
        rawRequests.map((r) => ({
          id: r.id,
          status: r.status,
          message: r.message,
          created_at: r.created_at,
          member_id: r.member_id,
          member_name: profileMap[r.member_id]?.full_name ?? null,
          member_phone: profileMap[r.member_id]?.phone ?? null,
          member_location: profileMap[r.member_id]?.location ?? null,
          member_skills: memberMap[r.member_id]?.skills ?? [],
          member_sector_interests: memberMap[r.member_id]?.sector_interests ?? [],
        }))
      );

      setLoading(false);
    }

    load();
  }, []);

  const updateStatus = async (id: string, status: "accepted" | "rejected") => {
    setUpdating(id);
    const { error } = await supabase
      .from("mentorship_requests")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    }
    setUpdating(null);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const badgeType = (status: string): "pending" | "accepted" | "rejected" => {
    if (status === "accepted") return "accepted";
    if (status === "rejected") return "rejected";
    return "pending";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted text-[0.9rem]">Loading requests…</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle label="Mentorship" title="Requests" />
      {requests.length === 0 ? (
        <div className="max-w-[680px]">
          <Card>
            <p className="text-muted text-[0.85rem] text-center py-10">
              No mentorship requests yet.
            </p>
          </Card>
        </div>
      ) : (
        <div className="space-y-4 max-w-[680px]">
          {requests.map((r, i) => {
            const name = r.member_name ?? "Unknown Member";
            const colorClass = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const sectorLabel = r.member_sector_interests.length > 0
              ? r.member_sector_interests[0]
              : "No sector listed";

            return (
              <Card key={r.id} hover>
                <div className="flex gap-4 mb-3">
                  <Avatar name={name} size={46} colorClass={colorClass} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium">{name}</p>
                      <Badge type={badgeType(r.status)}>{r.status}</Badge>
                    </div>
                    <p className="text-[0.75rem] text-muted">
                      {sectorLabel} · Requested {formatDate(r.created_at)}
                    </p>
                    {r.member_location && (
                      <p className="text-[0.73rem] text-muted">{r.member_location}</p>
                    )}
                  </div>
                </div>

                {r.member_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {r.member_skills.slice(0, 5).map((s) => (
                      <span key={s} className="text-[0.68rem] bg-cream text-rich-brown px-2 py-0.5 rounded-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {r.message && (
                  <p className="text-[0.83rem] leading-[1.7] text-rich-brown bg-cream p-3 rounded-sm mb-4">
                    {r.message}
                  </p>
                )}

                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <Btn
                      small
                      variant="sage"
                      onClick={() => updateStatus(r.id, "accepted")}
                      disabled={updating === r.id}
                    >
                      {updating === r.id ? "Saving…" : "Accept"}
                    </Btn>
                    <Btn
                      small
                      variant="danger"
                      onClick={() => updateStatus(r.id, "rejected")}
                      disabled={updating === r.id}
                    >
                      {updating === r.id ? "Saving…" : "Decline"}
                    </Btn>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
