"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";

interface Props {
  lockAddress: string;
}

export default function NFTGatedLiveJoin({ lockAddress }: Props) {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  async function parseResponse(res: Response) {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      return await res.json();
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: text };
    }
  }

  const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!address) throw new Error("Connect wallet first");

      // 1) Create or get test room on server
      const r = await fetch("/api/live/test-room", { method: "POST" });
      const roomData = await parseResponse(r);
      if (!r.ok) throw new Error(roomData?.error || "Failed to create room");

      // 2) Authorize via Unlock
      const authRes = await fetch("/api/live/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerAddress: "0x40eFf8C0b6eCEb8430737104BaF0620F7e177A26", lockAddress }),
      });
      const auth = await parseResponse(authRes);
      if (!authRes.ok) throw new Error(auth?.error || "Authorization failed");

      const url = roomData?.room?.roomUrl || `https://app.huddle01.com/room/${roomData?.room?.roomId}`;
      setRoomUrl(url);
    } catch (e: any) {
      setError(e?.message || "Failed to join");
    } finally {
      setLoading(false);
    }
  };

  if (roomUrl) {
    return (
      <div className="w-full">
        <iframe src={roomUrl} className="w-full h-[70vh] rounded-lg border" allow="camera; microphone; display-capture; autoplay; clipboard-read; clipboard-write" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button onClick={handleJoin} disabled={loading || !address}>
        {loading ? "Checking access..." : address ? "Join Livestream" : "Connect wallet to join"}
      </Button>
    </div>
  );
}


