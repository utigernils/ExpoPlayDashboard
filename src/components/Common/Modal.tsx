import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={`relative transform overflow-hidden bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full ${sizeClasses[size]} max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col`}
      >
        <div className="bg-white px-6 py-4 border-b border-suva-gray-25">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold leading-6 text-gray-900">
          {title}
          </h3>
          <button
          type="button"
          className="rounded-full -md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onClose}
          >
          <span className="sr-only">Close</span>
          <X className="h-5 w-5" />
          </button>
        </div>
        </div>

        <div className="bg-white px-6 py-4 flex-1 overflow-y-auto min-h-0">
        {children}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Modal;
