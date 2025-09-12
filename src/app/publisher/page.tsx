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
import { usePublisherContent } from "@/hooks/usePublisherContent";

const Home = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editPage, setEditPage] = useState<string>("");
  const openDrawer = () => setIsOpen(true);
  const { user } = useCurrentUserV2();
  const router = useRouter();
  
  // Load content and debug
  const { contentState, hasContent, isLoading, error } = usePublisherContent();
  
  useEffect(() => {
    console.log('[Publisher] Content state:', {
      hasLanding: !!contentState.landing?.fullName,
      hasSlider: contentState.slider?.length > 0,
      hasValue: !!contentState.value?.experience,
      hasLive: !!contentState.live?.image,
      hasTimeline: contentState.timeline?.length > 0,
      hasAvailable: !!contentState.available?.avatar,
      hasOrgs: contentState.organizations?.length > 0,
      hasSocial: contentState.socialChannels?.length > 0,
      isNewWebpage: contentState.isNewWebpage,
      domain: (contentState as any).domain,
      hasContent,
      isLoading,
      error
    });
  }, [contentState, hasContent, isLoading, error]);

  useEffect(() => {
    if (user && !user.roles?.includes('guide') && !user.roles?.includes('admin') && !user.roles?.includes('team')) {
      router.replace('/error?reason=unauthorized&role=guide');
    }
  }, [user, router]);

  if (user && !user.roles?.includes('guide') && !user.roles?.includes('admin') && !user.roles?.includes('team')) {
    return <div>Access denied</div>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen font-firamono text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  // Show error state only if there's a real error and no content
  if (error && !hasContent) {
    return (
      <div className="h-screen font-firamono text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading content: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
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
