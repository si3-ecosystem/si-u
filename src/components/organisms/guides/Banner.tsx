import { GuidesBanner } from "@/components/molecules/banners/GuidesBanner";
import { GuidesSessionBanner } from "@/types/siherguides/session";

export function Banner({ data }: { data: GuidesSessionBanner }) {
  return (
    <section className="container mx-auto ">
      <GuidesBanner data={data} />
    </section>
  );
}
