import React, { createContext, useContext, useState, ReactNode } from "react";
import Notification from "../components/Common/Notification";

interface NotificationOptions {
  title: string;
  description: string;
  state: "success" | "info" | "error";
}

interface NotificationContextType {
  notify: (options: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<NotificationOptions | null>(
    null,
  );

  const notify = (options: NotificationOptions) => {
    setNotification(options);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && <Notification {...notification} />}
    </NotificationContext.Provider>
  );
};
