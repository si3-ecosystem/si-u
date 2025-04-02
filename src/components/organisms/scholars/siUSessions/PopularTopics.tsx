import { Blockchain } from "@/components/molecules/icons/Blockchain";
import { Crypto } from "@/components/molecules/icons/Crypto";
import { Defi } from "@/components/molecules/icons/Defi";
import { Nfts } from "@/components/molecules/icons/Nfts";

const topics = [
  {
    icon: <Blockchain />,
    title: "Blockchain",
    info: "04 Upcoming Sessions",
  },
  {
    icon: <Nfts />,
    title: "NFT's",
    info: "12 Upcoming Sessions",
  },
  {
    icon: <Crypto />,
    title: "Cryptocurrency",
    info: " 12 Upcoming Sessions",
  },
  {
    icon: <Defi />,
    title: "DeFi",
    info: "4 Upcoming Sessions",
  },
];

export function PopularTopics() {
  return (
    <div>
      <h2 className="text-black text-xl lg:text-2xl font-medium mb-2">
        Popular Topics
      </h2>
      <p className="text-brandGray text-base leading-[140%] font-normal mb-4">
        Explore popular categories
      </p>
      <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide md:overflow-x-visible no-scrollbar gap-6">
        {topics.map((item, key) => (
          <div
            key={key}
            className="flex flex-col gap-3 p-4 max-w-[228px] w-full rounded-lg bg-white"
          >
            <div>{item.icon}</div>
            <h3 className="text-xl font-medium leading-6 text-black">
              {item.title}
            </h3>
            <p className="text-base font-medium opacity-50">{item.info}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
