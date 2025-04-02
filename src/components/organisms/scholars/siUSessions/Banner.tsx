import { SectionBanner } from "@/components/molecules/banners/SectionBanner";

const data = {
  title: "SI U SCHOLARS",
  description:
    "A free introductory experience to Web3. Begin your journey into our ecosystem through education and community, with an intention towards leadership and collaboration.",
  background: "/scholars/scholarsbg.svg",
  image: "/guides/ideaslab.png",
};

export function Banner() {
  return (
    <section className="container mx-auto ">
      <SectionBanner data={data} className="max-w-[340px]" showSearch />
    </section>
  );
}
