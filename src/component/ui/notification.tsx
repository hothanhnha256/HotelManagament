import React from "react";

export interface NotificationInterface {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Notification({
  message,
  type,
  onClose,
}: NotificationInterface) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`bg-${
          type === "success" ? "green" : "red"
        }-500 text-white text-center py-4 px-6 rounded-lg shadow-lg`}
      >
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button
            className="ml-4 bg-transparent hover:bg-white text-white font-semibold hover:text-black py-1 px-2 border border-white hover:border-transparent rounded"
            onClick={onClose}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}
