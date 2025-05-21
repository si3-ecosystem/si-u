interface FixCardVideoPlayerProps {
  videoUrl?: string;
  thumbnail?: {
    asset?: {
      url?: string;
    };
  };
}

export function FixCardVideoPlayer({ videoUrl, thumbnail }: FixCardVideoPlayerProps) {
  return (
    <div className="mb-8 bg-gray-50 rounded-lg overflow-hidden">
      {videoUrl ? (
        <div className="relative aspect-video bg-black">
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            poster={thumbnail?.asset?.url}
            controls
          />
        </div>
      ) : (
        <div className="aspect-video bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No video available</span>
        </div>
      )}
    </div>
  );
}
