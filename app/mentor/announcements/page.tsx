"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, FormInput, FormTextarea, Btn } from "@/components/ui";

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function MentorAnnouncementsPage() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("announcements")
        .select("id, title, content, created_at")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      setAnnouncements(data ?? []);
      setLoading(false);
    }

    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and message are required.");
      return;
    }
    if (!userId) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const { data: inserted, error: insertError } = await supabase
      .from("announcements")
      .insert({
        author_id: userId,
        branch_id: null,
        title: title.trim(),
        content: content.trim(),
      })
      .select("id, title, content, created_at")
      .single();

    if (insertError) {
      setError("Failed to post announcement. Please try again.");
    } else if (inserted) {
      setAnnouncements((prev) => [inserted, ...prev]);
      setTitle("");
      setContent("");
      setSuccess(true);
    }

    setSubmitting(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted text-[0.9rem]">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle label="Outreach" title="Post Announcement" />
      <div className="grid md:grid-cols-[1fr_300px] gap-6 max-w-[900px]">
        <Card>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Title"
              placeholder="e.g. UI Design Mentorship — 3 Spots Available"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
            <FormTextarea
              label="Your Message"
              placeholder="e.g. Looking for 3 students interested in UI design mentorship…"
              rows={5}
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            />
            {error && (
              <p className="text-[0.78rem] text-red-600 mb-3">{error}</p>
            )}
            {success && (
              <p className="text-[0.78rem] text-sage mb-3">Announcement posted successfully.</p>
            )}
            <Btn className="w-full justify-center" type="submit" disabled={submitting}>
              {submitting ? "Publishing…" : "Publish Announcement"}
            </Btn>
          </form>
        </Card>

        <Card>
          <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Previous Announcements</p>
          {announcements.length === 0 ? (
            <p className="text-muted text-[0.82rem]">No announcements posted yet.</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="bg-cream rounded-sm p-3 mb-3 text-[0.82rem] leading-[1.6] text-rich-brown">
                <p className="font-medium mb-0.5">{a.title}</p>
                <p className="text-muted line-clamp-3">{a.content}</p>
                <p className="text-[0.68rem] text-muted mt-1">Posted {formatDate(a.created_at)}</p>
              </div>
            ))
          )}
        </Card>
      </div>
    </>
  );
}
