"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle, Card, Avatar } from "@/components/ui";

type BirthdayMember = {
  id: string;
  full_name: string;
  phone: string | null;
  date_of_birth: string;
  day: number;
  month: number;
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const COLORS  = ["bg-amber","bg-forest","bg-terra","bg-sky","bg-sage","bg-rich-brown"];

export default function BirthdaysPage() {
  const [members,  setMembers]  = useState<BirthdayMember[]>([]);
  const [month,    setMonth]    = useState(new Date().getMonth()); // 0-indexed
  const [loading,  setLoading]  = useState(true);
  const [branchId, setBranchId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: branch } = await supabase.from("branches").select("id").eq("admin_id", user.id).single();
      if (branch) setBranchId(branch.id);
    }
    init();
  }, []);

  useEffect(() => {
    if (!branchId) return;
    async function fetchBirthdays() {
      setLoading(true);
      const supabase = createClient();
      // month+1 because Postgres EXTRACT returns 1-12
      const { data } = await supabase
        .from("members")
        .select("id, date_of_birth, profiles(full_name, phone)")
        .eq("branch_id", branchId)
        .not("date_of_birth", "is", null)
        .filter("date_of_birth", "not.is", null);

      if (data) {
        const filtered = data
          .filter((m: any) => {
            if (!m.date_of_birth) return false;
            const d = new Date(m.date_of_birth);
            return d.getMonth() === month;
          })
          .map((m: any) => {
            const d = new Date(m.date_of_birth);
            return {
              id:            m.id,
              full_name:     m.profiles?.full_name ?? "—",
              phone:         m.profiles?.phone     ?? null,
              date_of_birth: m.date_of_birth,
              day:           d.getDate(),
              month:         d.getMonth(),
            };
          })
          .sort((a: BirthdayMember, b: BirthdayMember) => a.day - b.day);
        setMembers(filtered);
      }
      setLoading(false);
    }
    fetchBirthdays();
  }, [branchId, month]);

  const today    = new Date();
  const thisMonth = today.getMonth();
  const todayDay  = today.getDate();

  return (
    <>
      <PageTitle label="Community" title="Upcoming Birthdays" />

      {/* Month selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {MONTHS.map((m, i) => (
          <button key={m} onClick={() => setMonth(i)}
            className={`text-[0.72rem] tracking-[0.08em] uppercase px-3 py-1.5 rounded-sm border transition-colors ${
              i === month
                ? "bg-amber text-cream border-amber"
                : "border-[rgba(60,42,20,0.15)] text-muted hover:border-amber hover:text-amber"
            }`}>
            {m.slice(0,3)}
          </button>
        ))}
      </div>

      <div className="max-w-[640px]">
        <p className="text-[0.78rem] text-muted mb-4">
          {loading ? "Loading…" : `${members.length} member${members.length !== 1 ? "s" : ""} with birthdays in ${MONTHS[month]}`}
        </p>

        {!loading && members.length === 0 && (
          <Card>
            <p className="text-muted text-[0.88rem] text-center py-8">
              No birthdays recorded for {MONTHS[month]}
            </p>
          </Card>
        )}

        <div className="space-y-3">
          {members.map((m, i) => {
            const isToday   = month === thisMonth && m.day === todayDay;
            const isPast    = month === thisMonth && m.day < todayDay;
            const daysAway  = month === thisMonth ? m.day - todayDay : null;

            return (
              <Card key={m.id} className={isToday ? "border border-amber/40 bg-amber/5" : ""}>
                <div className="flex items-center gap-4">
                  {/* Day badge */}
                  <div className={`w-14 h-14 rounded-sm flex flex-col items-center justify-center shrink-0 ${isToday ? "bg-amber" : isPast ? "bg-[rgba(60,42,20,0.06)]" : "bg-cream"}`}>
                    <span className={`font-serif text-[1.6rem] font-light leading-none ${isToday ? "text-cream" : "text-deep-brown"}`}>{m.day}</span>
                    <span className={`text-[0.6rem] tracking-[0.1em] uppercase ${isToday ? "text-cream/70" : "text-muted"}`}>{MONTHS[month].slice(0,3)}</span>
                  </div>

                  <Avatar name={m.full_name} size={40} colorClass={COLORS[i % COLORS.length]} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[0.88rem] truncate">{m.full_name}</p>
                      {isToday && <span className="text-[0.62rem] px-2 py-0.5 bg-amber text-cream rounded-sm uppercase tracking-wide">🎂 Today!</span>}
                    </div>
                    <p className="text-[0.72rem] text-muted mt-0.5">
                      {m.phone
                        ? <a href={`tel:${m.phone}`} className="text-sky hover:underline">{m.phone}</a>
                        : <span className="italic">No phone on record</span>}
                    </p>
                    {daysAway !== null && daysAway > 0 && (
                      <p className="text-[0.68rem] text-forest mt-0.5">In {daysAway} day{daysAway !== 1 ? "s" : ""}</p>
                    )}
                    {isPast && <p className="text-[0.68rem] text-muted/60 mt-0.5">Passed this month</p>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
