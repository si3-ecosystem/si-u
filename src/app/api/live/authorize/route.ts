import { NextRequest, NextResponse } from "next/server";
import { hasValidUnlockKey, isUnlockLockManager } from "@/lib/web3/unlock";
import { headers } from "next/headers";
import { SignJWT } from "jose";

function getJwtSecret() {
  const secret = process.env.LIVE_JWT_SECRET;
  if (!secret) throw new Error("Missing LIVE_JWT_SECRET env var");
  return new TextEncoder().encode(secret);
}

export async function POST(request: NextRequest) {
  try {
    const { ownerAddress, lockAddress, debug } = await request.json();
    if (!ownerAddress || !lockAddress) {
      return NextResponse.json({ error: "ownerAddress and lockAddress are required" }, { status: 400 });
    }

    const chain = process.env.UNLOCK_CHAIN || "mainnet";
    const rpc = process.env.ETH_RPC_URL ? "set" : "unset";
    const valid = await hasValidUnlockKey({ lockAddress, ownerAddress });
    let manager = false;
    if (!valid && process.env.UNLOCK_ALLOW_MANAGERS === "true") {
      manager = await isUnlockLockManager({ lockAddress, account: ownerAddress });
    }
    if (!valid && !manager) {
      const body: any = { error: "Access denied: no valid key" };
      if (debug) body.debug = { ownerAddress, lockAddress, chain, ethRpcUrl: rpc };
      return NextResponse.json(body, { status: 403 });
    }

    const secret = getJwtSecret();
    const expSeconds = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes
    const token = await new SignJWT({ sub: ownerAddress, lock: lockAddress, scope: "live:join", mgr: manager })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expSeconds)
      .setIssuedAt()
      .sign(secret);

    return NextResponse.json({ token, exp: expSeconds, chain, manager });
  } catch (e: any) {
    console.error("/api/live/authorize error", e);
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}


