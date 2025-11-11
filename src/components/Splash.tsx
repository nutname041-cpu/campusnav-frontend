import React, { useEffect, useState } from "react";

export default function Splash({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!show) return <>{children}</>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-[9999]">
      <div className="animate-pulse text-center">
        <img src="/logo.png" alt="logo" className="w-20 h-20 mx-auto mb-3" />
        <div className="text-lg font-semibold">Campus Navigation</div>
      </div>
    </div>
  );
}
