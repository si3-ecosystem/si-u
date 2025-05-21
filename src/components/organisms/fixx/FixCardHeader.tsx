import { format } from "date-fns";
import Link from "next/link";

interface FixCardHeaderProps {
  title: string;
  description: string;
  date?: string;
  time?: string;
  language?: string;
  guideName?: string;
}

export function FixCardHeader({
  title,
  description,
  date,
  time,
  language,
  guideName,
}: FixCardHeaderProps) {
  return (
    <div className="mb-6">
      <Link
        href="/fixx/fixx-sessions"
        className="text-black hover:underline text-sm"
      >
        ← Back
      </Link>
      <h1 className="text-[32px] font-medium text-black mt-4">{title}</h1>
      <p className="text-gray-600 mt-2">{description}</p>
      
      {guideName && (
        <p className="text-gray-600">Guide: {guideName}</p>
      )}
      
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
        {date && (
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>{format(new Date(date), "PPP")}</span>
          </div>
        )}
        {time && (
          <div className="flex items-center gap-1">
            <span>⏰</span>
            <span>{time}</span>
          </div>
        )}
        {language && (
          <div className="flex items-center gap-1">
            <span>🌐</span>
            <span>{language}</span>
          </div>
        )}
      </div>
    </div>
  );
}
