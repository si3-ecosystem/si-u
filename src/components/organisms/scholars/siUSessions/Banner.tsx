import { SectionBanner } from "@/components/molecules/banners/SectionBanner";

const data = {
  title: "SI U SCHOLARS",
  description:
    "A free introductory experience to Web3. Begin your journey into our ecosystem through education and community, with an intention towards leadership and collaboration.",
  background: "/scholars/scholarsbg.svg",
  image: "/guides/ideaslab.png",
};

export function Banner({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter?: string;
  setGlobalFilter?: (filter: string) => void;
}) {
  return (
    <section className="w-full mx-auto ">
      <SectionBanner
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter || (() => {})}
        className="max-w-[340px]"
        showSearch
      />
    </section>
  );
}
