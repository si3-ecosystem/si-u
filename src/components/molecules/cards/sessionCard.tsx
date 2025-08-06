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
  const partnersImage =
    session?.partner?.logo && urlForImage(session?.partner?.logo)?.src;

  // RSVP functionality
  const { rsvp, rsvpStatus, createRSVP, updateRSVP, deleteRSVP, isCreating, isUpdating, isDeleting, config } = useRSVP(session._id, session);

  // Calendar integration
  const { addToGoogleCalendar, addToAppleCalendar, downloadICSFile } = useCalendarIntegration(session);

  const handleCancelAttendance = () => {
    if (rsvpStatus) {
      deleteRSVP();
    }
  };

  const handleDirectRSVP = () => {
    // Directly create RSVP with attending status
    if (rsvp && rsvp._id && rsvp._id !== 'temp-id') {
      // Update existing RSVP to attending
      updateRSVP({ status: RSVPStatus.ATTENDING });
    } else {
      // Create new RSVP with attending status - no dietary restrictions
      createRSVP({
        eventId: session._id,
        status: RSVPStatus.ATTENDING,
        guestCount: 1
      });
    }
  };

  const handleCalendarAdd = (type: 'google' | 'apple' | 'ics') => {
    switch (type) {
      case 'google':
        addToGoogleCalendar();
        break;
      case 'apple':
        addToAppleCalendar();
        break;
      case 'ics':
        downloadICSFile();
        break;
      default:
        ErrorHandler.showInfo(`Calendar type ${type} not supported`);
    }
  };

  const handleJoinChannel = () => {
    // Try new location virtual link first, then fall back to legacy rsvpChannelLink
    const channelLink = session.location?.virtualLink || session.rsvpChannelLink;

    if (channelLink) {
      window.open(channelLink, '_blank');
    } else {
      ErrorHandler.showInfo('Channel link not available');
    }
  };



  const getButtonText = () => {
    if (!config.isRSVPEnabled) return 'RSVP Disabled';
    if (config.isDeadlinePassed) return 'RSVP Closed';
    if (!config.hasValidEmail) return 'Update Email to RSVP';
    if (isCreating || isUpdating || isDeleting) return 'Updating...';

    switch (rsvpStatus) {
      case RSVPStatus.ATTENDING:
        return config.requiresApproval ? 'Pending Approval' : 'Attending';
      case RSVPStatus.MAYBE:
        return 'Maybe';
      case RSVPStatus.NOT_ATTENDING:
        return 'Not Attending';
      case RSVPStatus.WAITLISTED:
        return 'Waitlisted';
      default:
        return 'Attend Event';
    }
  };

  const getButtonStyle = () => {
    const baseStyle = "text-white border font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 max-lg:w-full max-lg:text-center";

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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-[227.995px] h-[156.606px] flex-shrink-0">
          <div className="absolute bottom-2 bg-white text-xs px-2 py-1 rounded-full z-10 right-2">
            {session.language}
          </div>
          <Image
            src="/card_placeholder.png"
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
              <span>{session.time}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 h-full pb-8">
            <div className="flex items-center gap-14">
              <div>
                <div className="text-xs text-[#333333]">Guided by:</div>
                <div className="font-medium text-sm text-black">
                  {session.guideName}
                </div>
              </div>

              <div className="mt-2 md:mt-0">
                <div className="text-xs text-[#333333]">
                  In partnership with
                </div>
                <div className="h-8 mt-1">
                  <Image
                    src={partnersImage || "/uniswap.png"}
                    alt={session.partner?.title || ""}
                    width={105}
                    height={30}
                    className="h-full w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 relative max-lg:w-full">
              <button
                onClick={() => toggleDropdown(session._id)}
                className={getButtonStyle()}
                disabled={isCreating || isUpdating || isDeleting || !config.isRSVPEnabled || config.isDeadlinePassed || !config.hasValidEmail}
              >
                {getButtonText()}
              </button>

              {openDropdownId === session._id && (
                <AttendEventDropdown
                  onClose={() => setOpenDropdownId(null)}
                  eventId={session._id}
                  currentStatus={rsvpStatus}
                  hasValidEmail={config.hasValidEmail}
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
