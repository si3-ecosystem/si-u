import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Play } from "lucide-react";

interface FixCardActionsProps {
  pdfUrl?: string;
  videoUrl?: string;
}

export function FixCardActions({ pdfUrl, videoUrl }: FixCardActionsProps) {
  return (
    <div className="flex flex-wrap gap-4 mt-6">
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-block"
        >
          <Button
            className="h-11 bg-black text-white rounded-lg hover:bg-gray-800"
            variant="outline"
          >
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Download PDF Guide
          </Button>
        </a>
      )}
      {videoUrl && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button
            variant="default"
            className="h-11 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Play className="mr-2 h-4 w-4" /> Watch Video
          </Button>
        </a>
      )}
    </div>
  );
}
