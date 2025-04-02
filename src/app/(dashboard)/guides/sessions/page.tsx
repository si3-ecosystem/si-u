import { Banner } from "@/components/organisms/guides/Banner";
import WorkShops from "@/components/organisms/guides/workShops";

export default function page() {
  return (
    <div className="py-8">
      <Banner />
      <WorkShops />
    </div>
  );
}
