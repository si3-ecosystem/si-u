import { Globe, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiClient, ApiErrorClass } from "@/services/api";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setDomain } from "@/redux/slice/contentSlice";
import Link from "next/link";

const Domain = () => {
  const dispatch = useDispatch();
  const existingDomain =
    useSelector((state: RootState) => state.content?.domain) ?? "";
  const [subDomain, setSubDomain] = useState<string>("");
  const [domainLoading, setDomainLoading] = useState<boolean>(false);
  const getDisplayDomain = (value: string): string => {
    if (!value) return "";
    return value.includes(".") ? value : `${value}.siher.eth.link`;
  };

  useEffect(() => {
    if (existingDomain) {
      setSubDomain(existingDomain ?? "");
    }
  }, [existingDomain]);

  const AssignDomain = async () => {
    if (!subDomain) {
      toast.error("Please enter a valid domain name.");
      return;
    }
    if (
      subDomain.includes(".") ||
      subDomain.includes("siher") ||
      subDomain.includes("eth")
    ) {
      toast.error(
        "Please enter only the subdomain name (without .siher.eth.link)"
      );
      return;
    }
    try {
      setDomainLoading(true);
      const response: any = await apiClient.post(`/domain/publish`, {
        domain: subDomain,
      });
      if (response?.message && response?.domain) {
        const fullDomain = response.domain;
        const subdomain = fullDomain.replace(".siher.eth.link", "");
        dispatch(setDomain(subdomain));
        toast.success(response.message);
      } else {
        const errorMessage =
          response?.message ||
          response?.error?.message ||
          "Failed to register domain.";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      if (error instanceof ApiErrorClass) {
        toast.error(error.message || "Failed to register domain.");
      } else if (typeof error?.message === "string") {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setDomainLoading(false);
    }
  };

  return (
    <div className="tracking-wider border-y border-gray-300 text-xs py-1 lg:py-2 px-2">
      <div className="flex justify-center items-center mx-auto">
        {existingDomain ? (
          <div className="flex items-center p-2">
            <p>Web page URL: </p>
            <Link
              href={`https://${getDisplayDomain(existingDomain)}`}
              target="_blank"
              className="ml-2 font-serif text-blue-600 hover:underline underline-offset-2"
            >
              {`https://${getDisplayDomain(existingDomain)}`}
            </Link>
          </div>
        ) : (
          <section className="items-center relative flex border text-gray-500 hover:text-gray-700 border-gray-300 rounded-lg hover:border-gray-500 justify-between w-full lg:w-[30%]">
            <div className="flex justify-center items-center w-full">
              <Globe className="mx-2 size-4" />
              <input
                type="text"
                className="w-full bg-transparent border-none outline-none focus:ring-0"
                placeholder="Enter your domain"
                value={subDomain ?? ""}
                onChange={(e) => setSubDomain(e.target.value)}
              />
            </div>
            {!existingDomain && (
              <p className="mr-4 text-gray-500">.siher.eth</p>
            )}
            <div className="flex justify-center items-center">
              <button
                disabled={domainLoading || !subDomain}
                onClick={AssignDomain}
                className="flex gap-2 sm:gap-4 items-center px-4 h-8 sm:font-medium text-white bg-gray-900 rounded-lg hover:shadow-md whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {domainLoading && <Loader2 className="animate-spin size-4" />}
                {domainLoading ? "Loading..." : "Publish Domain"}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Domain;
