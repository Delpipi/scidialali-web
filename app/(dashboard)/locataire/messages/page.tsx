import MessagesPage from "@/app/ui/messages";

export default function ProspectMessagesPage() {
  const ADMIN_ID = "admin_id_here"; // ID de l'admin

  return (
    <div className="container mx-auto p-6">
      <MessagesPage defaultRecipientId={ADMIN_ID} />
    </div>
  );
}
