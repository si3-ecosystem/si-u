"use client";

// import Link from "next/link";
// import Image from "next/image";
import { useConnect } from "wagmi";
import { useEffect, useState } from "react";

import LoginButton from "./LoginButton";

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

function WalletConnectButtons() {
  const { connectors } = useConnect();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // const injected = connectors.filter((c) => c.type === "injected");

  // const injectedButtons = WALLET_OPTIONS.map((wallet) => {
  //   const connector = injected.find((c) =>
  //     c.name.toLowerCase().includes(wallet.id),
  //   );

  //   if (connector) {
  //     return <LoginButton key={wallet.id} connector={connector} />;
  //   }

  //   return (
  //     <Link
  //       key={wallet.id}
  //       className="flex w-full cursor-pointer items-center gap-4 rounded-lg border bg-gray-100 p-2 px-4 py-2 hover:bg-gray-200"
  //       href={wallet.url}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //     >
  //       <Image src={wallet.icon} alt={wallet.name} width={20} height={20} />
  //       <span className="text-base font-semibold">
  //         {"Download " + wallet.name}
  //       </span>
  //     </Link>
  //   );
  // });

  const nonInjectedButtons = connectors
    .filter((c) => c.type !== "injected" && c.id !== "safe")
    .map((connector) => (
      <LoginButton key={connector.id} connector={connector} />
    ));

  return (
    <>
      {nonInjectedButtons}
      {/* {injectedButtons} */}
    </>
  );
}

export default WalletConnectButtons;
