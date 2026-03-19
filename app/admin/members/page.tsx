"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, FormInput, Avatar, Badge, Btn } from "@/components/ui";

type Member = {
  id: string;
  full_name: string;
  phone: string | null;
  location: string | null;
  skills: string[];
  employment_status: boolean | null;
  joined_at: string;
};

const AVATAR_COLORS = ["bg-amber", "bg-forest", "bg-terra", "bg-sky", "bg-sage", "bg-rich-brown"];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminMembersPage() {
  const [members, setMembers]   = useState<Member[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search,  setSearch]    = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: branch } = await supabase
        .from("branches")
        .select("id")
        .eq("admin_id", user.id)
        .single();

      if (!branch) { setLoading(false); return; }

      const { data } = await supabase
        .from("members")
        .select("id, skills, employment_status, profiles(full_name, phone, location, created_at)")
        .eq("branch_id", branch.id)
        .order("profiles(created_at)", { ascending: false });

      if (data) {
        setMembers(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((m: any) => ({
            id:                m.id,
            full_name:         m.profiles?.full_name  ?? "Unknown",
            phone:             m.profiles?.phone       ?? null,
            location:          m.profiles?.location    ?? null,
            skills:            m.skills ?? [],
            employment_status: m.employment_status ?? null,
            joined_at:         m.profiles?.created_at ?? "",
          }))
        );
      }

      setLoading(false);
    }
    load();
  }, []);

  const filtered = search.trim()
    ? members.filter((m) =>
        m.full_name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : members;

  return (
    <>
      <PageTitle
        label="Branch"
        title="Members"
        action={
          !loading && members.length > 0 ? (
            <Badge type="default">{members.length} Total</Badge>
          ) : undefined
        }
      />

      <div className="grid md:grid-cols-[220px_1fr] gap-6">

        {/* Sidebar filter */}
        <Card>
          <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Search</p>
          <FormInput
            label="Name"
            placeholder="Filter by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[0.72rem] text-muted hover:text-deep-brown transition-colors"
            >
              Clear filter
            </button>
          )}
        </Card>

        {/* Members list */}
        <div>
          {loading ? (
            <Card>
              <p className="text-muted text-[0.85rem] py-4">Loading members…</p>
            </Card>
          ) : members.length === 0 ? (
            <Card>
              <p className="text-muted text-[0.85rem] py-8 text-center">No members in your branch yet.</p>
            </Card>
          ) : (
            <>
              <p className="text-[0.82rem] text-muted mb-4">
                {filtered.length === members.length
                  ? `${members.length} member${members.length !== 1 ? "s" : ""} total`
                  : `${filtered.length} of ${members.length} members`}
              </p>

              {filtered.length === 0 ? (
                <Card>
                  <p className="text-muted text-[0.85rem] py-6 text-center">No members match your search.</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {filtered.map((m, i) => (
                    <Card key={m.id} hover className="py-3 px-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                        <div className="flex gap-3 items-center">
                          <Avatar
                            name={m.full_name}
                            size={38}
                            colorClass={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                          />
                          <div>
                            <p className="font-medium text-[0.88rem]">{m.full_name}</p>
                            <p className="text-[0.7rem] text-muted">
                              {m.phone ? (
                                <a
                                  href={`tel:${m.phone}`}
                                  className="text-sky hover:underline"
                                >
                                  {m.phone}
                                </a>
                              ) : (
                                <span className="italic">No phone</span>
                              )}
                              {m.location && ` · ${m.location}`}
                              {m.joined_at && ` · Joined ${fmtDate(m.joined_at)}`}
                            </p>
                            {m.skills.length > 0 && (
                              <p className="text-[0.68rem] text-amber mt-0.5">
                                {m.skills.slice(0, 4).join(", ")}
                                {m.skills.length > 4 && ` +${m.skills.length - 4} more`}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {m.employment_status === true  && <Badge type="forest">Employed</Badge>}
                          {m.employment_status === false && <Badge type="sky">Job Seeker</Badge>}
                          {m.employment_status === null  && <Badge type="default">Unknown</Badge>}
                          <Btn small variant="ghost" href={`/admin/members/${m.id}`}>
                            Details
                          </Btn>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </>
  );
}
