import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { getNewMessage, clearNotification } from "../components/Custom";

const NotificationHeader: React.FC = () => {
  const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);

  // Check localStorage on component mount
  useEffect(() => {
    setHasNewMessage(getNewMessage());
  }, []);

  // Listen for custom events from other components
  useEffect(() => {
    const handleNewMessageUpdate = (event: CustomEvent) => {
      setHasNewMessage(event.detail.hasNewMessage);
    };

    window.addEventListener(
      "newMessageUpdate",
      handleNewMessageUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "newMessageUpdate",
        handleNewMessageUpdate as EventListener
      );
    };
  }, []);

  const handleNotificationClick = () => {
    clearNotification();
    setHasNewMessage(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleNotificationClick}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        aria-label="Notifications"
      >
        <Bell size={24} className="text-gray-600" />
        {hasNewMessage && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
};

export default NotificationHeader;
