interface SessionOverviewProps {
  overview: string;
}

export default function SessionOverview({ overview }: SessionOverviewProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-medium text-black">Overview</h2>
      <p className="text-gray-600 mt-2 text-opacity-80">{overview}</p>
    </div>
  );
}
