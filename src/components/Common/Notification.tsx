import React, { useEffect, useState } from "react";
import { CheckCircle, Info, XCircle } from "lucide-react";

interface NotificationProps {
  title: string;
  description: string;
  state: "success" | "info" | "error";
}

const stateStyles = {
  success: {
    icon: <CheckCircle className="text-suva-positive w-6 h-6" />,
    bg: "bg-white border-suva-positive",
  },
  info: {
    icon: <Info className="text-suva-info w-6 h-6" />,
    bg: "bg-white border-suva-info",
  },
  error: {
    icon: <XCircle className="text-suva-negative w-6 h-6" />,
    bg: "bg-white border-suva-negative",
  },
};

const Notification: React.FC<NotificationProps> = ({
  title,
  description,
  state,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed top-5 right-5 max-w-sm w-full border  -2xl shadow-lg p-4 flex items-start gap-3 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-5 pointer-events-none"
      } ${stateStyles[state].bg}`}
    >
      {stateStyles[state].icon}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Notification;
