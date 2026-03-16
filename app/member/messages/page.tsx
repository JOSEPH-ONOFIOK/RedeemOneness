import { PageTitle } from "@/components/ui";
import MessagesClient from "@/components/ui/MessagesClient";

export default function MemberMessagesPage() {
  return (
    <>
      <PageTitle label="Inbox" title="Messages" />
      <MessagesClient />
    </>
  );
}
