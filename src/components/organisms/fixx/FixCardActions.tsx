import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Play, ExternalLink } from "lucide-react";

interface PdfGuideConfig {
  enabled: boolean;
  title: string;
  type: 'download' | 'url';
  downloadFile?: {
    asset: {
      url: string;
    };
  };
  shareableUrl?: string;
}

interface FixCardActionsProps {
  pdfUrl?: string;
  videoUrl?: string;
  pdfGuide?: PdfGuideConfig;
}

export function FixCardActions({ pdfUrl, videoUrl, pdfGuide }: FixCardActionsProps) {
  return (
    <div className="flex flex-wrap gap-4 mt-6">
      {/* Enhanced PDF Guide with configurable CTA */}
      {pdfGuide?.enabled && (
        <>
          {pdfGuide.type === 'download' && pdfGuide.downloadFile?.asset?.url && (
            <a
              href={pdfGuide.downloadFile.asset.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-block"
            >
              <Button
                className="h-11 bg-black text-white rounded-lg hover:bg-gray-800"
                variant="outline"
              >
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                {pdfGuide.title || "Download Guide"}
              </Button>
            </a>
          )}
          {pdfGuide.type === 'url' && pdfGuide.shareableUrl && (
            <a
              href={pdfGuide.shareableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                className="h-11 bg-black text-white rounded-lg hover:bg-gray-800"
                variant="outline"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {pdfGuide.title || "View Guide"}
              </Button>
            </a>
          )}
        </>
      )}

      {/* Fallback to legacy pdfUrl if new pdfGuide is not configured */}
      {!pdfGuide?.enabled && pdfUrl && (
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
