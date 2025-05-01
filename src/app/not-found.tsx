import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Blocks, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="flex items-center justify-center mb-6">
        <Blocks className="h-16 w-16 text-gray-400" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        404 - Page Not Found
      </h1>

      <Button asChild className="mt-8">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span>Back to SI3 Home</span>
        </Link>
      </Button>
    </div>
  );
}
