"use client";
import { useState, useEffect } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import Navbar from "@/components/publisher/main/Navbar";
import Domain from "@/components/publisher/main/Domain";
import DynamicComponent from "@/components/publisher/drawer";
import EditablePage from "@/components/publisher/sections";
import { useCurrentUserV2 } from "@/hooks/auth/useCurrentUserV2";
import { useRouter } from "next/navigation";

const Home = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editPage, setEditPage] = useState<string>("");
  const openDrawer = () => setIsOpen(true);
  const { user } = useCurrentUserV2();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.roles?.includes('guide') && !user.roles?.includes('admin') && !user.roles?.includes('team')) {
      router.replace('/error?reason=unauthorized&role=guide');
    }
  }, [user, router]);

  if (user && !user.roles?.includes('guide') && !user.roles?.includes('admin') && !user.roles?.includes('team')) {
    return <div>Access denied</div>;
  }

  return (
    <div className="h-screen font-firamono text-gray-800">
      <Navbar />
      <Domain />
      {/* Page View */}
      <div className="flex justify-center">
        <section className="w-full">
          <EditablePage setEditPage={setEditPage} openDrawer={openDrawer} />
        </section>
        <Drawer
          open={isOpen}
          onClose={() => setIsOpen(false)}
          direction="right"
          size="25%"
          enableOverlay={false}
        >
          <DynamicComponent
            toggleDrawer={() => setIsOpen(false)}
            editPage={editPage}
          />
        </Drawer>
      </div>
    </div>
  );
};

export default Home;
