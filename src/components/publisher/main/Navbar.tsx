import { useState, useCallback } from "react";
import { Home, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector, useStore } from "react-redux";
import { setIsNewWebpage, setVersionUpdatedFalse } from "@/redux/slice/contentSlice";
import { apiClient, ApiErrorClass } from "@/services/api";
import { type RootState } from "@/redux/store";

const Navbar = ({ onOpenReadMe }: { onOpenReadMe?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { isNewWebpage, versionUpdated, version } = useSelector(
    (state: RootState) => state.content
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const store = useStore();

  const getErrorMessage = useCallback((error: any): string => {
    if (error instanceof ApiErrorClass) {
      if (error.message) {
        return error.message;
      }
      return error.statusCode === 408
        ? "Request timeout. Not successful - Retry"
        : "Something went wrong - Retry";
    }
    if (error?.code === "ECONNABORTED") {
      return "Request timeout. Not successful - Retry";
    }
    if (typeof error?.message === "string") {
      return error.message;
    }
    return "Not successful - Retry";
  }, []);

  const getButtonText = (): string => {
    if (loading) {
      return isNewWebpage ? "Publishing..." : "Updating...";
    }
    return isNewWebpage ? "Publish" : "Update";
  };

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
        domain: contentData.domain ?? "",
      };

      const url = isNewWebpage ? "/webcontent/publish" : "/webcontent/update";
      const response: any = await apiClient.post(url, publishData);
      console.log('[Navbar] API Response:', response);
      console.log('[Navbar] Response status:', response.status);

      // Check if we have a successful response (API client returns data directly)
      if (response && (response.message || response.data)) {
        console.log('[Navbar] Success condition met, updating versionUpdated to false');
        const message =
          response.data?.message ||
          response.message ||
          "Operation completed successfully";
        toast.success(message, { duration: 6000 });
        
        // Update versionUpdated to false after successful publish/update
        console.log('[Navbar] Dispatching setVersionUpdatedFalse');
        dispatch(setVersionUpdatedFalse());
      } else {
        console.log('[Navbar] Success condition NOT met, response:', response);
      }
      dispatch(setIsNewWebpage(false));
    } catch (error: any) {
      console.error("Publish error:", error);
      if (error instanceof ApiErrorClass && error.statusCode === 401) {
        router.replace("/login");
        return;
      }
      toast.error(getErrorMessage(error), { duration: 5000 });
    } finally {
      setLoading(false);
    }
  }, [loading, dispatch, router, store, isNewWebpage, getErrorMessage]);

  return (
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

          {/* Version Update Message */}
          {versionUpdated && (
            <div className="flex items-center px-3 h-8 text-xs text-gray-600 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              TEMPLATE IS UPDATED TO VERSION {version.toFixed(1)}, PLEASE UPDATE
              YOUR SITE
            </div>
          )}

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
            {getButtonText()}
            {loading && <Loader2 className="animate-spin size-5 ml-1" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
