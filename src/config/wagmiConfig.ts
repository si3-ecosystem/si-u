import { http, createConfig } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";
import { safe, injected, walletConnect } from "wagmi/connectors";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://siu.si3.space";

export const config = createConfig({
  chains: [mainnet, polygon, sepolia],
  ssr: false,
  connectors: [
    walletConnect({
      projectId: "fc0b7f76086b5fccf0fc5d12449e7d3e",
      metadata: {
        name: "Si3",
        description: "Si3 dashboard",
        url: appUrl,
        icons: ["https://www.svgrepo.com/show/354513/vercel-icon.svg"],
      },
      relayUrl: "wss://relay.walletconnect.com",
      showQrModal: true,
      disableProviderPing: false
    }),
    injected(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
  },
});