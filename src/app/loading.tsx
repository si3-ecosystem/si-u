"use client";

import { Blocks } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-950">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full transform scale-150 animate-pulse"></div>

        <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-5 rounded-full relative z-10 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="animate-spin">
            <Blocks className="h-10 w-10 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
