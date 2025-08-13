import { Card } from "@/components/ui/card";
import { urlForImage } from "@/lib/sanity/image";
import { GuidesSession } from "@/types/siherguides/session";
import moment from "moment";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react";
import Link from "next/link";

export function PreviousSessionCard({ session }: { session: GuidesSession }) {
  return (
    <>
      <Card className="bg-white p-3 rounded-lg  overflow-hidden  sm:w-full">
        <div className="relative mb-4 rounded-lg overflow-hidden">
          <div className="relative w-full h-44 bg-gray-100">
            {session.fixImage && (
              <Image
                src={urlForImage(session.fixImage)?.src || ""}
                alt={session.title}
                width={320}
                height={180}
                className="w-full h-44 object-cover"
              />
            )}
          </div>
        </div>
        <div className="px-3 pb-3">
          <h3 className="text-base font-medium text-black mb-2">
            {session.title}
          </h3>
          <p className="text-gray-600 text-sm">{session.description}</p>
          <p className="text-gray-500 text-xs ">
            {moment(session.date).format("YYYY-MM-DD")}
          </p>

          <div className="flex items-center justify-between w-full gap-4 mt-4">
            <div className="flex flex-col">
              <p className="text-xs">Guided by:</p>
              <p className="text-sm">{session.guideName}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs">In partnership with:</p>
              {session?.partner && (
                <div>
                  <Image
                    src={
                      urlForImage(session?.partner?.logo)?.src ||
                      "/card_placeholder.png"
                    }
                    alt={session.partner?.title || ""}
                    width={320}
                    height={180}
                    className="w-full h-[30px] object-contain"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {session.pdfFile?.asset?.url && (
              <a
                href={session.pdfFile.asset.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex-1"
              >
                <Button
                  className="w-full h-11 bg-black text-white rounded-lg"
                  variant="outline"
                >
                  <ArrowDownToLine className="mr-2 h-4 w-4" /> PDF Guide
                </Button>
              </a>
            )}
            <Link
              href={`/grow3dge/grow3dge-sessions/${session._id}`}
              className="flex-1"
            >
              <Button className="w-full h-11 bg-primary text-white rounded-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
}
