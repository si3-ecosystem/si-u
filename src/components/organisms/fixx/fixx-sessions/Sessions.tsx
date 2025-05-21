/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";
import Loading from "@/app/loading";
import { PreviousSessionCard } from "@/components/molecules/cards/previousSessionCard";
import { useFixSessions } from "@/hooks/useFixSessions";
import React from "react";

interface SessionCard {
  _id: string;
  title?: string;
  description?: string;
  date?: string;
  pdfFile?: string;
  banner?: string;
  sessionTitle?: string;
  sessionDescription?: string;
}

export function Sessions() {
  const { loading, sessions } = useFixSessions();

  if (loading) return <Loading />;

  return (
    <div className="w-full py-11">
      <h1 className="text-2xl font-medium mb-1 text-black">{sessions.title}</h1>
      <p className="text-[#454545] mb-6 leading-[140%]">
        {sessions.description}
      </p>

      <div className="mt-6">
        <div className="grid grid-cols-1 @[768px]/layout:grid-cols-2 @[1548px]/layout:grid-cols-3 gap-6">
          {sessions.length === 0 ? (
            <div className="text-gray-400">No sessions found.</div>
          ) : (
            sessions.map((session: SessionCard) => (
              <PreviousSessionCard
                key={session._id}
                session={{
                  pdfFile: session.pdfFile,
                  ...session,
                  description:
                    session.sessionDescription || session.description || "",
                  date: session.date || "",
                  title: session.title || "",
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
