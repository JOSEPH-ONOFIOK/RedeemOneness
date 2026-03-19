"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, FormInput, FormTextarea, Btn } from "@/components/ui";

type Announcement = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

function fmtDate(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 14) return "1 week ago";
  return `${Math.floor(diff / 7)} weeks ago`;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading]             = useState(true);
  const [branchId, setBranchId]           = useState<string | null>(null);
  const [userId, setUserId]               = useState<string | null>(null);

  // form state
  const [title,     setTitle]     = useState("");
  const [content,   setContent]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [success,   setSuccess]   = useState(false);

  async function loadAnnouncements(branchId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("announcements")
      .select("id, title, content, created_at")
      .eq("branch_id", branchId)
      .order("created_at", { ascending: false });

    setAnnouncements(data ?? []);
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      setUserId(user.id);

      const { data: branch } = await supabase
        .from("branches")
        .select("id")
        .eq("admin_id", user.id)
        .single();

      if (!branch) { setLoading(false); return; }

      setBranchId(branch.id);
      await loadAnnouncements(branch.id);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!branchId || !userId) return;
    if (!title.trim() || !content.trim()) {
      setError("Title and message are required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("announcements")
      .insert({ author_id: userId, branch_id: branchId, title: title.trim(), content: content.trim() });

    if (insertError) {
      setError(insertError.message);
    } else {
      setTitle("");
      setContent("");
      setSuccess(true);
      await loadAnnouncements(branchId);
    }

    setSubmitting(false);
  }

  return (
    <>
      <PageTitle label="Broadcast" title="Send Announcement" />
      <div className="grid md:grid-cols-[1fr_300px] gap-6 max-w-[900px]">

        {/* Post form */}
        <Card>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Title"
              placeholder="Announcement title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <FormTextarea
              label="Announcement Message"
              placeholder="Type your announcement to branch members…"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            {error && (
              <p className="text-terra text-[0.78rem] mb-4">{error}</p>
            )}
            {success && (
              <p className="text-forest text-[0.78rem] mb-4">Announcement posted successfully.</p>
            )}

            <div className="flex gap-3">
              <Btn
                type="submit"
                className="flex-1 justify-center"
                disabled={submitting || !branchId}
              >
                {submitting ? "Posting…" : "Post Announcement"}
              </Btn>
              <Btn
                variant="ghost"
                onClick={() => { setTitle(""); setContent(""); setError(null); setSuccess(false); }}
              >
                Clear
              </Btn>
            </div>
          </form>
        </Card>

        {/* Previous announcements */}
        <Card>
          <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Previous Announcements</p>

          {loading ? (
            <p className="text-muted text-[0.82rem]">Loading…</p>
          ) : announcements.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-muted text-[0.82rem]">No announcements yet.</p>
              <p className="text-muted text-[0.72rem] mt-1">Post your first announcement to the left.</p>
            </div>
          ) : (
            announcements.map((a) => (
              <div
                key={a.id}
                className="bg-cream rounded-sm p-3 mb-3 last:mb-0"
              >
                <p className="text-[0.82rem] font-medium text-deep-brown leading-snug mb-1">{a.title}</p>
                <p className="text-[0.78rem] leading-[1.6] text-rich-brown">{a.content}</p>
                <p className="text-[0.68rem] text-muted mt-1.5">{fmtDate(a.created_at)}</p>
              </div>
            ))
          )}
        </Card>

      </div>
    </>
  );
}
