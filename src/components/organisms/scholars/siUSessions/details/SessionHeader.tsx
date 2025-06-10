import { Session } from "@/types/session";
import { useRouter } from "next/navigation";

interface SessionHeaderProps {
  title: string;
  description: string;
  community?: Session["community"];
}

export default function SessionHeader({
  title,
  community,
}: SessionHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <span
        onClick={() => router.back()}
        className="text-black hover:underline text-sm cursor-pointer"
      >
        ← Back
      </span>
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
