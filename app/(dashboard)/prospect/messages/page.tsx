import MessagesPage from "@/app/ui/messages";

export default function ProspectMessagesPage() {
  const ADMIN_ID = "69544058ba281a16b2f744a8";
  return (
    <div className="container mx-auto p-6">
      <MessagesPage defaultRecipientId={ADMIN_ID} />
    </div>
  );
}
