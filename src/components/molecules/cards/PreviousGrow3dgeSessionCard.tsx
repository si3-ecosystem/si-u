import { Card } from "@/components/ui/card";
import { urlForImage } from "@/lib/sanity/image";
import { FixCard } from "@/types/siherguides/session";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, Play } from "lucide-react";
import { ErrorHandler } from "@/utils/errorHandler";
import { Badge } from "@/components/ui/badge";

export function PreviousGrow3dgeSessionCard({ session }: { session: FixCard }) {
  // Handle both multiple partners and legacy single partner
  const getPartnerLogos = () => {
    if (session?.partners && session.partners.length > 0) {
      return session.partners.map((partner) => ({
        src: urlForImage(partner.logo)?.src,
        alt: partner.name || partner.title || "",
        name: partner.name || partner.title || "",
      }));
    } else if (session?.partner) {
      return [
        {
          src: urlForImage(session.partner.logo)?.src,
          alt: session.partner.title || "",
          name: session.partner.title || "",
        },
      ];
    }
    return [];
  };

  const partnerLogos = getPartnerLogos();

  const handleDownloadMaterials = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Handle course materials download
    if (session.pdfGuide?.enabled) {
      if (
        session.pdfGuide.type === "download" &&
        session.pdfGuide.downloadFile?.asset?.url
      ) {
        // Download PDF file
        const link = document.createElement("a");
        link.href = session.pdfGuide.downloadFile.asset.url;
        link.target = "_blank";
        link.download = session.pdfGuide.title || "course-materials.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (
        session.pdfGuide.type === "url" &&
        session.pdfGuide.shareableUrl
      ) {
        // Open shareable URL
        window.open(session.pdfGuide.shareableUrl, "_blank");
      } else {
        ErrorHandler.showInfo("Course materials configuration incomplete");
      }
    } else if (session.pdfFile?.asset?.url) {
      // Fallback to legacy pdfFile
      const link = document.createElement("a");
      link.href = session.pdfFile.asset.url;
      link.target = "_blank";
      link.download = "course-materials.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      ErrorHandler.showInfo("Course materials not available");
    }
  };

  const hasCourseMatials =
    session.pdfGuide?.enabled || session.pdfFile?.asset?.url;
  const hasVideo = session.videoUrl;
  const hasUlr = session?.pdfGuide?.shareableUrl;

  return (
    <>
      <Card className="bg-white p-3 rounded-lg w-full h-full">
        <div className="relative mb-4 rounded-lg overflow-hidden">
          {session.category && (
            <Badge className="absolute top-2 left-2 text-xs text-black font-normal capitalize ">
              {session.category.title}
            </Badge>
          )}
          {session.language && (
            <div className="absolute bottom-2 bg-white text-xs px-2 py-1 rounded-full z-10 right-2">
              {session.language}
            </div>
          )}
          <Image
            src={
              (session?.fixImage ? urlForImage(session.fixImage)?.src : null) ||
              (session?.backgroundImage
                ? urlForImage(session.backgroundImage)?.src
                : null) ||
              "/card_placeholder.png"
            }
            alt={session.title}
            width={320}
            loading="lazy"
            decoding="async"
            title={session.title}
            height={180}
            className="w-full h-44 object-cover object-center rounded-lg"
          />
        </div>

        <div className="px-3 pb-3 flex flex-col justify-between">
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-black mb-2">
              {session.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              {session.description}
            </p>
            <p className="text-gray-500 text-xs">
              {moment(session.date).format("YYYY-MM-DD")}
            </p>

            <div className="flex items-center justify-between w-full gap-4 mt-4">
              {session.guideName && (
                <div className="flex flex-col">
                  <p className="text-xs">Guided by:</p>
                  <p className="text-sm">{session.guideName}</p>
                </div>
              )}

              {partnerLogos.length > 0 && (
                <div className="flex flex-col">
                  <p className="text-xs">In partnership with:</p>
                  <div className="flex items-center gap-1 mt-1">
                    {partnerLogos.map((logo, index) => (
                      <Image
                        key={index}
                        src={logo.src || "/card_placeholder.png"}
                        alt={logo.alt}
                        width={80}
                        height={24}
                        className="h-[24px] w-auto object-contain"
                        title={logo.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            {hasCourseMatials && (
              <button
                onClick={handleDownloadMaterials}
                className="w-full py-2 text-center border border-gray-300 rounded-md text-sm font-medium hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                {hasUlr ? (
                  <ExternalLink className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {session.pdfGuide?.title || "Download Materials"}
              </button>
            )}

            {hasVideo ? (
              <Link href={`/grow3dge/grow3dge-sessions/${session._id}`}>
                <button className="w-full py-2 text-center border border-gray-300 rounded-md text-sm font-medium hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Watch Replay
                </button>
              </Link>
            ) : (
              <Link href={`/grow3dge/grow3dge-sessions/${session._id}`}>
                <button className="w-full py-2 text-center border border-gray-300 rounded-md text-sm font-medium hover:bg-black hover:text-white transition-colors">
                  View Session
                </button>
              </Link>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
