import MessagesPage from "@/app/ui/messages";

export default function AdminMessagesPage() {
  return (
    <div className="container mx-auto p-6">
      <MessagesPage
        showDelete={true} 
        showRecipientSelect={true}
      />
    </div>
  );
}
