"use client";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface SessionProps {
  day: number;
  month: string;
  title: string;
  date: string;
  time: string;
  isLive?: boolean;
}

function SessionCard({ day, month, title, date, time, isLive }: SessionProps) {
  return (
    <div className="mb-4 flex flex-col md:flex-row gap-4">
      <div className="flex items-start justify-between max-md:w-full">
        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-black text-white">
          <span className="text-lg font-bold">{day}</span>
          <span className="text-xs">{month}</span>
        </div>
        <div className="flex items-center justify-between md:hidden">
          <h4 className="font-medium max-md:hidden">{title}</h4>
          {isLive && (
            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
              • Live
            </span>
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between max-md:hidden">
          <h4 className="font-medium max-md:hidden">{title}</h4>
          {isLive && (
            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
              • Live
            </span>
          )}
        </div>
        <h4 className="font-medium md:hidden">{title}</h4>
        <div className="mt-1 flex items-center gap-4 text-md text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UpcomingSessionsProps {
  sessions: SessionProps[];
  onExplore?: () => void;
}

export function UpcomingSessions({
  sessions,
  onExplore,
}: UpcomingSessionsProps) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
        <Link
          href="#"
          className="text-md font-medium text-purple-500 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            onExplore?.();
          }}
        >
          Explore Sessions
        </Link>
      </div>
      <div>
        {sessions.map((session, index) => (
          <SessionCard
            key={index}
            day={session.day}
            month={session.month}
            title={session.title}
            date={session.date}
            time={session.time}
            isLive={session.isLive}
          />
        ))}
      </div>
    </div>
  );
}
