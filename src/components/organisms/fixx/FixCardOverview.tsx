interface FixCardOverviewProps {
  overview?: string;
}

export function FixCardOverview({ overview }: FixCardOverviewProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Overview</h2>
      <div className="prose max-w-none">
        {overview ? (
          <p>{overview}</p>
        ) : (
          <p className="text-gray-500">No overview available.</p>
        )}
      </div>
    </div>
  );
}
