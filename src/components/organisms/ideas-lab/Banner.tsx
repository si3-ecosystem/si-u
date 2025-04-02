import { SectionBanner } from "@/components/molecules/banners/SectionBanner";

const data = {
  title: "SI HER GUIDES",
  description:
    "Si Her is a global community of women & non-binary emerging tech leaders. In Si Her, we develop our professional and leadership potential as guides in the new economy.",
  background: "/guides/sessionBackground.svg",
  image: "/guides/ideaslab.png",
};

export function Banner() {
  return (
    <section className="container mx-auto ">
      <SectionBanner data={data} className="max-w-[340px]" />
    </section>
  );
}
