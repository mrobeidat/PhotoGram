import Bottombar from "@/components/Shared/Bottombar";
import LeftSidebar from "@/components/Shared/LeftSidebar";
import Topbar from "@/components/Shared/Topbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen w-full">
      <Topbar />
      <div className="flex flex-1 overflow-y-auto">
        <LeftSidebar />
        <section className="flex flex-1 h-full overflow-hidden">
          <Outlet />
        </section>
      </div>
      <Bottombar />
    </div>
  );
};

export default RootLayout;
