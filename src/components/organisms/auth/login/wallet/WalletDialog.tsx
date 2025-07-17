// // "use client";

// // import React, { useEffect, useState } from "react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { useConnect, useDisconnect } from "wagmi";
// // import Image from "next/image";
// // import Link from "next/link";

// // const WALLET_OPTIONS = [
// //   {
// //     id: "uniswap",
// //     name: "Uniswap Wallet",
// //     url: "https://wallet.uniswap.org/",
// //     icon: "/login/uniswap-logo.svg",
// //     isPartner: true,
// //   },
// //   {
// //     id: "zerion",
// //     name: "Zerion Wallet",
// //     url: "https://zerion.io/wallet",
// //     icon: "/login/zerion-logo.svg",
// //     isPartner: true,
// //   },
// //   {
// //     id: "trust",
// //     name: "Trust Wallet",
// //     url: "https://trustwallet.com/",
// //     icon: "/login/trust-logo.svg",
// //     isPartner: true,
// //   },
// // ];

// // // Sanitize image source
// // function sanitizeImageSrc(src: string | undefined): string | undefined {
// //   if (!src) return undefined;
// //   return src.replace(/^[\n\r\s]+|[\n\r\s]+$/g, "");
// // }

// // // Get fallback icon for connectors without icons
// // const getConnectorFallbackIcon = (connectorId: string): string => {
// //   switch (connectorId) {
// //     case "metaMaskSDK":
// //       return "/login/metamask-logo.svg";
// //     case "coinbaseWalletSDK":
// //       return "/login/coinbase-logo.svg";
// //     case "walletConnect":
// //       return "/login/wallet-connect-logo.svg";
// //     case "safe":
// //       return "/login/safe-logo.png";
// //     default:
// //       return "/default-wallet-logo.svg";
// //   }
// // };

// // // Final emoji fallback
// // const getWalletFallbackIcon = (connectorName: string) => {
// //   const name = connectorName.toLowerCase();

// //   if (name.includes("metamask")) return "🦊";
// //   if (name.includes("coinbase")) return "🔵";
// //   if (name.includes("walletconnect")) return "🔗";
// //   if (name.includes("rainbow")) return "🌈";
// //   if (name.includes("trust")) return "🛡️";
// //   if (name.includes("phantom")) return "👻";
// //   if (name.includes("uniswap")) return "🦄";
// //   if (name.includes("zerion")) return "⚡";
// //   if (name.includes("safe")) return "🔒";
// //   return "💼";
// // };

// // interface WalletDialogProps {
// //   open: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   onWalletConnected: (address: string, name: string) => void;
// // }

// // interface WalletOptionProps {
// //   connector?: any;
// //   wallet?: (typeof WALLET_OPTIONS)[0];
// //   onConnect: (connector?: any) => void;
// //   isConnecting?: boolean;
// // }

// // function WalletOption({
// //   connector,
// //   wallet,
// //   onConnect,
// //   isConnecting,
// // }: WalletOptionProps) {
// //   const [iconError, setIconError] = useState(false);

// //   const handleClick = () => {
// //     if (connector) {
// //       onConnect(connector);
// //     }
// //   };

// //   // Download link for wallets not installed
// //   if (wallet && !connector) {
// //     return (
// //       <Link
// //         className={`flex w-full items-center gap-3 hover:bg-pink-50 rounded-lg border p-3 transition-all ${
// //           wallet.isPartner
// //             ? "border-[#9F44D3]"
// //             : "border-gray-200 hover:border-[#9F44D3]"
// //         }`}
// //         href={wallet.url}
// //         target="_blank"
// //         rel="noopener noreferrer"
// //       >
// //         <div className="flex h-6 w-6 items-center justify-center">
// //           {!iconError ? (
// //             <Image
// //               src={wallet.icon}
// //               alt={wallet.name}
// //               width={24}
// //               height={24}
// //               onError={() => setIconError(true)}
// //               className="rounded"
// //             />
// //           ) : (
// //             <div className="flex h-6 w-6 items-center justify-center text-lg">
// //               {getWalletFallbackIcon(wallet.name)}
// //             </div>
// //           )}
// //         </div>
// //         <div className="flex-1 text-left">
// //           <div className="text-sm font-medium text-gray-900">
// //             {wallet.name}
// //             {wallet.isPartner && (
// //               <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
// //                 Recommended
// //               </span>
// //             )}
// //           </div>
// //           <div className="text-xs text-pink-600">
// //             Not installed - Click to download
// //           </div>
// //         </div>
// //         <div className="text-gray-400">
// //           <svg
// //             width="12"
// //             height="12"
// //             viewBox="0 0 24 24"
// //             fill="none"
// //             xmlns="http://www.w3.org/2000/svg"
// //           >
// //             <path
// //               d="M7 17L17 7M17 7H7M17 7V17"
// //               stroke="currentColor"
// //               strokeWidth="2"
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //             />
// //           </svg>
// //         </div>
// //       </Link>
// //     );
// //   }

// //   // Connected wallet option
// //   if (connector) {
// //     // Skip injected connector without specific identification
// //     if (connector.id === "injected") {
// //       return null;
// //     }

// //     const matchedWallet = WALLET_OPTIONS.find((w) =>
// //       connector.name.toLowerCase().includes(w.id.toLowerCase())
// //     );

// //     // Determine icon source with priority
// //     let iconSrc = "";

// //     // 1. First try connector.icon (real wagmi icon)
// //     if (connector.icon && !iconError) {
// //       iconSrc = sanitizeImageSrc(connector.icon) || "";
// //     }

// //     // 2. Fall back to predefined icons for known connectors
// //     if (!iconSrc) {
// //       if (matchedWallet) {
// //         iconSrc = matchedWallet.icon;
// //       } else {
// //         iconSrc = getConnectorFallbackIcon(connector.id);
// //       }
// //     }

// //     const isPartner = matchedWallet?.isPartner || false;

// //     return (
// //       <button
// //         onClick={handleClick}
// //         disabled={isConnecting}
// //         className={`flex w-full items-center gap-3 hover:bg-pink-50 rounded-lg border p-3 transition-all ${
// //           isPartner
// //             ? "border-[#9F44D3] "
// //             : "border-gray-200 hover:border-[#9F44D3]"
// //         } ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}`}
// //       >
// //         <div className="flex h-6 w-6 items-center justify-center">
// //           {iconSrc && !iconError ? (
// //             <Image
// //               src={iconSrc}
// //               alt={connector.name}
// //               width={24}
// //               height={24}
// //               onError={() => setIconError(true)}
// //               className="rounded"
// //             />
// //           ) : (
// //             <div className="flex h-6 w-6 items-center justify-center text-lg">
// //               {getWalletFallbackIcon(connector.name)}
// //             </div>
// //           )}
// //         </div>
// //         <div className="flex-1 text-left">
// //           <div className="text-sm font-medium text-gray-900">
// //             {connector.id === "walletConnect"
// //               ? "Continue With WalletConnect"
// //               : connector.name}
// //             {isPartner && (
// //               <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
// //                 Recommended
// //               </span>
// //             )}
// //           </div>
// //           <div className="text-xs text-gray-500">
// //             {connector.type === "injected"
// //               ? "Browser wallet"
// //               : "Connect via QR"}
// //           </div>
// //         </div>
// //         <div className="text-gray-400">
// //           {isConnecting ? (
// //             <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
// //           ) : (
// //             <svg
// //               width="12"
// //               height="12"
// //               viewBox="0 0 24 24"
// //               fill="none"
// //               xmlns="http://www.w3.org/2000/svg"
// //             >
// //               <path
// //                 d="M9 18L15 12L9 6"
// //                 stroke="currentColor"
// //                 strokeWidth="2"
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //               />
// //             </svg>
// //           )}
// //         </div>
// //       </button>
// //     );
// //   }

// //   return null;
// // }

// // export function WalletDialog({
// //   open,
// //   onOpenChange,
// //   onWalletConnected,
// // }: WalletDialogProps) {
// //   const { connectors, connect } = useConnect();
// //   const { disconnect } = useDisconnect();

// //   const [isMounted, setIsMounted] = useState(false);
// //   const [isConnecting, setIsConnecting] = useState(false);
// //   const [connectionError, setConnectionError] = useState<string>("");

// //   useEffect(() => {
// //     setIsMounted(true);
// //   }, []);

// //   const handleConnect = (connector: any) => {
// //     setConnectionError("");
// //     setIsConnecting(true);

// //     // Disconnect any existing connections first
// //     disconnect();

// //     connect(
// //       { connector },
// //       {
// //         onSuccess: (data) => {
// //           setIsConnecting(false);
// //           // Pass wallet info to parent
// //           onWalletConnected(data.accounts[0], connector.name);
// //           onOpenChange(false);
// //         },
// //         onError: (error) => {
// //           setIsConnecting(false);
// //           setConnectionError(
// //             error.message || "Failed to connect wallet. Please try again."
// //           );
// //         },
// //       }
// //     );
// //   };

// //   if (!isMounted) return null;

// //   // Filter connectors
// //   const injected = connectors.filter((c) => c.type === "injected");
// //   const nonInjected = connectors.filter(
// //     (c) => c.type !== "injected" && c.id !== "safe"
// //   );

// //   // Check which required wallets are installed
// //   const installedRequiredWallets = WALLET_OPTIONS.map((wallet) => {
// //     const connector = injected.find((c) =>
// //       c.name.toLowerCase().includes(wallet.id)
// //     );
// //     return { wallet, connector };
// //   });

// //   return (
// //     <Dialog open={open} onOpenChange={onOpenChange}>
// //       <DialogContent className="mx-auto w-full max-w-sm rounded-xl p-6 sm:max-w-md">
// //         <DialogHeader className="mb-4">
// //           <DialogTitle className="text-lg font-semibold text-center text-gray-900">
// //             Connect Wallet
// //           </DialogTitle>
// //           <p className="text-sm text-gray-600 text-center">
// //             Choose your preferred wallet
// //           </p>
// //         </DialogHeader>

// //         {connectionError && (
// //           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
// //             <p className="text-sm text-red-600">{connectionError}</p>
// //           </div>
// //         )}

// //         <div className="space-y-2">
// //           {/* Non-injected wallets first (WalletConnect, etc.) */}
// //           {nonInjected.map((connector) => (
// //             <WalletOption
// //               key={connector.id}
// //               connector={connector}
// //               onConnect={handleConnect}
// //               isConnecting={isConnecting}
// //             />
// //           ))}

// //           {/* Required wallets - installed ones */}
// //           {installedRequiredWallets
// //             .filter(
// //               (
// //                 item
// //               ): item is {
// //                 wallet: (typeof WALLET_OPTIONS)[0];
// //                 connector: NonNullable<typeof item.connector>;
// //               } => item.connector !== undefined
// //             )
// //             .map(({ connector }) => (
// //               <WalletOption
// //                 key={connector.id}
// //                 connector={connector}
// //                 onConnect={handleConnect}
// //                 isConnecting={isConnecting}
// //               />
// //             ))}

// //           {/* Other injected wallets (like Phantom) */}
// //           {injected
// //             .filter(
// //               (connector) =>
// //                 connector.id !== "injected" &&
// //                 !WALLET_OPTIONS.some((wallet) =>
// //                   connector.name.toLowerCase().includes(wallet.id.toLowerCase())
// //                 )
// //             )
// //             .map((connector) => (
// //               <WalletOption
// //                 key={connector.id}
// //                 connector={connector}
// //                 onConnect={handleConnect}
// //                 isConnecting={isConnecting}
// //               />
// //             ))}

// //           {/* Required wallets - not installed (download links) */}
// //           {installedRequiredWallets.filter(({ connector }) => !connector)
// //             .length > 0 && (
// //             <>
// //               <div className="my-3 flex items-center">
// //                 <hr className="flex-grow border-gray-200" />
// //                 <span className="px-2 text-xs text-gray-400 uppercase tracking-wide font-medium">
// //                   ⭐ Recommended Wallets
// //                 </span>
// //                 <hr className="flex-grow border-gray-200" />
// //               </div>

// //               {installedRequiredWallets
// //                 .filter(({ connector }) => !connector)
// //                 .map(({ wallet }) => (
// //                   <WalletOption
// //                     key={`download-${wallet.id}`}
// //                     wallet={wallet}
// //                     onConnect={handleConnect}
// //                     isConnecting={isConnecting}
// //                   />
// //                 ))}
// //             </>
// //           )}
// //         </div>

// //         {connectors.length === 0 && (
// //           <div className="text-center py-8">
// //             <div className="text-4xl mb-2">🔍</div>
// //             <p className="text-sm text-gray-600 mb-4">No wallets detected</p>
// //             <div className="space-y-2">
// //               {WALLET_OPTIONS.map((wallet) => (
// //                 <WalletOption
// //                   key={wallet.id}
// //                   wallet={wallet}
// //                   onConnect={handleConnect}
// //                   isConnecting={isConnecting}
// //                 />
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         <div className="mt-4 pt-3 border-t border-gray-100">
// //           <p className="text-xs text-gray-500 text-center">
// //             New to crypto?{" "}
// //             <Link
// //               href="https://ethereum.org/en/wallets/"
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="text-[#9F44D3] hover:underline font-medium"
// //             >
// //               Learn about wallets
// //             </Link>
// //           </p>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useConnect, useAccount } from "wagmi";
// import React, { useEffect, useState } from "react";

// import {
//   Dialog,
//   DialogTitle,
//   DialogHeader,
//   DialogContent,
// } from "@/components/ui/dialog";

// const WALLET_OPTIONS = [
//   {
//     id: "uniswap",
//     name: "Uniswap Wallet",
//     url: "https://wallet.uniswap.org/",
//     icon: "/login/uniswap-logo.svg",
//     isPartner: true,
//   },

//   {
//     id: "zerion",
//     name: "Zerion Wallet",
//     url: "https://zerion.io/wallet",
//     icon: "/login/zerion-logo.svg",
//     isPartner: true,
//   },

//   {
//     id: "trust",
//     name: "Trust Wallet",
//     url: "https://trustwallet.com/",
//     icon: "/login/trust-logo.svg",
//     isPartner: true,
//   },
// ];

// // Sanitize image source
// function sanitizeImageSrc(src: string | undefined): string | undefined {
//   if (!src) return undefined;
//   return src.replace(/^[\n\r\s]+|[\n\r\s]+$/g, "");
// }

// // Get fallback icon for connectors without icons
// const getConnectorFallbackIcon = (connectorId: string): string => {
//   switch (connectorId) {
//     case "safe":
//       return "/login/safe-logo.png";
//     case "metaMaskSDK":
//       return "/login/metamask-logo.svg";
//     case "coinbaseWalletSDK":
//       return "/login/coinbase-logo.svg";
//     case "walletConnect":
//       return "/login/wallet-connect-logo.svg";
//     default:
//       return "/default-wallet-logo.svg";
//   }
// };

// // Final emoji fallback
// const getWalletFallbackIcon = (connectorName: string) => {
//   const name = connectorName.toLowerCase();

//   if (name.includes("metamask")) return "🦊";
//   if (name.includes("coinbase")) return "🔵";
//   if (name.includes("walletconnect")) return "🔗";
//   if (name.includes("rainbow")) return "🌈";
//   if (name.includes("trust")) return "🛡️";
//   if (name.includes("phantom")) return "👻";
//   if (name.includes("uniswap")) return "🦄";
//   if (name.includes("zerion")) return "⚡";
//   if (name.includes("safe")) return "🔒";

//   return "💼";
// };

// interface WalletDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onWalletConnected: (address: string, name: string) => void;
// }

// interface WalletOptionProps {
//   connector?: any;
//   wallet?: (typeof WALLET_OPTIONS)[0];
//   onConnect: (connector?: any) => void;
//   isConnecting?: boolean;
// }

// function WalletOption({
//   connector,
//   wallet,
//   onConnect,
//   isConnecting,
// }: WalletOptionProps) {
//   const [iconError, setIconError] = useState(false);

//   const handleClick = () => {
//     if (connector) {
//       onConnect(connector);
//     }
//   };

//   // Download link for wallets not installed
//   if (wallet && !connector) {
//     return (
//       <Link
//         className={`flex w-full items-center gap-3 hover:bg-pink-50 rounded-lg border p-3 transition-all ${
//           wallet.isPartner
//             ? "border-[#9F44D3]"
//             : "border-gray-200 hover:border-[#9F44D3]"
//         }`}
//         href={wallet.url}
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <div className="flex h-6 w-6 items-center justify-center">
//           {!iconError ? (
//             <Image
//               src={wallet.icon}
//               alt={wallet.name}
//               width={24}
//               height={24}
//               onError={() => setIconError(true)}
//               className="rounded"
//             />
//           ) : (
//             <div className="flex h-6 w-6 items-center justify-center text-lg">
//               {getWalletFallbackIcon(wallet.name)}
//             </div>
//           )}
//         </div>

//         <div className="flex-1 text-left">
//           <div className="text-sm font-medium text-gray-900">
//             {wallet.name}
//             {wallet.isPartner && (
//               <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
//                 Recommended
//               </span>
//             )}
//           </div>

//           <div className="text-xs text-pink-600">
//             Not installed - Click to download
//           </div>
//         </div>

//         <div className="text-gray-400">
//           <svg
//             width="12"
//             height="12"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M7 17L17 7M17 7H7M17 7V17"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </div>
//       </Link>
//     );
//   }

//   // Connected wallet option
//   if (connector) {
//     // Skip injected connector without specific identification
//     if (connector.id === "injected") {
//       return null;
//     }

//     const matchedWallet = WALLET_OPTIONS.find((w) =>
//       connector.name.toLowerCase().includes(w.id.toLowerCase())
//     );

//     // Determine icon source with priority
//     let iconSrc = "";

//     // 1. First try connector.icon (real wagmi icon)
//     if (connector.icon && !iconError) {
//       iconSrc = sanitizeImageSrc(connector.icon) || "";
//     }

//     // 2. Fall back to predefined icons for known connectors
//     if (!iconSrc) {
//       if (matchedWallet) {
//         iconSrc = matchedWallet.icon;
//       } else {
//         iconSrc = getConnectorFallbackIcon(connector.id);
//       }
//     }

//     const isPartner = matchedWallet?.isPartner || false;

//     return (
//       <button
//         onClick={handleClick}
//         disabled={isConnecting}
//         className={`flex w-full items-center gap-3 hover:bg-pink-50 rounded-lg border p-3 transition-all ${
//           isPartner
//             ? "border-[#9F44D3] "
//             : "border-gray-200 hover:border-[#9F44D3]"
//         } ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}`}
//       >
//         <div className="flex h-6 w-6 items-center justify-center">
//           {iconSrc && !iconError ? (
//             <Image
//               src={iconSrc}
//               alt={connector.name}
//               width={24}
//               height={24}
//               onError={() => setIconError(true)}
//               className="rounded"
//             />
//           ) : (
//             <div className="flex h-6 w-6 items-center justify-center text-lg">
//               {getWalletFallbackIcon(connector.name)}
//             </div>
//           )}
//         </div>

//         <div className="flex-1 text-left">
//           <div className="text-sm font-medium text-gray-900">
//             {connector.id === "walletConnect"
//               ? "Continue With WalletConnect"
//               : connector.name}
//             {isPartner && (
//               <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
//                 Recommended
//               </span>
//             )}
//           </div>

//           <div className="text-xs text-gray-500">
//             {connector.type === "injected"
//               ? "Browser wallet"
//               : "Connect via QR"}
//           </div>
//         </div>

//         <div className="text-gray-400">
//           {isConnecting ? (
//             <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
//           ) : (
//             <svg
//               width="12"
//               height="12"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M9 18L15 12L9 6"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           )}
//         </div>
//       </button>
//     );
//   }

//   return null;
// }

// export function WalletDialog({
//   open,
//   onOpenChange,
//   onWalletConnected,
// }: WalletDialogProps) {
//   const { connectors, connect } = useConnect();
//   const { isConnected, address, connector } = useAccount();

//   const [isMounted, setIsMounted] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [connectionError, setConnectionError] = useState<string>("");

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // If wallet is already connected when dialog opens, proceed directly
//   useEffect(() => {
//     if (open && isConnected && address && connector) {
//       onWalletConnected(address, connector.name);
//       onOpenChange(false);
//     }
//   }, [open, isConnected, address, connector, onWalletConnected, onOpenChange]);

//   const handleConnect = (selectedConnector: any) => {
//     setConnectionError("");
//     setIsConnecting(true);

//     connect(
//       { connector: selectedConnector },
//       {
//         onSuccess: (data) => {
//           setIsConnecting(false);
//           // Pass wallet info to parent
//           onWalletConnected(data.accounts[0], selectedConnector.name);
//           onOpenChange(false);
//         },
//         onError: (error) => {
//           setIsConnecting(false);
//           console.error("Connection error:", error);
//           setConnectionError(
//             error.message || "Failed to connect wallet. Please try again."
//           );
//         },
//       }
//     );
//   };

//   if (!isMounted) return null;

//   // Don't show dialog content if wallet is already connected
//   if (isConnected && address && connector) {
//     return null;
//   }

//   // Filter connectors
//   const injected = connectors.filter((c) => c.type === "injected");
//   const nonInjected = connectors.filter(
//     (c) => c.type !== "injected" && c.id !== "safe"
//   );

//   // Check which required wallets are installed
//   const installedRequiredWallets = WALLET_OPTIONS.map((wallet) => {
//     const connector = injected.find((c) =>
//       c.name.toLowerCase().includes(wallet.id)
//     );
//     return { wallet, connector };
//   });

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="mx-auto w-full max-w-sm rounded-xl p-6 sm:max-w-md">
//         <DialogHeader className="mb-4">
//           <DialogTitle className="text-lg font-semibold text-center text-gray-900">
//             Connect Wallet
//           </DialogTitle>

//           <p className="text-sm text-gray-600 text-center">
//             Choose your preferred wallet
//           </p>
//         </DialogHeader>

//         {connectionError && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-sm text-red-600">{connectionError}</p>
//           </div>
//         )}

//         <div className="space-y-2">
//           {nonInjected.map((connector) => (
//             <WalletOption
//               key={connector.id}
//               connector={connector}
//               onConnect={handleConnect}
//               isConnecting={isConnecting}
//             />
//           ))}

//           {installedRequiredWallets
//             .filter(
//               (
//                 item
//               ): item is {
//                 wallet: (typeof WALLET_OPTIONS)[0];
//                 connector: NonNullable<typeof item.connector>;
//               } => item.connector !== undefined
//             )
//             .map(({ connector }) => (
//               <WalletOption
//                 key={connector.id}
//                 connector={connector}
//                 onConnect={handleConnect}
//                 isConnecting={isConnecting}
//               />
//             ))}

//           {injected
//             .filter(
//               (connector) =>
//                 connector.id !== "injected" &&
//                 !WALLET_OPTIONS.some((wallet) =>
//                   connector.name.toLowerCase().includes(wallet.id.toLowerCase())
//                 )
//             )
//             .map((connector) => (
//               <WalletOption
//                 key={connector.id}
//                 connector={connector}
//                 onConnect={handleConnect}
//                 isConnecting={isConnecting}
//               />
//             ))}

//           {installedRequiredWallets.filter(({ connector }) => !connector)
//             .length > 0 && (
//             <>
//               <div className="my-3 flex items-center">
//                 <hr className="flex-grow border-gray-200" />
//                 <span className="px-2 text-xs text-gray-400 uppercase tracking-wide font-medium">
//                   ⭐ Recommended Wallets
//                 </span>
//                 <hr className="flex-grow border-gray-200" />
//               </div>

//               {installedRequiredWallets
//                 .filter(({ connector }) => !connector)
//                 .map(({ wallet }) => (
//                   <WalletOption
//                     key={`download-${wallet.id}`}
//                     wallet={wallet}
//                     onConnect={handleConnect}
//                     isConnecting={isConnecting}
//                   />
//                 ))}
//             </>
//           )}
//         </div>

//         {connectors.length === 0 && (
//           <div className="text-center py-8">
//             <div className="text-4xl mb-2">🔍</div>
//             <p className="text-sm text-gray-600 mb-4">No wallets detected</p>
//             <div className="space-y-2">
//               {WALLET_OPTIONS.map((wallet) => (
//                 <WalletOption
//                   key={wallet.id}
//                   wallet={wallet}
//                   onConnect={handleConnect}
//                   isConnecting={isConnecting}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="mt-4 pt-3 border-t border-gray-100">
//           <p className="text-xs text-gray-500 text-center">
//             New to crypto?{" "}
//             <Link
//               href="https://ethereum.org/en/wallets/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-[#9F44D3] hover:underline font-medium"
//             />
//             Learn about wallets
//           </p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { useConnect, useAccount } from "wagmi";
import React, { useEffect, useState, useCallback, useMemo } from "react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";

const WALLET_OPTIONS = [
  {
    id: "uniswap",
    name: "Uniswap Wallet",
    url: "https://wallet.uniswap.org/",
    icon: "/login/uniswap-logo.svg",
    isPartner: true,
  },
  {
    id: "zerion",
    name: "Zerion Wallet",
    url: "https://zerion.io/wallet",
    icon: "/login/zerion-logo.svg",
    isPartner: true,
  },
  {
    id: "trust",
    name: "Trust Wallet",
    url: "https://trustwallet.com/",
    icon: "/login/trust-logo.svg",
    isPartner: true,
  },
] as const;

const CONNECTOR_ICONS: Record<string, string> = {
  safe: "/login/safe-logo.png",
  metaMaskSDK: "/login/metamask-logo.svg",
  coinbaseWalletSDK: "/login/coinbase-logo.svg",
  walletConnect: "/login/wallet-connect-logo.svg",
};

const WALLET_EMOJI_FALLBACKS: Record<string, string> = {
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

const sanitizeImageSrc = (src?: string): string | undefined =>
  src?.replace(/^[\n\r\s]+|[\n\r\s]+$/g, "");

const getConnectorFallbackIcon = (connectorId: string): string =>
  CONNECTOR_ICONS[connectorId] || "/default-wallet-logo.svg";

const getWalletFallbackIcon = (connectorName: string): string => {
  const name = connectorName.toLowerCase();

  for (const [key, emoji] of Object.entries(WALLET_EMOJI_FALLBACKS)) {
    if (name.includes(key)) return emoji;
  }

  return "💼";
};

interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWalletConnected: (address: string, name: string) => void;
}

interface WalletOptionProps {
  connector?: any;
  wallet?: (typeof WALLET_OPTIONS)[number];
  onConnect: (connector?: any) => void;
  isConnecting?: boolean;
}

const ExternalLinkIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M7 17L17 7M17 7H7M17 7V17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LoadingSpinner = ({ className }: { className?: string }) => (
  <div
    className={`border-2 border-gray-400 border-t-transparent rounded-full animate-spin ${className}`}
  />
);

function WalletOption({
  connector,
  wallet,
  onConnect,
  isConnecting,
}: WalletOptionProps) {
  const [iconError, setIconError] = useState(false);

  const handleClick = useCallback(() => {
    if (connector) onConnect(connector);
  }, [connector, onConnect]);

  const handleIconError = useCallback(() => setIconError(true), []);

  const iconSrc = useMemo(() => {
    if (connector?.icon && !iconError) {
      return sanitizeImageSrc(connector.icon) || "";
    }
    if (connector) {
      const matchedWallet = WALLET_OPTIONS.find((w) =>
        connector.name.toLowerCase().includes(w.id.toLowerCase())
      );
      return matchedWallet?.icon || getConnectorFallbackIcon(connector.id);
    }
    return "";
  }, [connector, iconError]);

  // Download link for wallets not installed
  if (wallet && !connector) {
    return (
      <Link
        className={`flex w-full items-center gap-3 hover:bg-pink-50 rounded-lg border p-3 transition-all ${
          wallet.isPartner
            ? "border-[#9F44D3]"
            : "border-gray-200 hover:border-[#9F44D3]"
        }`}
        href={wallet.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Download ${wallet.name}`}
      >
        <div className="flex h-6 w-6 items-center justify-center">
          {!iconError ? (
            <Image
              src={wallet.icon}
              alt=""
              width={24}
              height={24}
              onError={handleIconError}
              className="rounded"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center text-lg">
              {getWalletFallbackIcon(wallet.name)}
            </div>
          )}
        </div>

        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900">
            {wallet.name}
            {wallet.isPartner && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Recommended
              </span>
            )}
          </div>

          <div className="text-xs text-pink-600">
            Not installed - Click to download
          </div>
        </div>

        <div className="text-gray-400">
          <ExternalLinkIcon />
        </div>
      </Link>
    );
  }

  // Connected wallet option
  if (connector) {
    if (connector.id === "injected") return null;

    const matchedWallet = WALLET_OPTIONS.find((w) =>
      connector.name.toLowerCase().includes(w.id.toLowerCase())
    );

    const displayName =
      connector.id === "walletConnect"
        ? "Continue With WalletConnect"
        : connector.name;

    const isPartner = matchedWallet?.isPartner || false;

    return (
      <button
        onClick={handleClick}
        disabled={isConnecting}
        className={`flex w-full items-center gap-3 hover:bg-pink-50 rounded-lg border p-3 transition-all ${
          isPartner
            ? "border-[#9F44D3]"
            : "border-gray-200 hover:border-[#9F44D3]"
        } ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label={`Connect with ${displayName}`}
      >
        <div className="flex h-6 w-6 items-center justify-center">
          {iconSrc && !iconError ? (
            <Image
              src={iconSrc}
              alt=""
              width={24}
              height={24}
              onError={handleIconError}
              className="rounded"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center text-lg">
              {getWalletFallbackIcon(connector.name)}
            </div>
          )}
        </div>

        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900">
            {displayName}
            {isPartner && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Recommended
              </span>
            )}
          </div>

          <div className="text-xs text-gray-500">
            {connector.type === "injected"
              ? "Browser wallet"
              : "Connect via QR"}
          </div>
        </div>

        <div className="text-gray-400">
          {isConnecting ? (
            <LoadingSpinner className="w-4 h-4" />
          ) : (
            <ChevronRightIcon />
          )}
        </div>
      </button>
    );
  }

  return null;
}

export function WalletDialog({
  open,
  onOpenChange,
  onWalletConnected,
}: WalletDialogProps) {
  const { connectors, connect } = useConnect();
  const { isConnected, address, connector } = useAccount();

  const [isMounted, setIsMounted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string>("");

  useEffect(() => setIsMounted(true), []);

  // Handle already connected wallet
  useEffect(() => {
    if (open && isConnected && address && connector?.name) {
      onWalletConnected(address, connector.name);
      onOpenChange(false);
    }
  }, [
    open,
    isConnected,
    address,
    connector?.name,
    onWalletConnected,
    onOpenChange,
  ]);

  const handleConnect = useCallback(
    (selectedConnector: any) => {
      setConnectionError("");
      setIsConnecting(true);

      connect(
        { connector: selectedConnector },
        {
          onSuccess: (data) => {
            setIsConnecting(false);
            onWalletConnected(data.accounts[0], selectedConnector.name);
            onOpenChange(false);
          },
          onError: (error) => {
            setIsConnecting(false);
            console.error("Connection error:", error);
            setConnectionError(
              error.message || "Failed to connect wallet. Please try again."
            );
          },
        }
      );
    },
    [connect, onWalletConnected, onOpenChange]
  );

  const { injected, nonInjected, installedRequiredWallets } = useMemo(() => {
    const injected = connectors.filter((c) => c.type === "injected");
    const nonInjected = connectors.filter(
      (c) => c.type !== "injected" && c.id !== "safe"
    );

    const installedRequiredWallets = WALLET_OPTIONS.map((wallet) => {
      const connector = injected.find((c) =>
        c.name.toLowerCase().includes(wallet.id)
      );
      return { wallet, connector };
    });

    return { injected, nonInjected, installedRequiredWallets };
  }, [connectors]);

  const filteredInjected = useMemo(
    () =>
      injected.filter(
        (connector) =>
          connector.id !== "injected" &&
          !WALLET_OPTIONS.some((wallet) =>
            connector.name.toLowerCase().includes(wallet.id.toLowerCase())
          )
      ),
    [injected]
  );

  const uninstalledWallets = useMemo(
    () => installedRequiredWallets.filter(({ connector }) => !connector),
    [installedRequiredWallets]
  );

  const installedWallets = useMemo(
    () =>
      installedRequiredWallets.filter(
        (
          item
        ): item is {
          wallet: (typeof WALLET_OPTIONS)[number];
          connector: NonNullable<typeof item.connector>;
        } => item.connector !== undefined
      ),
    [installedRequiredWallets]
  );

  if (!isMounted || (isConnected && address && connector)) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto w-full max-w-sm rounded-xl p-6 sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-center text-gray-900">
            Connect Wallet
          </DialogTitle>
          <p className="text-sm text-gray-600 text-center">
            Choose your preferred wallet
          </p>
        </DialogHeader>

        {connectionError && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
          >
            <p className="text-sm text-red-600">{connectionError}</p>
          </div>
        )}

        <div className="space-y-2">
          {nonInjected.map((connector) => (
            <WalletOption
              key={connector.id}
              connector={connector}
              onConnect={handleConnect}
              isConnecting={isConnecting}
            />
          ))}

          {installedWallets.map(({ connector }) => (
            <WalletOption
              key={connector.id}
              connector={connector}
              onConnect={handleConnect}
              isConnecting={isConnecting}
            />
          ))}

          {filteredInjected.map((connector) => (
            <WalletOption
              key={connector.id}
              connector={connector}
              onConnect={handleConnect}
              isConnecting={isConnecting}
            />
          ))}

          {uninstalledWallets.length > 0 && (
            <>
              <div className="my-3 flex items-center">
                <hr className="flex-grow border-gray-200" />
                <span className="px-2 text-xs text-gray-400 uppercase tracking-wide font-medium">
                  ⭐ Recommended Wallets
                </span>
                <hr className="flex-grow border-gray-200" />
              </div>

              {uninstalledWallets.map(({ wallet }) => (
                <WalletOption
                  key={`download-${wallet.id}`}
                  wallet={wallet}
                  onConnect={handleConnect}
                  isConnecting={isConnecting}
                />
              ))}
            </>
          )}
        </div>

        {connectors.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm text-gray-600 mb-4">No wallets detected</p>
            <div className="space-y-2">
              {WALLET_OPTIONS.map((wallet) => (
                <WalletOption
                  key={wallet.id}
                  wallet={wallet}
                  onConnect={handleConnect}
                  isConnecting={isConnecting}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            New to crypto?{" "}
            <Link
              href="https://ethereum.org/en/wallets/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9F44D3] hover:underline font-medium"
            >
              Learn about wallets
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
