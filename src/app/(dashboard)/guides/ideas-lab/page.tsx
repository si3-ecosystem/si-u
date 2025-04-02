import { Banner } from "@/components/organisms/ideas-lab/Banner";
import { Highlights } from "@/components/organisms/ideas-lab/Highlights";

export default function page() {
  return (
    <div className="py-8">
      <Banner />
      <Highlights />
    </div>
  );
}
