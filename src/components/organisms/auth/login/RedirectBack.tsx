"use client";
import { MoveLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function RedirectBack() {
  const router = useRouter();
  return (
    <>
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 lg:mb-24"
      >
        <MoveLeftIcon className="size-6" />
        Back
      </button>
    </>
  );
}
