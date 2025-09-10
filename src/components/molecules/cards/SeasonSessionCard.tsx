import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDownToLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  language: string;
  image?: string;
  guide: string;
  pdfFile?: {
    asset: {
      url: string;
    };
  };
  videoUrl?: string;
  partner: {
    name: string;
    logo: string | null;
  };
}

interface SessionCardProps {
  session: Session;
  openDropdownId?: string | null;
  toggleDropdown?: (id: string) => void;
  setOpenDropdownId?: (id: string | null) => void;
}

export function SeasonSessionCard({ session }: SessionCardProps) {
  return (
    <Card className="p-4 w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-[227.995px] h-[156.606px] flex-shrink-0">
          <Image
            src={session.image || "/card_placeholder.png"}
            alt={session.title}
            width={160}
            loading="lazy"
            decoding="async"
            height={160}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 ">
          <div className="flex items-center justify-between w-full gap-4">
            <h3 className="text-xl font-medium mb-10">{session.title}</h3>
            <div className="flex gap-2">
              {session?.pdfFile?.asset?.url && (
                <a
                  href={session?.pdfFile?.asset?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-block"
                >
                  <Button
                    className="h-11 bg-black text-white rounded-lg"
                    variant="outline"
                  >
                    <ArrowDownToLine className="mr-2" /> Download PDF Guide
                  </Button>
                </a>
              )}
              <Link href={`/fixx/fixx-sessions/${session.id}`}>
                <Button
                  className="h-11 bg-primary text-white rounded-lg"
                  variant="default"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-14">
            <div>
              <div className="text-xs text-[#333333]">Guided by:</div>
              <div className="font-medium text-sm text-black">
                {session.guide}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
