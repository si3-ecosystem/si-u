import { useState, useEffect, useCallback } from "react";
import { Home, Loader2, X, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector, useStore } from "react-redux";
import { setIsNewWebpage } from "@/redux/slice/contentSlice";
import { apiClient, ApiErrorClass } from "@/services/api";
import { type RootState } from "@/redux/store";

const Navbar = ({ onOpenReadMe }: { onOpenReadMe?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [visibleIframe, setVisibleIframe] = useState<string | null>(null);
  const isNewWebpage = useSelector(
    (state: RootState) => state.content.isNewWebpage
  );
  const [iframeLoading, setIframeLoading] = useState(false);

  console.log("is new", isNewWebpage);
  const router = useRouter();
  const dispatch = useDispatch();
  const store = useStore();

  const handlePublish = useCallback(async () => {
    if (loading) return;
    try {
      setLoading(true);
      const contentData = (store.getState() as RootState).content;
      const publishData = {
        landing: contentData.landing,
        slider: contentData.slider,
        value: contentData.value,
        live: contentData.live,
        organizations: contentData.organizations,
        timeline: contentData.timeline,
        available: contentData.available,
        socialChannels: contentData.socialChannels,
        domain: (contentData as any).domain ?? "",
      };
      const url = isNewWebpage ? "/webcontent/publish" : "/webcontent/update";
      const response: any = await apiClient.post(url, publishData);
      if (response.status === "success") {
        const successMessage = isNewWebpage 
          ? "Content published successfully! Please wait 2-3 minutes for IPFS to republish your site."
          : "Content updated successfully! Please wait 2-3 minutes for IPFS to republish your site.";
        toast.success(successMessage, { duration: 6000 });
        dispatch(setIsNewWebpage(false));
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error: any) {
      console.error("Publish error:", error);
      let errorMessage = "";
      if (error instanceof ApiErrorClass) {
        if (error.statusCode === 401) {
          router.replace("/login");
          return;
        }
        if (error.statusCode === 408) {   
          errorMessage = "Request timeout. Not successful - Retry";
        } else {
          errorMessage = `${error.message || "Something went wrong"} - Retry`;
        }
      } else if (error?.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Not successful - Retry";
      } else if (typeof error?.message === "string") {
        errorMessage = `${error.message} - Retry`;
      } else {
        errorMessage = "Not successful - Retry";
      }
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  }, [loading, dispatch, router, store, isNewWebpage]);

  const toggleIframe = useCallback((key: string) => {
    setVisibleIframe(key);
    setIframeLoading(true);
  }, []);

  const closeIframe = useCallback(() => {
    setVisibleIframe(null);
    setIframeLoading(false);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setIframeLoading(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && visibleIframe) {
        closeIframe();
      }
    };
    if (visibleIframe) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [visibleIframe, closeIframe]);

  useEffect(() => {
    if (visibleIframe) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visibleIframe]);

  let buttonText = "";
  if (loading) {
    buttonText = !isNewWebpage ? "Updating..." : "Publishing...";
  } else {
    buttonText = !isNewWebpage ? "Update" : "Publish";
  }

  return (
    <>
      <nav className="font-dm-sans border-y border-gray-300 sm:px-6 lg:px-8">
        <div className="flex relative justify-between items-center px-2 w-full p-1 lg:p-2 max-w-[90rem] mx-auto text-xs">
          {/* Logo Section */}
          <div className="flex gap-2 sm:gap-4 items-center">
            <Home className="size-5" />
            <p className="font-semibold mt-1">Si Her Publisher</p>
          </div>
          {/* Right Section */}
          <div className="flex gap-2 sm:gap-4 items-center">
            {/* Read Me Button */}
            <button
              type="button"
              onClick={onOpenReadMe}
              className="flex gap-2 items-center px-4 h-8 sm:font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 bg-white transition-colors duration-200"
              aria-label="Open Read Me Instructions"
            >
              <BookOpen className="size-4" />
              Read Me
            </button>

            {/* Aurpay Tutorial Button */}
            <button
              type="button"
              onClick={() => toggleIframe("aurpay")}
              className="flex gap-2 items-center px-4 h-8 sm:font-medium border border-gray-600 rounded-lg hover:bg-gray-200 bg-white transition-colors duration-200"
              aria-label="Open Aurpay Tutorial"
            >
              Aurpay Tutorial
            </button>

            {/* Publish Button */}
            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className={`flex gap-2 items-center px-4 h-8 sm:font-medium text-white rounded-lg transition-all duration-200 ${
                loading 
                  ? "bg-yellow-600 cursor-not-allowed" 
                  : "bg-gray-900 hover:shadow-md hover:bg-gray-800"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={loading ? "Processing..." : "Publish content"}
            >
              <div
                className={`size-2 rounded-full ${
                  loading ? "bg-yellow-400 animate-pulse" : "bg-emerald-400"
                }`}
              />
              {buttonText}
              {loading && <Loader2 className="animate-spin size-5 ml-1" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Iframe Modal */}
      {visibleIframe === "aurpay" && (
        <div
          className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={closeIframe}
          role="dialog"
          aria-modal="true"
          aria-labelledby="iframe-title"
        >
          <button
            className="relative p-5 w-4/5 max-w-2xl bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {!iframeLoading && (
              <button
                onClick={closeIframe}
                className="absolute top-1 right-1 z-10"
                aria-label="Close tutorial"
              >
                <X className="text-red-500 size-10 hover:text-red-600 transition-colors duration-200" />
              </button>
            )}
            {iframeLoading && (
              <div className="flex justify-center items-center h-96">
                <div className="w-16 h-16 rounded-full border-t-4 border-blue-500 animate-spin" />
              </div>
            )}
            <iframe
              src="https://player.vimeo.com/video/929334312?badge=0&autopause=0&player_id=0&app_id=58479"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              title="Aurpay Tutorial"
              id="iframe-title"
              className={`w-full h-96 border border-gray-300 rounded ${
                iframeLoading ? "hidden" : "block"
              }`}
              onLoad={handleIframeLoad}
            />
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
