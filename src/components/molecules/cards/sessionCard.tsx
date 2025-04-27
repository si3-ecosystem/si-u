import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { AttendEventDropdown } from "../dropdowns/attendEventDropdown";
import { GuidesSession } from "@/types/siherguides/session";
import { urlForImage } from "@/lib/sanity/image";
import moment from "moment";

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
                className="text-white border border-black max-lg:w-full max-lg:text-center bg-black  font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2"
              >
                Attend Event
              </button>

              {openDropdownId === session._id && (
                <AttendEventDropdown onClose={() => setOpenDropdownId(null)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
