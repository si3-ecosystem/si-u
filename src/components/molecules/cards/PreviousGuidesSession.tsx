import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { urlForImage } from "@/lib/sanity/image";
import { GuidesSession } from "@/types/siherguides/session";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export function PreviousGuidesSessionCard({
  session,
}: {
  session: GuidesSession;
}) {
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

  return (
    <>
      <Card className="bg-white p-3 rounded-lg  w-full h-full">
        <div className="relative mb-4 rounded-lg overflow-hidden ">
          <Image
            src={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              urlForImage(session?.backgroundImage)?.src ||
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

          {session.category && (
            <Badge className="absolute top-2 left-2 text-xs text-black font-normal capitalize ">
              {session.category.title}
            </Badge>
          )}
        </div>
        <div className="px-3 pb-3 flex flex-col justify-between">
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-black mb-2">
              {session.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              {session.description}
            </p>
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
                <div className="flex items-center gap-1 mt-1">
                  {partnerLogos.length > 0 ? (
                    partnerLogos.map((logo, index) => (
                      <Image
                        key={index}
                        src={logo.src || "/card_placeholder.png"}
                        alt={logo.alt}
                        width={80}
                        height={24}
                        className="h-[24px] w-auto object-contain"
                        title={logo.name}
                      />
                    ))
                  ) : (
                    <Image
                      src="/card_placeholder.png"
                      alt="Partner"
                      width={80}
                      height={24}
                      className="h-[24px] w-auto object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <Link href={`/guides/sessions/${session._id}`}>
            <button className="w-full py-2 mt-8 text-center border border-gray-300 rounded-md text-sm font-medium hover:bg-black hover:text-white transition-colors">
              Watch Replay
            </button>
          </Link>
        </div>
      </Card>
    </>
  );
}
