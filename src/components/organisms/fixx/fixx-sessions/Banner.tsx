import { SectionBanner } from "@/components/molecules/banners/SectionBanner";

export function Banner({ data }: { data: any }) {
  return (
    <section className="w-full ">
      <SectionBanner data={data} setGlobalFilter={() => {}} globalFilter="" />
    </section>
  );
}
