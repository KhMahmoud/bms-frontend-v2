import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] p-4 md:p-5">
      <div className="mx-auto grid max-w-[1480px] gap-6 lg:grid-cols-[272px_minmax(0,1fr)]">
        <div className="self-start lg:sticky lg:top-4">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1 pb-12 pt-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
