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

  useEffect(() => {
    loadUnreadCount();
  }, [refreshKey]);
  const loadUnreadCount = async () => {
    try {
      const result = await getUnreadCount();
      setUnreadCount(result.data || 0);
    } catch (error) {
      console.error("Erreur comptage non lus:", error);
    }
  };
  const handleSelectMessage = async (message: PublicMessage) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      try {
        await markMessageAsRead(message.id);
        setRefreshKey((k) => k + 1);
      } catch (error) {
        console.error("Erreur marquage comme lu:", error);
      }
    }
  };
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-md">
                <Inbox className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600">
                    {unreadCount} message{unreadCount > 1 ? "s" : ""} non lu
                    {unreadCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            <LinkButton onClick={() => setShowNewMessage(true)}>
              <Plus className="w-5 h-5" />
              Nouveau message
            </LinkButton>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* List */}
        <div className="w-full md:w-1/3 lg:w-2/5 border-r bg-white overflow-hidden shadow-sm">
          <MessageList
            onSelectMessage={handleSelectMessage}
            selectedMessageId={selectedMessage?.id}
            showDelete={showDelete}
          />
        </div>

        {/* Detail */}
        <div className="hidden md:flex flex-1">
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
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <Mail className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Sélectionnez un message</p>
              <p className="text-sm">
                Choisissez une conversation pour commencer
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <NewMessage
          onClose={() => setShowNewMessage(false)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
          defaultRecipientId={defaultRecipientId}
          showRecipientSelect={showRecipientSelect}
        />
      )}

      {/* Mobile Message Detail */}
      {selectedMessage && (
        <div className="md:hidden fixed inset-0 bg-white z-50">
          <MessageDetail
            message={selectedMessage}
            onClose={() => setSelectedMessage(null)}
            onReplySuccess={() => {
              setRefreshKey((k) => k + 1);
              setSelectedMessage(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
