"use client";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";

type ChartItem = {
  label: string;
  percent: number;
};

type DiversitySummary = {
  totalResponses: number;
  selfIdentity: ChartItem[];
  ageRange: ChartItem[];
  sexualOrientation: ChartItem[];
  inclusivityScore: string;
  averageRating: string;
  message?: string;
};

const colorMap = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-cyan-400",
  "bg-pink-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-red-400",
];

function BarGroup({ items }: { items: ChartItem[] }) {
  if (!items) return;
  return (
    <div className="flex h-6 rounded overflow-hidden">
      {items?.map((item, idx) =>
        item.percent > 0 ? (
          <div
            key={item.label}
            className={`${colorMap[idx % colorMap.length]} h-full`}
            style={{ width: `${item.percent}%` }}
            title={`${item.label}: ${item.percent}%`}
          />
        ) : null
      )}
    </div>
  );
}

function Legend({ items }: { items: ChartItem[] }) {
  if (!items) return;
  return (
    <div className="flex flex-wrap gap-4 text-xs mt-2">
      {items?.map((item, idx) => (
        <div key={item.label} className="flex items-center gap-1">
          <span
            className={`inline-block w-3 h-3 rounded ${
              colorMap[idx % colorMap.length]
            }`}
          ></span>
          <span>
            {item.label}: {item.percent}%
          </span>
        </div>
      ))}
    </div>
  );
}

export function DiversityTrackerChart() {
  const { data, isLoading } = useQuery<DiversitySummary>({
    queryKey: ["diversityTrackerSummary"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/diversity-tracker/summary`
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  console.log("data", data);

  if (isLoading || !data) return <div>Loading chart...</div>;
  if (data.totalResponses === 0) return <div>No responses yet.</div>;

  return (
    <div className="w-full  mx-auto bg-white p-6 rounded-lg  flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <span className="font-medium text-lg">Total Responses</span>
        <span className="text-2xl font-bold">{data.totalResponses}</span>
      </div>

      {/* Self Identity */}
      <div>
        <div className="font-semibold mb-1">Self Identity</div>
        <div className="flex flex-col gap-4">
          <Legend items={data.selfIdentity} />
          <BarGroup items={data.selfIdentity} />
        </div>
      </div>

      {/* Age Range */}
      <div>
        <div className="font-semibold mb-1">Age Range</div>
        <div className="flex flex-col gap-4">
          <Legend items={data.ageRange} />
          <BarGroup items={data.ageRange} />
        </div>
      </div>

      {/* Sexual Orientation */}
      <div className="flex flex-col">
        <div className="font-semibold mb-1">Sexual Orientation</div>
        <div className="flex flex-col gap-4">
          <Legend items={data.sexualOrientation} />
          <BarGroup items={data.sexualOrientation} />
        </div>
      </div>

      {/* Scores */}
      <div className="flex flex-col  gap-2 mt-4">
        <div>
          <span className="font-semibold">Inclusivity Score (1–10): </span>
          {data.inclusivityScore}
        </div>
        <div>
          <span className="font-semibold">Average Rating: </span>
          {data.averageRating}
        </div>
      </div>
    </div>
  );
}
