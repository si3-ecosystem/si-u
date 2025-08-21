export default function Loading() {
  return (
    <div className="w-full bg-white min-h-[calc(100vh-9rem)] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading settings...</p>
      </div>
    </div>
  );
}
