// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useConnect } from "wagmi";
// import { useEffect, useState } from "react";

// import LoginButton from "./LoginButton";

// const WALLET_OPTIONS = [
//   {
//     id: "uniswap",
//     name: "Uniswap Wallet",
//     url: "https://wallet.uniswap.org/",
//     icon: "/login/uniswap-logo.svg",
//   },
//   {
//     id: "zerion",
//     name: "Zerion Wallet",
//     url: "https://zerion.io/wallet",
//     icon: "/login/zerion-logo.svg",
//   },
// ];

// function WalletConnectButtons() {
//   const { connectors } = useConnect();
//   const [isMounted, setIsMounted] = useState(false);

//   // Prevent hydration mismatch
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) return null;

//   const injected = connectors.filter((c) => c.type === "injected");

//   const injectedButtons = WALLET_OPTIONS.map((wallet) => {
//     const connector = injected.find((c) =>
//       c.name.toLowerCase().includes(wallet.id)
//     );

//     if (connector) {
//       return <LoginButton key={wallet.id} connector={connector} />;
//     }

//     return (
//       <Link
//         key={wallet.id}
//         className="flex w-full cursor-pointer items-center justify-center gap-4 rounded-lg border bg-gray-100 p-2 px-4 py-2 hover:bg-gray-200"
//         href={wallet.url}
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <Image src={wallet.icon} alt={wallet.name} width={20} height={20} />
//         <span className="text-base font-semibold">
//           {"Download " + wallet.name}
//         </span>
//       </Link>
//     );
//   });

//   const nonInjectedButtons = connectors
//     .filter((c) => c.type !== "injected" && c.id !== "safe")
//     .map((connector) => (
//       <LoginButton key={connector.id} connector={connector} />
//     ));

//   return (
//     <>
//       {nonInjectedButtons}
//       {injectedButtons}
//     </>
//   );
// }

// export default WalletConnectButtons;

// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { WalletDialog } from "./WalletDialog";

// function InjectedWallet() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const handleOpenDialog = () => {
//     setIsDialogOpen(true);
//   };

//   return (
//     <>
//       <Button
//         onClick={handleOpenDialog}
//         className="flex w-full cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 py-3 text-gray-900 hover:bg-gray-50"
//         variant="outline"
//       >
//         <div className="flex h-6 w-6 items-center justify-center">
//           <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M21 18V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18Z"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//             <path
//               d="M7 10H17"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </div>
//         <span className="text-base font-semibold">Connect Your Wallet</span>
//       </Button>

//       <WalletDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
//     </>
//   );
// }

// export default InjectedWallet;

// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { WalletDialog } from "./WalletDialog";

// interface InjectedWalletProps {
//   onWalletConnected?: (address: string, name: string) => void;
// }

// function InjectedWallet({ onWalletConnected }: InjectedWalletProps) {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const handleOpenDialog = () => {
//     setIsDialogOpen(true);
//   };

//   const handleWalletConnected = (address: string, name: string) => {
//     // Call parent handler
//     if (onWalletConnected) {
//       onWalletConnected(address, name);
//     }
//   };

//   return (
//     <>
//       <Button
//         onClick={handleOpenDialog}
//         className="flex w-full cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 py-3 text-gray-900 hover:bg-gray-50"
//         variant="outline"
//       >
//         <div className="flex h-6 w-6 items-center justify-center">
//           <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M21 18V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18Z"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//             <path
//               d="M7 10H17"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </div>
//         <span className="text-base font-semibold">Connect Your Wallet</span>
//       </Button>

//       <WalletDialog
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//         onWalletConnected={handleWalletConnected}
//       />
//     </>
//   );
// }

// export default InjectedWallet;

// "use client";

// import { useAccount } from "wagmi";
// import React, { useState, useEffect } from "react";

// import { WalletDialog } from "./WalletDialog";

// import { Button } from "@/components/ui/button";

// interface InjectedWalletProps {
//   onWalletConnected?: (address: string, name: string) => void;
// }

// function InjectedWallet({ onWalletConnected }: InjectedWalletProps) {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const { isConnected, address, connector } = useAccount();

//   const handleOpenDialog = () => {
//     setIsDialogOpen(true);
//   };

//   const handleWalletConnected = (address: string, name: string) => {
//     // Call parent handler
//     if (onWalletConnected) {
//       onWalletConnected(address, name);
//     }
//   };

//   // Check if wallet is already connected when dialog opens
//   useEffect(() => {
//     if (isDialogOpen && isConnected && address && connector) {
//       // Wallet is already connected, go directly to signature state
//       handleWalletConnected(address, connector.name);
//       setIsDialogOpen(false);
//     }
//   }, [isDialogOpen, isConnected, address, connector]);

//   return (
//     <>
//       <Button
//         onClick={handleOpenDialog}
//         className="flex w-full cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 py-3 text-gray-900 hover:bg-gray-50"
//         variant="outline"
//       >
//         <div className="flex h-6 w-6 items-center justify-center">
//           <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M21 18V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18Z"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//             <path
//               d="M7 10H17"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </div>

//         <span className="text-base font-semibold">
//           {isConnected ? "Sign with Wallet" : "Connect Your Wallet"}
//         </span>
//       </Button>

//       <WalletDialog
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//         onWalletConnected={handleWalletConnected}
//       />
//     </>
//   );
// }

// export default InjectedWallet;

"use client";

import { useAccount } from "wagmi";
import React, { useState, useEffect, useCallback } from "react";

import { WalletDialog } from "./WalletDialog";

import { Button } from "@/components/ui/button";

interface InjectedWalletProps {
  onWalletConnected?: (address: string, name: string) => void;
}

const WalletIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M21 18V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 10H17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function InjectedWallet({ onWalletConnected }: InjectedWalletProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isConnected, address, connector } = useAccount();

  const handleWalletConnected = useCallback(
    (address: string, name: string) => {
      onWalletConnected?.(address, name);
    },
    [onWalletConnected]
  );

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback((open: boolean) => {
    setIsDialogOpen(open);
  }, []);

  // Auto-handle already connected wallet
  useEffect(() => {
    if (isDialogOpen && isConnected && address && connector?.name) {
      handleWalletConnected(address, connector.name);
      setIsDialogOpen(false);
    }
  }, [
    isDialogOpen,
    isConnected,
    address,
    connector?.name,
    handleWalletConnected,
  ]);

  const buttonText = isConnected ? "Sign with Wallet" : "Connect Your Wallet";

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        className="flex w-full cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 py-3 text-gray-900 hover:bg-gray-50"
        variant="outline"
        aria-label={buttonText}
      >
        <div className="flex h-6 w-6 items-center justify-center">
          <WalletIcon />
        </div>
        <span className="text-base font-semibold">{buttonText}</span>
      </Button>

      <WalletDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        onWalletConnected={handleWalletConnected}
      />
    </>
  );
}

export default InjectedWallet;
