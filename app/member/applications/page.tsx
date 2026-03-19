import { PageTitle, Card, Badge, Btn } from "@/components/ui";

const APPS = [
  { role:"Frontend Intern",          co:"XYZ Tech",    date:"Mar 10", status:"interview" as const },
  { role:"Junior Accountant",        co:"FinCorp Ltd", date:"Mar 8",  status:"viewed"    as const },
  { role:"Graphic Designer",         co:"CreativeNGO", date:"Mar 5",  status:"pending"   as const },
  { role:"Community Health Officer", co:"Healthbridge",date:"Feb 28", status:"accepted"  as const },
  { role:"Teaching Assistant",       co:"EduStart",    date:"Feb 20", status:"rejected"  as const },
];

export default function ApplicationsPage() {
  return (
    <>
      <PageTitle label="Track" title="My Applications" />
      <div className="space-y-3 max-w-[700px]">
        {APPS.map((a)=>(
          <Card key={a.role} hover>
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif text-[1.05rem] font-semibold">{a.role}</span>
                  <Badge type={a.status}>{a.status}</Badge>
                </div>
                <p className="text-[0.78rem] text-muted">{a.co} · Applied {a.date}</p>
              </div>
              <div className="flex gap-2">
                <Btn small variant="ghost" href="/member/jobs/1">View Job</Btn>
                <Btn small variant="ghost" href="/member/messages">Message</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
