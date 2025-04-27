"use client";

import Image from "next/image";
import { toast } from "sonner";
import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import { useDispatch } from "react-redux";
import { setAddress, setConnected } from "@/redux/slice/userSlice";

interface LoginButtonProps {
  src: string;
  alt: string;
  label: string;
  num?: number;
}

const LoginButton: FC<LoginButtonProps> = ({ src, alt, label, num }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { status, address } = useAccount();
  const { connect, connectors } = useConnect();

  const isValidConnector =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    num >= 0 && num < connectors.length;

  useEffect(() => {
    if (status === "connected") {
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

    if (isValidConnector) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        connect({ connector: connectors[num] });
        dispatch(setConnected(true));
        dispatch(setAddress(address));
      } catch (error) {
        console.error(error);
        toast.error("Failed to connect wallet");
      }
    } else {
      toast.error("Invalid connector");
    }
  };

  return (
    <button
      className="flex w-full cursor-pointer items-center gap-4 rounded-lg border bg-gray-100 p-2 px-4 py-2 hover:bg-gray-200"
      onClick={handleClick}
    >
      <Image src={src} alt={alt} width={20} height={20} />
      <span className="text-base font-semibold">{label}</span>
    </button>
  );
};

export default LoginButton;
