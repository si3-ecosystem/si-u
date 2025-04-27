import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { safe, walletConnect, injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia],

  ssr: true,

  connectors: [
    walletConnect({
      projectId: "82b9193221afcff90a3e7b1d94e67505",
    }),
    safe(),
    injected(),
  ],

  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
