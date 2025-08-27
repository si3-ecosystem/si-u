import { http, createConfig } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";
import { safe, injected, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, polygon, sepolia],
  ssr: false,
  connectors: [
    walletConnect({
      projectId: "fc0b7f76086b5fccf0fc5d12449e7d3e",
      metadata: {
        name: "Si3",
        description: "Si3 dashboard", 
        url: "https://app.si3.space/", 
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