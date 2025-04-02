import {
  ChromeIcon as Google,
  Apple,
  X,
  XCircle,
  ChevronRight,
} from "lucide-react";

interface AttendEventDropdownProps {
  onClose: () => void;
}

export function AttendEventDropdown({ onClose }: AttendEventDropdownProps) {
  return (
    <div className="absolute right-0 top-full mt-2 w-[308px] bg-black text-white rounded-md shadow-lg z-50 overflow-hidden">
      <div className="py-1">
        <button
          onClick={onClose}
          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors"
        >
          <Google className="w-5 h-5" />
          <span>Add to Google Calendar</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>

        <button className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors">
          <Apple className="w-5 h-5" />
          <span>Add to Apple iCal</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>

        <button className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors">
          <X className="w-5 h-5" />
          <span>Join the X Channel</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>

        <button className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors">
          <XCircle className="w-5 h-5" />
          <span>Cancel the Attendance</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>
      </div>
    </div>
  );
}
