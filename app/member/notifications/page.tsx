import { PageTitle, Btn } from "@/components/ui";

const NOTIFS = [
  { icon:"⚡", title:"New job match",       desc:"Frontend Intern at XYZ Tech matches your profile",           time:"2 hours ago",  unread:true  },
  { icon:"✉", title:"New message",         desc:"XYZ Tech sent you a message about your application",         time:"3 hours ago",  unread:true  },
  { icon:"◈", title:"Mentor responded",    desc:"Adaeze Obi accepted your mentorship request",                 time:"Yesterday",    unread:true  },
  { icon:"📢",title:"Branch announcement", desc:"Job fair this Saturday at the RCCG Lagos Island main hall",   time:"2 days ago",   unread:false },
  { icon:"⚡", title:"Application update", desc:"FinCorp Ltd viewed your application for Junior Accountant",   time:"3 days ago",   unread:false },
  { icon:"✦", title:"Profile reminder",    desc:"Complete your profile to improve your job match score",       time:"5 days ago",   unread:false },
];

export default function NotificationsPage() {
  return (
    <>
      <PageTitle label="Updates" title="Notifications" action={<Btn small variant="ghost">Mark all read</Btn>} />
      <div className="max-w-[640px] space-y-2">
        {NOTIFS.map((n,i)=>(
          <div key={i}
            className={`flex gap-4 px-5 py-4 rounded-[4px] border transition-colors ${n.unread ? "bg-cream border-amber/30 border-l-[3px] border-l-amber" : "bg-warm-white border-[rgba(60,42,20,0.1)]"}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[0.9rem] shrink-0 ${n.unread?"bg-amber":"bg-[rgba(60,42,20,0.06)]"}`}>{n.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className={`text-[0.88rem] ${n.unread?"font-medium":""}`}>{n.title}</span>
                <span className="text-[0.7rem] text-muted">{n.time}</span>
              </div>
              <p className="text-[0.78rem] text-muted mt-0.5">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
