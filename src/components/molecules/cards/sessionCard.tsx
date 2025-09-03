import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { AttendEventDropdown } from "../dropdowns/attendEventDropdown";
import { GuidesSession } from "@/types/siherguides/session";
import { urlForImage } from "@/lib/sanity/image";
import moment from "moment";
import { useRSVP } from "@/hooks/useRSVP";
import { useCalendarIntegration } from "@/hooks/useCalendarIntegration";
import { RSVPStatus } from "@/types/rsvp";
import { ErrorHandler } from "@/utils/errorHandler";
import { Badge } from "@/components/ui/badge";

interface SessionCardProps {
  session: GuidesSession;
  openDropdownId: string | null;
  toggleDropdown: (id: string) => void;
  setOpenDropdownId: (id: string | null) => void;
}

export function SessionCard({
  session,
  openDropdownId,
  toggleDropdown,
  setOpenDropdownId,
}: SessionCardProps) {
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

  // RSVP functionality - always use the hook to get proper config
  const rsvpHookResult = useRSVP(session._id, session);
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
  } = rsvpHookResult;

  // Calendar integration
  const { addToGoogleCalendar, addToAppleCalendar, downloadICSFile } =
    useCalendarIntegration(session);

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
    // Try new location virtual link first, then fall back to legacy rsvpChannelLink
    const channelLink =
      session.location?.virtualLink || session.rsvpChannelLink;

    if (channelLink) {
      window.open(channelLink, "_blank");
    } else {
      ErrorHandler.showInfo("Channel link not available");
    }
  };

  const getButtonText = () => {
    // Always show appropriate text regardless of external RSVP
    if (!config.isRSVPEnabled) return;
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

  return (
    <Card className="p-4 w-full">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="relative w-full md:w-[227.995px] flex-shrink-0">
          {session.category && (
            <Badge className="absolute top-2 left-2 text-xs text-black font-normal capitalize ">
              {session.category.title}
            </Badge>
          )}
          <div className="absolute bottom-2 bg-white text-xs px-2 py-1 rounded-full z-10 right-2">
            {session.language}
          </div>
          <Image
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            src={urlForImage(session?.backgroundImage)?.src}
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
            <div className="flex items-center gap-1 text-xs leading-5">
              <Clock className="w-5 h-5" />
              <span>
                {moment(session.date).utc().format("HH:mm")} -{" "}
                {moment(session.endDate).utc().format("HH:mm")} UTC
              </span>
            </div>
          </div>
          <p className="text-sm line-clamp-2">{session?.description}</p>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-14">
              <div>
                <div className="text-xs text-[#333333]">Guided by:</div>
                <div className="font-medium text-sm text-black">
                  {session.guideName}
                </div>
              </div>

              <div className="">
                <div className="text-xs text-[#333333]">
                  In partnership with
                </div>
                <div className="flex items-center gap-2 mt-1 h-8">
                  {partnerLogos.length > 0 ? (
                    partnerLogos.map((logo, index) => (
                      <Image
                        key={index}
                        src={logo.src || "/uniswap.png"}
                        alt={logo.alt}
                        width={105}
                        height={30}
                        className="h-full w-auto object-contain"
                        title={logo.name}
                      />
                    ))
                  ) : (
                    <Image
                      src="/uniswap.png"
                      alt="Partner"
                      width={105}
                      height={30}
                      className="h-full w-auto object-contain"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 relative max-lg:w-full">
              {config.isRSVPEnabled===true && (
                <button
                  onClick={() => {
                    // Always use dropdown functionality regardless of external RSVP
                    toggleDropdown(session._id);
                  }}
                  className={getButtonStyle()}
                  disabled={
                    !config.isRSVPEnabled ||
                    config.isDeadlinePassed ||
                    !config.hasValidEmail
                  }
                >
                  {getButtonText()}
                </button>
              )}

              {openDropdownId === session._id && (
                <AttendEventDropdown
                  rsvpLink={session?.guidesRsvp}
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
    </Card>
  );
}
