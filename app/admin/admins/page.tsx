import { PageTitle, Card, Avatar, Badge, Btn } from "@/components/ui";

export default function AdminAdminsPage() {
  return (
    <>
      <PageTitle label="Administration" title="Admin Management" />
      <div className="max-w-[620px] space-y-4">
        <Card>
          <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">
            Current Admins <span className="text-amber">(2 of 3 max)</span>
          </p>
          {[{n:"Pastor Emmanuel Adeyemi",role:"Head Admin",email:"e.adeyemi@rccg.org",c:"bg-amber",head:true},{n:"Deaconess Funmi Okafor",role:"Co-Admin",email:"f.okafor@rccg.org",c:"bg-sage",head:false}].map(a=>(
            <div key={a.n} className="flex items-center gap-4 py-4 border-b border-[rgba(60,42,20,0.06)] last:border-0">
              <Avatar name={a.n} size={44} colorClass={a.c} />
              <div className="flex-1">
                <p className="font-medium text-[0.88rem]">{a.n}</p>
                <p className="text-[0.72rem] text-muted">{a.role} · {a.email}</p>
              </div>
              {a.head ? <Badge type="accepted">Head Admin</Badge> : <Btn small variant="danger">Request Revoke</Btn>}
            </div>
          ))}
          <div className="pt-4">
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Invite New Admin</p>
            <div className="flex gap-3">
              <input placeholder="Admin email address" className="flex-1 px-3.5 py-2 border border-[rgba(60,42,20,0.12)] rounded-sm bg-warm-white text-[0.85rem] outline-none focus:border-amber transition-colors" />
              <Btn small>Send Invite</Btn>
            </div>
            <p className="text-[0.68rem] text-muted mt-2">Maximum 3 admins per branch. New admins need approval from head admin.</p>
          </div>
        </Card>
        <Card>
          <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-3">Pending Revoke Requests</p>
          <p className="text-[0.85rem] text-muted text-center py-6">No pending requests</p>
        </Card>
      </div>
    </>
  );
}
