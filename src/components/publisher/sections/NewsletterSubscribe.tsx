"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

type ListKey = "website" | "publisher" | "currentsi";

interface Props {
  listKey?: ListKey;
  className?: string;
  source?: string;
}

const NewsletterSubscribe: React.FC<Props> = ({
  listKey = "currentsi",
  className,
  source,
}) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (loading) return;
    if (!email) {
      toast.error("Please enter an email.");
      return;
    }

    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) {
      toast.error("Missing NEXT_PUBLIC_BASE_URL.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${base}/api/email/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          listKey,
          source: source || "footer",
        }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data === "object" &&
          data &&
          "message" in (data as Record<string, unknown>)
            ? String((data as Record<string, unknown>).message)
            : "Subscription failed";
        throw new Error(msg);
      }
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex w-full max-w-md items-center ${className || ""}`}>
      <div className="flex w-full flex-col gap-3">
        <div className="flex rounded-xl w-full lg:w-fit h-10 items-center bg-white">
          <Image
            src="https://res.cloudinary.com/dv52zu7pu/image/upload/v1751386798/mail_ibby6d.png"
            alt=""
            width={17}
            height={17}
            className="mx-2"
          />
          <input
            type="email"
            placeholder="Subscribe to our newsletter..."
            className="focus:outline-none font-dm-sans w-full mr-3 lg:w-44"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="flex justify-end h-full">
            <button type="button" className="bg-[#C8BAFD] rounded-xl w-10" onClick={handleSubmit}>
              <ChevronRight className="size-4 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSubscribe;


