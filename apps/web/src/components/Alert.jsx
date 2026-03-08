import { useState } from "react";

export default function Alert({ type = "info", message }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const styles = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <div className={`flex justify-between p-4 rounded ${styles[type]}`}>
      <span>{message}</span>

      <button
        onClick={() => setVisible(false)}
        className="ml-4 font-bold"
      >
        ✕
      </button>
    </div>
  );
}