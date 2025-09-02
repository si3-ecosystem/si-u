export const WALLET_OPTIONS = [
  { id: "uniswap", name: "Uniswap Wallet", url: "https://wallet.uniswap.org/", icon: "/login/uniswap-logo.svg", isPartner: true },
  { id: "zerion", name: "Zerion Wallet", url: "https://zerion.io/download", icon: "/login/zerion-logo.svg", isPartner: true },
  { id: "trust", name: "Trust Wallet", url: "https://trustwallet.com/", icon: "/login/trust-logo.svg", isPartner: true },
] as const;

export const CONNECTOR_ICONS: Record<string, string> = {
  safe: "/login/safe-logo.png",
  metaMaskSDK: "/login/metamask-logo.svg",
  coinbaseWalletSDK: "/login/coinbase-logo.svg",
  walletConnect: "/login/wallet-connect-logo.svg",
};

export const WALLET_EMOJI_FALLBACKS: Record<string, string> = {
  safe: "🔒",
  trust: "🛡️",
  zerion: "⚡",
  rainbow: "🌈",
  phantom: "👻",
  uniswap: "🦄",
  coinbase: "🔵",
  metamask: "🦊",
  walletconnect: "🔗",
};

export const sanitizeImageSrc = (src?: string): string | undefined =>
  src?.replace(/^[\n\r\s]+|[\n\r\s]+$/g, "");

export const getConnectorFallbackIcon = (connectorId: string): string =>
  CONNECTOR_ICONS[connectorId] || "/default-wallet-logo.svg";

export const getWalletFallbackIcon = (connectorName: string): string => {
  const name = connectorName.toLowerCase();
  for (const [key, emoji] of Object.entries(WALLET_EMOJI_FALLBACKS)) {
    if (name.includes(key)) return emoji;
  }
  return "💼";
};
