import { Card } from "@/components/ui/card";
import Image from "next/image";

export interface Session {
  title: string;
  description: string;
  date: string;
  featured: boolean;
}

export function PreviousSessionCard({ session }: { session: Session }) {
  return (
    <>
      <Card className="bg-white p-3 rounded-lg shadow-md overflow-hidden sm:max-w-[286px] sm:w-full">
        <div className="relative mb-4 rounded-lg overflow-hidden">
          <Image
            src="/guides/previoussession.png"
            alt={session.title}
            width={320}
            height={180}
            className="w-full h-44 object-cover"
          />
        </div>
        <div className="px-3 pb-3">
          <h3 className="text-base font-medium text-black mb-2">
            {session.title}
          </h3>
          <p className="text-gray-600 text-sm">{session.description}</p>
          <p className="text-gray-500 text-xs ">{session.date}</p>

          <button className="w-full py-2 mt-4 text-center border border-gray-300 rounded-md text-sm font-medium hover:bg-black hover:text-white transition-colors">
            Watch Now
          </button>
        </div>
      </Card>
    </>
  );
}
