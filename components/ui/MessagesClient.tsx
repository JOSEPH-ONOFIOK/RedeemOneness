"use client";
import { useState } from "react";
import { Avatar, Btn } from "@/components/ui";

const CONVOS = [
  { name:"XYZ Tech",    last:"Thanks for applying! We'd like to…", time:"2h",  unread:2, color:"bg-sage"       },
  { name:"Adaeze Obi",  last:"Sure, let's schedule a session.",    time:"Yesterday", unread:0, color:"bg-terra" },
  { name:"Branch Admin",last:"Job fair this Saturday at the hall", time:"2d",  unread:1, color:"bg-amber"      },
  { name:"FinCorp Ltd", last:"We've reviewed your application.",   time:"3d",  unread:0, color:"bg-rich-brown" },
];

const MSGS = [
  { from:"them", text:"Hi Chidera! We reviewed your application for the Frontend Intern role.",               time:"10:02 AM" },
  { from:"me",   text:"Thank you so much! I'm really excited about this opportunity.",                        time:"10:15 AM" },
  { from:"them", text:"We'd love to schedule a quick interview. Are you free this Friday at 3pm?",            time:"10:18 AM" },
  { from:"me",   text:"Friday at 3pm works perfectly for me!",                                                time:"10:25 AM" },
  { from:"them", text:"Great! We'll send a calendar invite to your email. Looking forward to speaking.",      time:"10:27 AM" },
];

export default function MessagesClient() {
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState("");

  return (
    <div className="border border-[rgba(60,42,20,0.12)] rounded-[4px] overflow-hidden flex"
         style={{ height: "calc(100vh - 200px)" }}>
      {/* Sidebar */}
      <div className="w-[280px] border-r border-[rgba(60,42,20,0.1)] overflow-y-auto shrink-0">
        {CONVOS.map((c,i)=>(
          <button key={i} onClick={()=>setActive(i)}
            className={`w-full flex gap-3 items-center px-4 py-3.5 border-b border-[rgba(60,42,20,0.06)] text-left transition-colors ${active===i?"bg-cream":"hover:bg-cream/50"}`}>
            <Avatar name={c.name} size={38} colorClass={c.color} />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="text-[0.85rem] font-medium">{c.name}</span>
                <span className="text-[0.68rem] text-muted">{c.time}</span>
              </div>
              <div className="text-[0.75rem] text-muted truncate">{c.last}</div>
            </div>
            {c.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-amber text-cream text-[0.6rem] flex items-center justify-center shrink-0">{c.unread}</div>
            )}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[rgba(60,42,20,0.1)] flex items-center gap-3">
          <Avatar name={CONVOS[active].name} size={36} colorClass={CONVOS[active].color} />
          <div>
            <p className="font-medium text-[0.9rem]">{CONVOS[active].name}</p>
            <p className="text-[0.68rem] text-sage">● Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
          {MSGS.map((m,i)=>(
            <div key={i} className={`flex ${m.from==="me"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2.5 rounded-[4px] text-[0.85rem] leading-[1.6] ${m.from==="me"?"bg-deep-brown text-cream":"bg-cream text-deep-brown"}`}>
                {m.text}
                <div className={`text-[0.65rem] mt-1 ${m.from==="me"?"text-white/40":"text-muted"}`}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 py-3.5 border-t border-[rgba(60,42,20,0.1)] flex gap-3">
          <input
            value={msg}
            onChange={e=>setMsg(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 px-3.5 py-2 border border-[rgba(60,42,20,0.12)] rounded-sm bg-warm-white text-[0.85rem] outline-none focus:border-amber transition-colors"
          />
          <Btn small onClick={()=>setMsg("")}>Send</Btn>
          <Btn small variant="ghost">📎</Btn>
        </div>
      </div>
    </div>
  );
}
