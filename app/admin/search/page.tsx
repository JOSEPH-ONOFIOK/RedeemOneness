"use client";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, Avatar, Tag, Btn } from "@/components/ui";

type Result = {
  id: string;
  full_name: string;
  phone: string | null;
  location: string | null;
  skills: string[];
  employment_status: boolean | null;
  branch_name: string;
};

const COLORS = ["bg-amber","bg-forest","bg-terra","bg-sky","bg-sage","bg-rich-brown"];

export default function AdminSearchPage() {
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    startTransition(async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("members")
        .select("id, skills, employment_status, branches(branch_name, church_name), profiles(full_name, phone, location)")
        .contains("skills", [query.trim()]);

      setResults((data ?? []).map((m: any) => ({
        id:                m.id,
        full_name:         m.profiles?.full_name  ?? "—",
        phone:             m.profiles?.phone       ?? null,
        location:          m.profiles?.location    ?? null,
        skills:            m.skills ?? [],
        employment_status: m.employment_status,
        branch_name:       m.branches ? `${m.branches.church_name} — ${m.branches.branch_name}` : "—",
      })));
      setSearched(true);
    });
  }

  return (
    <>
      <PageTitle label="Network" title="Search by Skill" />

      <Card className="mb-6 max-w-[560px]">
        <form onSubmit={handleSearch}>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-[0.72rem] tracking-[0.1em] uppercase text-muted mb-1.5">Skill</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. React, Finance, Nursing…"
                className="w-full px-3.5 py-2.5 border border-[rgba(60,42,20,0.12)] rounded-sm bg-warm-white text-deep-brown text-[0.88rem] outline-none focus:border-amber transition-colors"
              />
            </div>
            <Btn type="submit" disabled={isPending}>
              {isPending ? "Searching…" : "Search"}
            </Btn>
          </div>
          <p className="text-[0.68rem] text-muted mt-2">
            Search members across all branches by skill tag.
          </p>
        </form>
      </Card>

      {searched && (
        <p className="text-[0.78rem] text-muted mb-4">
          {results.length === 0
            ? `No members found with skill "${query}"`
            : `${results.length} member${results.length !== 1 ? "s" : ""} found with skill "${query}"`}
        </p>
      )}

      {results.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((m, i) => (
            <Card key={m.id} hover className="p-4">
              <div className="flex gap-3 mb-3">
                <Avatar name={m.full_name} size={40} colorClass={COLORS[i % COLORS.length]} />
                <div className="min-w-0">
                  <p className="text-[0.88rem] font-medium truncate">{m.full_name}</p>
                  <p className="text-[0.7rem] text-muted truncate">{m.branch_name}</p>
                  {m.location && <p className="text-[0.68rem] text-muted/60 truncate">{m.location}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {m.skills.map(s => (
                  <Tag key={s} amber={s.toLowerCase() === query.toLowerCase()}>{s}</Tag>
                ))}
              </div>
              {m.phone && (
                <p className="text-[0.72rem] mb-2">
                  <a href={`tel:${m.phone}`} className="text-sky hover:underline">{m.phone}</a>
                </p>
              )}
              <div className="flex items-center justify-between">
                {m.employment_status === true  && <span className="text-[0.65rem] text-forest">● Employed</span>}
                {m.employment_status === false && <span className="text-[0.65rem] text-sky">● Job Seeker</span>}
                {m.employment_status === null  && <span className="text-[0.65rem] text-muted">Not specified</span>}
                <Btn small variant="ghost">View Profile</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
