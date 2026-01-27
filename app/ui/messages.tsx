"use client";

import { useState, useEffect } from "react";
import { Plus, Inbox, Mail } from "lucide-react";
import { MessageDetail } from "./messages/message-detail";
import { PublicMessage } from "../lib/definitions";
import { getUnreadCount, markMessageAsRead } from "../lib/actions";
import { MessageList } from "./messages/message-list";
import { NewMessage } from "./messages/new-message";
import { LinkButton } from "./button";

interface MessagesPageProps {
  defaultRecipientId?: string;
  showRecipientSelect?: boolean;
  showDelete?: boolean;
}

export default function MessagesPage({
  defaultRecipientId,
  showRecipientSelect = true,
  showDelete = false,
}: MessagesPageProps) {
  const [selectedMessage, setSelectedMessage] = useState<PublicMessage | null>(
    null,
  );
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Synchronisation du nombre de messages non lus
  useEffect(() => {
    let isMounted = true;
    const loadUnreadCount = async () => {
      try {
        const result = await getUnreadCount();
        if (isMounted) setUnreadCount(result.data || 0);
      } catch (error) {
        console.error("Erreur comptage:", error);
      }
    };
    loadUnreadCount();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleSelectMessage = async (message: PublicMessage) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      try {
        await markMessageAsRead(message.id);
        setRefreshKey((k) => k + 1);
      } catch (error) {
        console.error("Erreur lecture:", error);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-white md:bg-gray-50 overflow-hidden">
      {/* Header : Masqué sur mobile quand un message est ouvert pour maximiser l'espace */}
      <div
        className={`${selectedMessage ? "hidden md:block" : "block"} border-b bg-white`}
      >
        <div className="px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="hidden md:flex p-2 bg-primary/10 rounded-md">
                <Inbox className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Messagerie
                </h1>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  {unreadCount > 0
                    ? `${unreadCount} non lus`
                    : "Tous les messages lus"}
                </p>
              </div>
            </div>

            {/* Version Icône seule sur Mobile pour gagner de la place */}
            <LinkButton
              onClick={() => setShowNewMessage(true)}
              className="rounded-full md:rounded-lg px-3 md:px-4"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline ml-2">Nouveau</span>
            </LinkButton>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Liste des messages : Pleine largeur sur mobile, 1/3 sur desktop */}
        <div
          className={`
          ${selectedMessage ? "hidden md:block" : "block"} 
          w-full md:w-87.5 lg:w-100 border-r bg-white overflow-y-auto
        `}
        >
          <MessageList
            onSelectMessage={handleSelectMessage}
            selectedMessageId={selectedMessage?.id}
            showDelete={showDelete}
          />
        </div>

        {/* Détail du message : Superposé sur mobile, à droite sur desktop */}
        <div
          className={`
          ${selectedMessage ? "flex" : "hidden md:flex"} 
          flex-1 flex-col bg-white z-10 md:z-0 absolute inset-0 md:relative
        `}
        >
          {selectedMessage ? (
            <MessageDetail
              message={selectedMessage}
              onClose={() => setSelectedMessage(null)}
              onReplySuccess={() => {
                setRefreshKey((k) => k + 1);
                setSelectedMessage(null);
              }}
            />
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center flex-1 text-gray-400 bg-gray-50">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-lg font-medium">Aucune conversation</p>
              <p className="text-sm">
                Sélectionnez un message pour l'afficher ici
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nouveau Message */}
      {showNewMessage && (
        <NewMessage
          onClose={() => setShowNewMessage(false)}
          onSuccess={() => {
            setShowNewMessage(false);
            setRefreshKey((k) => k + 1);
          }}
          defaultRecipientId={defaultRecipientId}
          showRecipientSelect={showRecipientSelect}
        />
      )}
    </div>
  );
}
