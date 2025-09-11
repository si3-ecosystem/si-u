
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## NFT‑Gated Livestream (Unlock Protocol + Huddle01)

This project integrates Unlock Protocol for NFT‑gated access and Huddle01 for livestreaming. A test livestream widget is wired into the sessions page and only appears when `NEXT_PUBLIC_UNLOCK_LOCK_ADDRESS` is set.

### Environment Variables

Create a `.env.local` with:

```
# Web3 RPC
ETH_RPC_URL=YOUR_RPC_URL
UNLOCK_CHAIN=sepolia            # mainnet, polygon, base, optimism, arbitrum, sepolia, polygon-mumbai

# Unlock gating
NEXT_PUBLIC_UNLOCK_LOCK_ADDRESS=0xYourUnlockLockAddress

# Live auth (server-signed short-lived JWT)
LIVE_JWT_SECRET=super-secret-change-me

# Huddle01
HUDDLE_API_KEY=your_huddle01_api_key
# Optional override
# HUDDLE_API_BASE=https://api.huddle01.com
```

Notes:
- Use a lock deployed on the `UNLOCK_CHAIN` you select.
- For testnets, prefer `sepolia` or `polygon-mumbai` and a public RPC.

### How it Works

- Server: `src/lib/web3/unlock.ts` verifies `getHasValidKey(owner)` via viem against your lock.
- Server: `src/app/api/live/authorize` checks the Unlock key and returns a short‑lived JWT (10 minutes).
- Server: `src/lib/services/huddle.ts` creates a Huddle01 room via their API.
- Client: `src/components/organisms/sessions/NFTGatedLiveJoin.tsx` requests a test room and authorization, then embeds the Huddle room in an iframe.
- UI: `src/app/(dashboard)/sessions/page.tsx` shows a “Test NFT‑Gated Livestream” section when `NEXT_PUBLIC_UNLOCK_LOCK_ADDRESS` is set.

### Run a Test Livestream

1. Set the env vars above and restart `next dev`.
2. Ensure your wallet holds a valid key for `NEXT_PUBLIC_UNLOCK_LOCK_ADDRESS` on `UNLOCK_CHAIN`.
3. Open `/sessions` (Dashboard → Sessions). A Test section should be visible.
4. Connect your wallet (existing wallet login flow), then click “Join Livestream”.
5. You should see the embedded Huddle01 room load if your key is valid. If not, you’ll get an access error.

### Production Readiness

- The Unlock and Huddle services are modular and live under `src/lib`.
- Access token is short‑lived and scoped; extend to pass into client/host SDKs as needed.
- Future: replace the test room endpoint with per‑session room creation/lookup and store metadata in your DB.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Huddle01 API DOC URL = https://docs.huddle01.com/docs/apis/meeting-details/meeting-list
