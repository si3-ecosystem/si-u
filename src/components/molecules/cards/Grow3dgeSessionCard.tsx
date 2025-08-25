import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Download } from "lucide-react";
import Image from "next/image";
import { AttendEventDropdown } from "../dropdowns/attendEventDropdown";
import { FixCard } from "@/types/siherguides/session";
import { urlForImage } from "@/lib/sanity/image";
import moment from "moment";
import { useRSVP } from "@/hooks/useRSVP";
import { useCalendarIntegration } from "@/hooks/useCalendarIntegration";
import { RSVPStatus } from "@/types/rsvp";
import { ErrorHandler } from "@/utils/errorHandler";
import { Badge } from "@/components/ui/badge";

interface Grow3dgeSessionCardProps {
  session: FixCard;
  openDropdownId: string | null;
  toggleDropdown: (id: string) => void;
  setOpenDropdownId: (id: string | null) => void;
}

export function Grow3dgeSessionCard({
  session,
  openDropdownId,
  toggleDropdown,
  setOpenDropdownId,
}: Grow3dgeSessionCardProps) {
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

  // RSVP functionality - cast session to compatible type
  const sessionForRSVP = {
    ...session,
    guideName: session.guideName || "Unknown Guide",
  } as any;

  const {
    rsvp,
    rsvpStatus,
    hasRSVP,
    createRSVP,
    updateRSVP,
    deleteRSVP,
    isCreating,
    isUpdating,
    isDeleting,
    config,
  } = useRSVP(session._id, sessionForRSVP);

  // Calendar integration
  const { addToGoogleCalendar, addToAppleCalendar, downloadICSFile } =
    useCalendarIntegration(sessionForRSVP);

  const handleCancelAttendance = () => {
    deleteRSVP();
  };

  const handleDirectRSVP = () => {
    // Directly create RSVP with attending status
    if (rsvp && rsvp._id && rsvp._id !== "temp-id") {
      // Update existing RSVP to attending
      updateRSVP({ status: RSVPStatus.ATTENDING });
    } else {
      // Create new RSVP with attending status - no dietary restrictions
      createRSVP({
        eventId: session._id,
        status: RSVPStatus.ATTENDING,
        guestCount: 1,
      });
    }
  };

  const handleCalendarAdd = (type: "google" | "apple" | "ics") => {
    switch (type) {
      case "google":
        addToGoogleCalendar();
        break;
      case "apple":
        addToAppleCalendar();
        break;
      case "ics":
        downloadICSFile();
        break;
      default:
        ErrorHandler.showInfo(`Calendar type ${type} not supported`);
    }
  };

  const handleJoinChannel = () => {
    // Use rsvpChannelLink for channel joining
    if (session.rsvpChannelLink) {
      window.open(session.rsvpChannelLink, "_blank");
    } else {
      ErrorHandler.showInfo("Channel link not available");
    }
  };

  const handleDownloadMaterials = () => {
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

  const getButtonText = () => {
    if (!config.isRSVPEnabled) return "RSVP Disabled";
    if (config.isDeadlinePassed) return "RSVP Closed";
    if (!config.hasValidEmail) return "Update Email to RSVP";
    if (isCreating || isUpdating || isDeleting) return "Updating...";

    switch (rsvpStatus) {
      case RSVPStatus.ATTENDING:
        return config.requiresApproval ? "Pending Approval" : "Attending";
      case RSVPStatus.MAYBE:
        return "Maybe";
      case RSVPStatus.NOT_ATTENDING:
        return "Not Attending";
      case RSVPStatus.WAITLISTED:
        return "Waitlisted";
      default:
        return "Attend Event";
    }
  };

  const getButtonStyle = () => {
    const baseStyle =
      "text-white border font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 max-lg:w-full max-lg:text-center";

    if (!config.isRSVPEnabled || config.isDeadlinePassed) {
      return `${baseStyle} border-gray-400 bg-gray-400 cursor-not-allowed`;
    }

    switch (rsvpStatus) {
      case RSVPStatus.ATTENDING:
        return `${baseStyle} border-green-600 bg-green-600 hover:bg-green-700`;
      case RSVPStatus.MAYBE:
        return `${baseStyle} border-yellow-600 bg-yellow-600 hover:bg-yellow-700`;
      case RSVPStatus.NOT_ATTENDING:
        return `${baseStyle} border-red-600 bg-red-600 hover:bg-red-700`;
      case RSVPStatus.WAITLISTED:
        return `${baseStyle} border-blue-600 bg-blue-600 hover:bg-blue-700`;
      default:
        return `${baseStyle} border-black bg-black hover:bg-gray-800`;
    }
  };

  const hasCourseMatials =
    session.pdfGuide?.enabled || session.pdfFile?.asset?.url;

  return (
    <Card className="p-4 w-full">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="relative w-full md:w-[227.995px] flex-shrink-0">
          {/* {session.language && (
            <div className="absolute bottom-2 bg-white text-xs px-2 py-1 rounded-full z-10 right-2">
              {session.language}
            </div>
          )} */}
          {session.category && (
            <Badge className="absolute top-2 left-2 text-xs text-black font-normal capitalize ">
              {session.category.title}
            </Badge>
          )}
          <Image
            src={
              (session.fixImage ? urlForImage(session.fixImage)?.src : null) ||
              (session.backgroundImage
                ? urlForImage(session.backgroundImage)?.src
                : null) ||
              "/card_placeholder.png"
            }
            alt={session.title}
            width={160}
            height={160}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 ">
          <h3 className="text-xl font-medium mb-2">{session.title}</h3>

          <div className="flex items-center gap-4 mb-4 text-xs text-[#5D5D5D]">
            <div className="flex items-center gap-1 text-xs leading-5">
              <Calendar className="w-5 h-5" />
              <span>{moment(session.date).format("YYYY-MM-DD")}</span>
            </div>
            {session.time && (
              <div className="flex items-center gap-1 text-xs leading-5">
                <Clock className="w-5 h-5" />
                <span>{session.time}</span>
              </div>
            )}
          </div>
          <p className="text-sm line-clamp-2">{session?.description}</p>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-14">
              {session.guideName && (
                <div>
                  <div className="text-xs text-[#333333]">Guided by:</div>
                  <div className="font-medium text-sm text-black">
                    {session.guideName}
                  </div>
                </div>
              )}

              {partnerLogos.length > 0 && (
                <div className="">
                  <div className="text-xs text-[#333333]">
                    In partnership with
                  </div>
                  <div className="flex items-center gap-2 mt-1 h-8">
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

            <div className="flex flex-col md:flex-row gap-2">
              {hasCourseMatials && (
                <button
                  onClick={handleDownloadMaterials}
                  className="border border-blue-600 text-blue-600 font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {session.pdfGuide?.title || "Course Materials"}
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => toggleDropdown(session._id)}
                  disabled={
                    !config.isRSVPEnabled ||
                    config.isDeadlinePassed ||
                    isCreating ||
                    isUpdating ||
                    isDeleting
                  }
                  className={getButtonStyle()}
                >
                  {getButtonText()}
                </button>

                {openDropdownId === session._id && (
                  <AttendEventDropdown
                    onClose={() => setOpenDropdownId(null)}
                    eventId={session._id}
                    currentStatus={rsvpStatus}
                    hasRSVP={hasRSVP}
                    hasValidEmail={config.hasValidEmail}
                    isDeleting={isDeleting}
                    onCalendarAdd={handleCalendarAdd}
                    onJoinChannel={handleJoinChannel}
                    onCancelAttendance={handleCancelAttendance}
                    onOpenRSVPForm={handleDirectRSVP}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
