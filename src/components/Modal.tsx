import React from "react";

export default function Modal({
  open, onClose, children, title
}: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded shadow max-w-3xl w-full">
        <div className="flex items-center justify-between border-b dark:border-gray-700 p-3">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="px-2 py-1 text-sm border rounded">Close</button>
        </div>
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
}
