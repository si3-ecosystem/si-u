"use client";

import Image from "next/image";
import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Connector, useAccount, useConnect } from "wagmi";

import { setAddress, setConnected } from "@/redux/slice/userSlice";

interface LoginButtonProps {
  connector: Connector;
}

const LoginButton: FC<LoginButtonProps> = ({ connector }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { status, address } = useAccount();
  const { connect } = useConnect();

  useEffect(() => {
    if (status === "connected" && address) {
      dispatch(setConnected(true));
      dispatch(setAddress(address));
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleClick = async () => {
    if (status === "connected") {
      router.push("/");
      return;
    }

    try {
      connect({ connector: connector });
      dispatch(setConnected(true));
      dispatch(setAddress(address));
    } catch (error) {
      console.error(error);
    }
  };

  if (connector.id === "injected") {
    return null;
  }

  let src = "";
  const alt = connector.name;

  if (connector.icon) {
    src = sanitizeImageSrc(connector.icon) || "";
  } else {
    switch (connector.id) {
      case "metaMaskSDK":
        src = "/login/metamask-logo.svg";
        break;
      // case "coinbaseWallet":
      //   src = "/login//coinbase-logo.svg";
      //   break;
      case "walletConnect":
        src = "/login/wallet-connect-logo.svg";
        break;
      case "safe":
        src = "/login/safe-logo.png";
        break;
      default:
        src = "/default-wallet-logo.svg";
        break;
    }
  }

  return (
    <button
      className="flex w-full cursor-pointer items-center justify-center gap-4 rounded-lg border bg-gray-100 p-2 px-4 py-2 hover:bg-gray-200"
      onClick={handleClick}
    >
      <Image src={src} alt={alt} width={20} height={20} />
      <span className="text-sm font-medium md:text-base">
        {connector.id === "walletConnect" ? "Continue With WalletConnect" : alt}
      </span>
    </button>
  );
};

function sanitizeImageSrc(src: string | undefined): string | undefined {
  if (!src) return undefined;
  return src.replace(/^[\n\r\s]+|[\n\r\s]+$/g, "");
}

export default LoginButton;
