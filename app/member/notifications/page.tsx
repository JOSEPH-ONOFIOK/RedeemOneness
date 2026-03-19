"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle } from "@/components/ui";

type NotifType = "application" | "announcement" | "mentorship";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  created_at: string;
  read: boolean;
}

const APPLICATION_STATUS_LABELS: Record<string, string> = {
  accepted: "Your application was accepted",
  interview: "You have been invited for an interview",
  rejected: "Your application was not successful",
  viewed: "Your application was viewed",
};

const APPLICATION_STATUS_ICONS: Record<string, string> = {
  accepted: "✦",
  interview: "◈",
  rejected: "✕",
  viewed: "◉",
};

const TYPE_ICONS: Record<NotifType, string> = {
  application: "⚡",
  announcement: "📢",
  mentorship: "◈",
};

export default function NotificationsPage() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const notifs: Notification[] = [];

      // Application status notifications
      const { data: applications } = await supabase
        .from("applications")
        .select("id, job_id, status, created_at")
        .eq("member_id", user.id)
        .in("status", ["accepted", "interview", "rejected", "viewed"])
        .order("created_at", { ascending: false });

      if (applications && applications.length > 0) {
        // Fetch job titles if possible
        const jobIds = [...new Set(applications.map((a) => a.job_id).filter(Boolean))];
        let jobTitleMap: Record<string, string> = {};
        if (jobIds.length > 0) {
          const { data: jobs } = await supabase
            .from("jobs")
            .select("id, title")
            .in("id", jobIds);
          (jobs ?? []).forEach((j) => { jobTitleMap[j.id] = j.title; });
        }

        applications.forEach((app) => {
          const statusLabel = APPLICATION_STATUS_LABELS[app.status] ?? `Application status: ${app.status}`;
          const icon = APPLICATION_STATUS_ICONS[app.status] ?? "⚡";
          const jobTitle = app.job_id && jobTitleMap[app.job_id] ? `for "${jobTitleMap[app.job_id]}"` : "";
          notifs.push({
            id: `app-${app.id}`,
            type: "application",
            title: "Application Update",
            description: `${statusLabel}${jobTitle ? " " + jobTitle : ""}.`,
            created_at: app.created_at,
            read: false,
          });
        });
      }

      // Fetch member's branch_id for announcements
      const { data: member } = await supabase
        .from("members")
        .select("branch_id")
        .eq("id", user.id)
        .single();

      // Announcements: platform-wide (branch_id IS NULL) and member's branch
      let announcementQuery = supabase
        .from("announcements")
        .select("id, title, content, created_at, branch_id")
        .order("created_at", { ascending: false })
        .limit(20);

      if (member?.branch_id) {
        announcementQuery = announcementQuery.or(`branch_id.is.null,branch_id.eq.${member.branch_id}`);
      } else {
        announcementQuery = announcementQuery.is("branch_id", null);
      }

      const { data: announcements } = await announcementQuery;

      (announcements ?? []).forEach((a) => {
        notifs.push({
          id: `ann-${a.id}`,
          type: "announcement",
          title: a.title ?? "Announcement",
          description: a.content?.length > 120 ? a.content.slice(0, 120) + "…" : (a.content ?? ""),
          created_at: a.created_at,
          read: false,
        });
      });

      // Mentorship request status updates
      const { data: mentorRequests } = await supabase
        .from("mentorship_requests")
        .select("id, mentor_id, status, created_at")
        .eq("member_id", user.id)
        .in("status", ["accepted", "rejected"])
        .order("created_at", { ascending: false });

      if (mentorRequests && mentorRequests.length > 0) {
        const mentorIds = mentorRequests.map((r) => r.mentor_id);
        const { data: mentorProfiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", mentorIds);

        const mentorNameMap: Record<string, string> = {};
        (mentorProfiles ?? []).forEach((p) => { mentorNameMap[p.id] = p.full_name ?? "A mentor"; });

        mentorRequests.forEach((r) => {
          const name = mentorNameMap[r.mentor_id] ?? "A mentor";
          const desc = r.status === "accepted"
            ? `${name} accepted your mentorship request.`
            : `${name} was unable to accept your mentorship request at this time.`;
          notifs.push({
            id: `ment-${r.id}`,
            type: "mentorship",
            title: r.status === "accepted" ? "Mentor Connected" : "Mentorship Update",
            description: desc,
            created_at: r.created_at,
            read: false,
          });
        });
      }

      // Sort all notifications by created_at descending
      notifs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(notifs);
      setLoading(false);
    }

    load();
  }, []);

  const formatTime = (iso: string) => {
    const now = new Date();
    const d = new Date(iso);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins || 1} min${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted text-[0.9rem]">Loading notifications…</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle label="Updates" title="Notifications" />
      <div className="max-w-[640px] space-y-2">
        {notifications.length === 0 ? (
          <div className="flex gap-4 px-5 py-8 rounded-[4px] border bg-warm-white border-[rgba(60,42,20,0.1)] justify-center">
            <p className="text-muted text-[0.85rem]">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const icon = TYPE_ICONS[n.type];
            const isUnread = i < 3; // treat the 3 most recent as unread visually
            return (
              <div
                key={n.id}
                className={`flex gap-4 px-5 py-4 rounded-[4px] border transition-colors ${
                  isUnread
                    ? "bg-cream border-amber/30 border-l-[3px] border-l-amber"
                    : "bg-warm-white border-[rgba(60,42,20,0.1)]"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[0.9rem] shrink-0 ${
                    isUnread ? "bg-amber" : "bg-[rgba(60,42,20,0.06)]"
                  }`}
                >
                  {icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className={`text-[0.88rem] ${isUnread ? "font-medium" : ""}`}>
                      {n.title}
                    </span>
                    <span className="text-[0.7rem] text-muted">{formatTime(n.created_at)}</span>
                  </div>
                  <p className="text-[0.78rem] text-muted mt-0.5">{n.description}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
