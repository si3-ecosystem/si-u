"use client";

import { DiversityTrackerBanner } from "@/components/molecules/banners/DiversityTrackerBanner";
import { DiversityTrackerForm } from "@/components/molecules/forms/DiversityTrackerForm";
import { getDiversityTrackerData } from "@/lib/sanity/client";
import { DiversityTracker as DiversityTrackerTypes } from "@/types/diversityTracker";
import { useQuery } from "@tanstack/react-query";

export default function DiversityTrackerPage() {
  const { data, isLoading } = useQuery<DiversityTrackerTypes>({
    queryKey: ["getDiversityTracker"],
    queryFn: getDiversityTrackerData,
    refetchOnWindowFocus: false,
  });

  if (isLoading || !data)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  console.log(data);
  return (
    <section className="layout flex flex-col gap-7">
      <DiversityTrackerBanner data={data} />
      <div className="bg-white w-full p-10 rounded-lg flex flex-col gap-2 ">
        <h1 className="text-sm font-medium text-brand text-center">
          {data.description}
        </h1>
        <p className="text-black font-medium text-2xl text-center">
          {data.title}
        </p>
        <div className="mt-16">
          <DiversityTrackerForm />
        </div>
      </div>
    </section>
  );
}
