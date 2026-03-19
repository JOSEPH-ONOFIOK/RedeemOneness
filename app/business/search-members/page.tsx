"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, FormInput, Avatar, Tag, Btn } from "@/components/ui";

type Member = {
  id: string;
  skills: string[];
  employment_status: boolean;
  bio: string | null;
  // joined
  full_name: string;
  phone: string | null;
  location: string | null;
  branch_name: string | null;
  church_name: string | null;
};

const AVATAR_COLORS = ["bg-amber", "bg-sage", "bg-terra", "bg-sky", "bg-rich-brown", "bg-forest"];

export default function SearchMembersPage() {
  const supabase = createClient();

  const [skillInput, setSkillInput]     = useState("");
  const [filterEmployed, setFilterEmployed] = useState<"all" | "employed" | "unemployed">("all");
  const [members, setMembers]           = useState<Member[]>([]);
  const [loading, setLoading]           = useState(false);
  const [searched, setSearched]         = useState(false);

  const doSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);

    // Build members query
    let query = supabase
      .from("members")
      .select("id, skills, employment_status, bio, branch_id");

    // Filter by skills if provided
    const trimmed = skillInput.trim();
    if (trimmed) {
      // contains checks if the array column contains all given elements
      const skillTerms = trimmed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (skillTerms.length > 0) {
        query = query.contains("skills", skillTerms);
      }
    }

    // Filter by employment status
    if (filterEmployed === "employed") {
      query = query.eq("employment_status", true);
    } else if (filterEmployed === "unemployed") {
      query = query.eq("employment_status", false);
    }

    const { data: membersRaw } = await query;
    const rawList = membersRaw ?? [];

    if (rawList.length === 0) {
      setMembers([]);
      setLoading(false);
      return;
    }

    const memberIds  = rawList.map((m) => m.id);
    const branchIds  = [...new Set(rawList.map((m) => m.branch_id).filter(Boolean))];

    // Parallel fetches for profiles and branches
    const [profilesRes, branchesRes] = await Promise.all([
      supabase.from("profiles").select("id, full_name, phone, location").in("id", memberIds),
      branchIds.length > 0
        ? supabase.from("branches").select("id, branch_name, church_name").in("id", branchIds)
        : Promise.resolve({ data: [] }),
    ]);

    const profileMap: Record<string, { full_name: string; phone: string | null; location: string | null }> = {};
    for (const p of profilesRes.data ?? []) {
      profileMap[p.id] = { full_name: p.full_name ?? "", phone: p.phone ?? null, location: p.location ?? null };
    }

    const branchMap: Record<string, { branch_name: string; church_name: string }> = {};
    for (const b of (branchesRes as { data: { id: string; branch_name: string; church_name: string }[] | null }).data ?? []) {
      branchMap[b.id] = { branch_name: b.branch_name ?? "", church_name: b.church_name ?? "" };
    }

    const enriched: Member[] = rawList.map((m) => ({
      id: m.id,
      skills: m.skills ?? [],
      employment_status: m.employment_status ?? false,
      bio: m.bio ?? null,
      full_name: profileMap[m.id]?.full_name ?? "Unknown",
      phone: profileMap[m.id]?.phone ?? null,
      location: profileMap[m.id]?.location ?? null,
      branch_name: m.branch_id ? branchMap[m.branch_id]?.branch_name ?? null : null,
      church_name: m.branch_id ? branchMap[m.branch_id]?.church_name ?? null : null,
    }));

    setMembers(enriched);
    setLoading(false);
  }, [skillInput, filterEmployed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Run an initial search on mount to pre-populate results
  useEffect(() => {
    doSearch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch();
    }
  }

  const branchLabel = (m: Member) => {
    if (m.church_name && m.branch_name) return `${m.church_name} – ${m.branch_name}`;
    if (m.church_name) return m.church_name;
    if (m.branch_name) return m.branch_name;
    return null;
  };

  return (
    <>
      <PageTitle label="Recruit" title="Search Members" />

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        {/* Filters sidebar */}
        <div>
          <Card>
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Filters</p>

            <FormInput
              label="Skills (comma-separated)"
              placeholder="e.g. React, Figma"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <div className="mb-5">
              <label className="block text-[0.72rem] tracking-[0.1em] uppercase text-muted mb-1.5">
                Employment Status
              </label>
              <div className="flex flex-col gap-2">
                {(["all", "employed", "unemployed"] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-[0.82rem] cursor-pointer">
                    <input
                      type="radio"
                      name="employment"
                      value={opt}
                      checked={filterEmployed === opt}
                      onChange={() => setFilterEmployed(opt)}
                      className="accent-amber"
                    />
                    {opt === "all" ? "All" : opt === "employed" ? "Employed" : "Open to Work"}
                  </label>
                ))}
              </div>
            </div>

            <Btn small className="w-full justify-center" onClick={doSearch} disabled={loading}>
              {loading ? "Searching…" : "Search"}
            </Btn>
          </Card>
        </div>

        {/* Results */}
        <div>
          {searched && !loading && (
            <p className="text-[0.82rem] text-muted mb-4">
              {members.length} member{members.length !== 1 ? "s" : ""} match your criteria
            </p>
          )}

          {loading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[rgba(60,42,20,0.06)]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-[rgba(60,42,20,0.06)] rounded w-2/3" />
                      <div className="h-3 bg-[rgba(60,42,20,0.06)] rounded w-1/2" />
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-5 w-14 bg-[rgba(60,42,20,0.06)] rounded" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : members.length === 0 && searched ? (
            <Card>
              <p className="text-[0.85rem] text-muted text-center py-8">
                No members found matching your criteria. Try adjusting your filters.
              </p>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {members.map((m, i) => {
                const branch = branchLabel(m);
                return (
                  <Card key={m.id} hover>
                    <div className="flex gap-3 mb-3">
                      <Avatar
                        name={m.full_name}
                        size={42}
                        colorClass={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                      />
                      <div className="min-w-0">
                        <p className="font-serif text-[0.95rem] font-semibold truncate">{m.full_name}</p>
                        <p className="text-[0.7rem] text-muted truncate">
                          {[m.location, branch].filter(Boolean).join(" · ") || "Location not set"}
                        </p>
                        <span
                          className={`text-[0.62rem] px-2 py-0.5 rounded-sm font-medium tracking-[0.08em] uppercase mt-0.5 inline-block ${
                            m.employment_status
                              ? "bg-[rgba(46,107,82,0.12)] text-forest"
                              : "bg-[rgba(196,131,42,0.08)] text-amber"
                          }`}
                        >
                          {m.employment_status ? "Employed" : "Open to Work"}
                        </span>
                      </div>
                    </div>

                    {m.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {m.skills.slice(0, 5).map((s) => (
                          <Tag key={s}>{s}</Tag>
                        ))}
                        {m.skills.length > 5 && <Tag>+{m.skills.length - 5}</Tag>}
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {m.phone && (
                        <a
                          href={`tel:${m.phone}`}
                          className="inline-flex items-center gap-1.5 font-sans font-medium tracking-widest uppercase rounded-sm transition-all duration-200 border text-[0.72rem] px-4 py-1.5 bg-deep-brown text-cream hover:bg-amber"
                        >
                          Call
                        </a>
                      )}
                      <Btn small variant="ghost" href="/business/messages">
                        Message
                      </Btn>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
