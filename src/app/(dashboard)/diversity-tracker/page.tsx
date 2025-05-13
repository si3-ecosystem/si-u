"use client";

import Loading from "@/app/loading";
import { DiversityTrackerBanner } from "@/components/molecules/banners/DiversityTrackerBanner";
import { DiversityTrackerChart } from "@/components/molecules/charts/DiversityTrackerChart";
import { DiversityTrackerForm } from "@/components/molecules/forms/DiversityTrackerForm";
import { getDiversityTrackerData } from "@/lib/sanity/client";
import { cn } from "@/lib/utils";
import { DiversityTracker as DiversityTrackerTypes } from "@/types/diversityTracker";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function DiversityTrackerPage() {
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("diversityTrackerChartShown");
      if (stored === "true") {
        setShowChart(true);
      }
    }
  }, []);

  useEffect(() => {
    if (showChart && typeof window !== "undefined") {
      localStorage.setItem("diversityTrackerChartShown", "true");
    }
  }, [showChart]);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<DiversityTrackerTypes>({
    queryKey: ["getDiversityTracker"],
    queryFn: getDiversityTrackerData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (showChart) {
      queryClient.invalidateQueries({
        queryKey: ["diversityTrackerSummary"],
      });
    }
  }, [queryClient, showChart]);

  if (isLoading) return <Loading />;
  if (!data) return <div>No data found</div>;

  return (
    <section className="layout flex flex-col gap-7 w-full">
      <DiversityTrackerBanner data={data} />
      <div className="bg-white w-full p-4 lg:p-10 rounded-lg flex flex-col gap-2 ">
        {!showChart && (
          <h1 className="text-sm font-medium text-brand text-center">
            {data.description}
          </h1>
        )}
        {!showChart && (
          <p className="text-black font-medium text-2xl text-center">
            {data.title}
          </p>
        )}
        <div className={cn(showChart ? "mt-8" : "mt-16")}>
          {!showChart ? (
            <DiversityTrackerForm onSuccess={() => setShowChart(true)} />
          ) : (
            <DiversityTrackerChart />
          )}
        </div>
      </div>
    </section>
  );
}
