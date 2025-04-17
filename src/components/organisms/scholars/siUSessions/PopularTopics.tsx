import { Blockchain } from "@/components/molecules/icons/Blockchain";
import { Crypto } from "@/components/molecules/icons/Crypto";
import { Defi } from "@/components/molecules/icons/Defi";
import { Nfts } from "@/components/molecules/icons/Nfts";
import { SessionCategoryCount } from "@/types/session";

interface Topic {
  icon: JSX.Element;
  title: string;
  categoryKey: string;
}

export function PopularTopics({
  categoryCounts,
}: {
  categoryCounts: SessionCategoryCount[];
}) {
  const topics: Topic[] = [
    {
      icon: <Blockchain />,
      title: "Blockchain",
      categoryKey: "blockchain",
    },
    {
      icon: <Nfts />,
      title: "NFTs",
      categoryKey: "nfts",
    },
    {
      icon: <Crypto />,
      title: "Cryptocurrency",
      categoryKey: "cryptocurrency",
    },
    {
      icon: <Defi />,
      title: "DeFi",
      categoryKey: "defi",
    },
  ];

  const getCount = (key: string) =>
    categoryCounts.find((cat) => cat.category === key)?.count || 0;

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
            <p className="text-base font-medium opacity-50">
              {getCount(item.categoryKey)} Upcoming Sessions
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
