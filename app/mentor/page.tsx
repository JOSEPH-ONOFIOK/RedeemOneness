"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, StatCard, Card, Avatar, Btn } from "@/components/ui";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface Request {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
  member_id: string;
  member_profile: {
    full_name: string | null;
  } | null;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function MentorHomePage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [recentAnnouncement, setRecentAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [
        { data: profileData },
        { count: pending },
        { count: active },
        { count: announcements },
        { data: requests },
        { data: latestAnnouncement },
      ] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email").eq("id", user.id).single(),
        supabase.from("mentorship_requests").select("*", { count: "exact", head: true }).eq("mentor_id", user.id).eq("status", "pending"),
        supabase.from("mentorship_requests").select("*", { count: "exact", head: true }).eq("mentor_id", user.id).eq("status", "accepted"),
        supabase.from("announcements").select("*", { count: "exact", head: true }).eq("author_id", user.id),
        supabase.from("mentorship_requests").select("id, status, message, created_at, member_id").eq("mentor_id", user.id).eq("status", "pending").order("created_at", { ascending: false }).limit(3),
        supabase.from("announcements").select("id, title, content, created_at").eq("author_id", user.id).order("created_at", { ascending: false }).limit(1).single(),
      ]);

      setProfile(profileData);
      setPendingCount(pending ?? 0);
      setActiveCount(active ?? 0);
      setAnnouncementCount(announcements ?? 0);
      setRecentAnnouncement(latestAnnouncement ?? null);

      if (requests && requests.length > 0) {
        const memberIds = requests.map((r) => r.member_id);
        const { data: memberProfiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", memberIds);

        const profileMap: Record<string, { full_name: string | null }> = {};
        (memberProfiles ?? []).forEach((p) => { profileMap[p.id] = { full_name: p.full_name }; });

        setRecentRequests(
          requests.map((r) => ({
            ...r,
            member_profile: profileMap[r.member_id] ?? null,
          }))
        );
      }

      setLoading(false);
    }

    load();
  }, []);

  const handleAccept = async (requestId: string) => {
    await supabase.from("mentorship_requests").update({ status: "accepted" }).eq("id", requestId);
    setRecentRequests((prev) => prev.filter((r) => r.id !== requestId));
    setPendingCount((c) => Math.max(0, c - 1));
    setActiveCount((c) => c + 1);
  };

  const handleDecline = async (requestId: string) => {
    await supabase.from("mentorship_requests").update({ status: "rejected" }).eq("id", requestId);
    setRecentRequests((prev) => prev.filter((r) => r.id !== requestId));
    setPendingCount((c) => Math.max(0, c - 1));
  };

  const firstName = profile?.full_name?.split(" ")[0] ?? "Mentor";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted text-[0.9rem]">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle label="Mentor Dashboard" title={`Welcome, ${firstName}`} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8">
        <StatCard number={String(activeCount)}      label="Active Mentees"    icon="◈" colorClass="text-amber" />
        <StatCard number={String(pendingCount)}     label="Pending Requests"  icon="⌛" colorClass="text-terra" />
        <StatCard number={String(announcementCount)} label="Announcements"   icon="📢" colorClass="text-sage"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 lg:gap-6">
        <div>
          <h2 className="font-serif text-[1.3rem] font-semibold mb-4">Recent Requests</h2>
          {recentRequests.length === 0 ? (
            <Card>
              <p className="text-muted text-[0.85rem] text-center py-6">No pending mentorship requests.</p>
            </Card>
          ) : (
            recentRequests.map((r) => {
              const name = r.member_profile?.full_name ?? "Unknown Member";
              return (
                <Card key={r.id} hover className="mb-3">
                  <div className="flex gap-4 items-start mb-4">
                    <Avatar name={name} size={42} colorClass="bg-amber" />
                    <div>
                      <p className="font-medium mb-1">{name}</p>
                      <p className="text-[0.82rem] text-muted leading-[1.6]">
                        {r.message ?? "No message provided."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Btn small variant="sage" onClick={() => handleAccept(r.id)}>Accept</Btn>
                    <Btn small variant="danger" onClick={() => handleDecline(r.id)}>Decline</Btn>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Your Announcements</p>
            {recentAnnouncement ? (
              <div className="bg-cream rounded-sm p-3 text-[0.82rem] leading-[1.6] text-rich-brown mb-3">
                <p className="font-medium mb-1">{recentAnnouncement.title}</p>
                <p className="text-muted line-clamp-3">{recentAnnouncement.content}</p>
              </div>
            ) : (
              <p className="text-muted text-[0.82rem] mb-3">No announcements yet.</p>
            )}
            <Btn small variant="ghost" href="/mentor/announcements">Post New Announcement</Btn>
          </Card>
        </div>
      </div>
    </>
  );
}
