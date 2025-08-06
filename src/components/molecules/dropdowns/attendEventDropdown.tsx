import {
  ChromeIcon as Google,
  Apple,
  X,
  XCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { RSVPStatus } from "@/types/rsvp";

interface AttendEventDropdownProps {
  onClose: () => void;
  eventId: string;
  currentStatus?: RSVPStatus | null;
  hasRSVP?: boolean;
  hasValidEmail?: boolean;
  isDeleting?: boolean;
  onCalendarAdd?: (type: 'google' | 'apple' | 'ics') => void;
  onJoinChannel?: () => void;
  onCancelAttendance?: () => void;
  onOpenRSVPForm?: () => void;
}

export function AttendEventDropdown({
  onClose,
  eventId,
  currentStatus,
  hasRSVP = false,
  hasValidEmail = true,
  isDeleting = false,
  onCalendarAdd,
  onJoinChannel,
  onCancelAttendance,
  onOpenRSVPForm
}: AttendEventDropdownProps) {

  const handleCalendarClick = (type: 'google' | 'apple' | 'ics') => {
    onCalendarAdd?.(type);
    onClose();
  };

  const handleChannelClick = () => {
    onJoinChannel?.();
    onClose();
  };

  const handleCancelClick = () => {
    onCancelAttendance?.();
    onClose();
  };

  const handleRSVPClick = () => {
    if (!hasValidEmail) {
      // Redirect to profile page to update email
      if (typeof window !== 'undefined') {
        window.location.href = '/profile';
      }
      onClose();
      return;
    }
    onOpenRSVPForm?.();
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-[308px] bg-black text-white rounded-md shadow-lg z-50 overflow-hidden">
      <div className="py-1">
        {/* Add to Google Calendar */}
        <button
          onClick={() => handleCalendarClick('google')}
          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors"
        >
          <Google className="w-5 h-5" />
          <span>Add to Google Calendar</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>

        {/* Add to Apple iCal */}
        <button
          onClick={() => handleCalendarClick('apple')}
          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors"
        >
          <Apple className="w-5 h-5" />
          <span>Add to Apple iCal</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>

        {/* Join the X Channel */}
        <button
          onClick={handleChannelClick}
          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
          <span>Join the X Channel</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>

        {/* Cancel the Attendance - Only show if user has an RSVP */}
        {hasRSVP && (
          <button
            onClick={handleCancelClick}
            disabled={isDeleting}
            className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isDeleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{isDeleting ? 'Cancelling...' : 'Cancel the Attendance'}</span>
            {!isDeleting && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
        )}

        {/* RSVP Option */}
        <button
          onClick={handleRSVPClick}
          className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors border-t border-gray-700 ${
            !hasValidEmail ? 'opacity-75' : ''
          }`}
        >
          <div className={`w-5 h-5 rounded flex items-center justify-center ${
            hasValidEmail ? 'bg-blue-600' : 'bg-amber-600'
          }`}>
            <span className="text-xs font-bold">R</span>
          </div>
          <span>{hasValidEmail ? 'RSVP' : 'Update Email to RSVP'}</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>
      </div>
    </div>
  );
}
