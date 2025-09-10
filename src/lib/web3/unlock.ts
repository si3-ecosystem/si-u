import { createPublicClient, http, getAddress } from "viem";
import { mainnet, polygon, base, optimism, arbitrum, sepolia, polygonMumbai } from "viem/chains";

// Minimal PublicLock ABI fragment for hasValidKey and isLockManager
const PUBLIC_LOCK_ABI = [
  {
    name: "getHasValidKey",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_owner", type: "address" }],
    outputs: [{ name: "_isValid", type: "bool" }],
  },
  {
    name: "isLockManager",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_account", type: "address" }],
    outputs: [{ name: "_isManager", type: "bool" }],
  },
] as const;

export type SupportedChain = typeof mainnet | typeof polygon | typeof optimism | typeof arbitrum | typeof base | typeof sepolia | typeof polygonMumbai;

function resolveChain(): SupportedChain {
  const chain = (process.env.UNLOCK_CHAIN || "mainnet").toLowerCase();
  switch (chain) {
    case "polygon":
      return polygon;
    case "base":
      return base;
    case "optimism":
      return optimism;
    case "arbitrum":
      return arbitrum;
    case "sepolia":
      return sepolia;
    case "mumbai":
    case "polygon-mumbai":
      return polygonMumbai;
    case "mainnet":
    default:
      return mainnet;
  }
}

function createClient() {
  const chain = resolveChain();
  const rpcUrl = process.env.ETH_RPC_URL;
  return createPublicClient({
    chain,
    transport: http(rpcUrl || undefined),
  });
}

export async function hasValidUnlockKey(params: { lockAddress: string; ownerAddress: string }): Promise<boolean> {
  const client = createClient();
  const lock = getAddress(params.lockAddress);
  const owner = getAddress(params.ownerAddress);
  const result = await client.readContract({
    address: lock,
    abi: PUBLIC_LOCK_ABI,
    functionName: "getHasValidKey",
    args: [owner],
  });
  return Boolean(result);
}


export async function isUnlockLockManager(params: { lockAddress: string; account: string }): Promise<boolean> {
  const client = createClient();
  const lock = getAddress(params.lockAddress);
  const account = getAddress(params.account);
  const result = await client.readContract({
    address: lock,
    abi: PUBLIC_LOCK_ABI,
    functionName: "isLockManager",
    args: [account],
  });
  return Boolean(result);
}


