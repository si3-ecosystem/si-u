import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Image from "next/image";

export function Banner() {
  return (
    <section className="container mx-auto w-full">
      <div className="w-full min-h-[206px] flex px-4 lg:px-6 py-4 lg:pb-0 lg:pt-6 relative z-10 rounded-lg">
        <Image
          src={"/community/communitybg.svg"}
          alt="background"
          fill
          className="w-full absolute inset-0 z-0  object-cover object-center"
        />
        <div className="w-full flex-1 flex flex-col h-full justify-center gap-2 z-10">
          <h2 className="text-xl font-normal text-black font-clesmont uppercase ">
            Discover The <br /> WOMEN & NON-BINARY WEB3 ECOSYSTEM.
          </h2>
          <p className="text-base leading-[140%] text-[#3D3D3D] max-w-[571px]">
            Explore popular categories
          </p>
          <div className="flex items-center gap-8 z-10 mt-5">
            <Button className="rounded-lg " variant={"secondary"}>
              Add Community
            </Button>
            <div className="text-base font-bold leading-6 flex items-center">
              <p>Info</p> <Info className="ml-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
