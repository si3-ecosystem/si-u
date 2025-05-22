import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import Image from "next/image";

export default function Settings() {
  return (
    <div>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 mb-3">
            <Image
              src="/card_placeholder.png"
              alt="Profile picture"
              width={96}
              height={96}
              className="rounded-full object-center object-cover h-full w-full"
            />
          </div>
          <h2 className="text-lg font-medium">siher.et</h2>
          <div className="flex items-center mt-2 text-sm gap-2  rounded-full px-3 py-1">
            <span className="font-bold">
              eth: <span className="text-gray-500">0x8687...edce</span>
            </span>
            <button className="ml-1 text-gray-500 hover:text-gray-700">
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm">
            You are logged in
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-2">
            <span className="">Wallet</span>
            <span className="font-semibold">Zerion</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="">Connected network</span>
            <span className="font-semibold">Mainnet</span>
          </div>
        </div>

        <Button
          variant="destructive"
          className="w-full mt-16 bg-red-100 text-red-700 font-medium hover:text-white"
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
}
