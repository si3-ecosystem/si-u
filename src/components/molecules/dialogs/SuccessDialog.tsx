"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  title: string;
  description: string;
  ctaLink: string;
  ctaTitle: string;
  titleClass?: string;
  descClass?: string;
  className?: string;
  showFooter?: boolean;
}

export function SuccessDialog({
  open,
  onOpenChange,
  imageSrc,
  title,
  description,
  ctaLink,
  ctaTitle,
  titleClass,
  descClass,
  className,
  showFooter = false,
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Success Dialog</DialogTitle>
      <DialogContent className="mx-auto w-full rounded-lg p-6 py-8 lg:max-w-[731px] lg:py-12">
        <div
          className={cn(
            "mx-auto mb-4 flex h-24 w-24 items-center justify-center",
            className
          )}
        >
          <Image
            src={imageSrc}
            alt="Success Icon"
            width={400}
            height={400}
            className="h-full w-full max-w-[168.088px] shrink-0 object-cover"
          />
        </div>

        <h2
          className={cn(
            "mb-2 text-center text-xl font-bold text-gray-900",
            titleClass
          )}
        >
          {title}
        </h2>

        <p
          className={cn(
            "mx-auto mb-6 w-full max-w-[450px] text-center text-sm text-gray-600",
            descClass
          )}
        >
          {description}
        </p>

        {showFooter && (
          <DialogFooter className="flex justify-center">
            <Button asChild className="mx-auto w-fit">
              <Link href={ctaLink}>{ctaTitle}</Link>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
