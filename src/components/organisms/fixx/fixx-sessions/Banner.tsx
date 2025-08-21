import { SectionBanner } from "@/components/molecules/banners/SectionBanner";

interface BannerProps {
  data: any;
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
}

export function Banner({ data, globalFilter = "", setGlobalFilter = () => {} }: BannerProps) {
  return (
    <section className="w-full ">
      <SectionBanner
        data={data}
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
      />
    </section>
  );
}
