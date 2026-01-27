import MessagesPage from "@/app/ui/messages";

export default function Page() {
  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Calendrier des Paiements
        </h1>
        <p className="text-gray-600">
          Gérez et suivez tous les paiements de loyer
        </p>
      </div>
      <MessagesPage showDelete={true} showRecipientSelect={true} />
    </div>
  );
}
