import Link from "next/link";
import { Session } from "@/types/session";

interface SessionHeaderProps {
  title: string;
  description: string;
  community: Session["community"];
}

export default function SessionHeader({
  title,
  community,
}: SessionHeaderProps) {
  return (
    <div className="mb-6">
      <Link
        href="/scholars/sessions"
        className="text-black hover:underline text-sm"
      >
        ← Back
      </Link>
      <h1 className="text-[32px] font-medium text-black mt-4">{title}</h1>
      {community && (
        <p className="text-gray-600 mt-2">
          Course Guide: {community.communityName}
        </p>
      )}
      <p className="text-gray-600">Co-Founder, Ecosystem Growth at SK3</p>
    </div>
  );
}
