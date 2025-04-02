import { SectionBanner } from "@/components/molecules/banners/SectionBanner";

const data = {
  title: "FIXX SEASON 1",
  description:
    "FIXX (Financial Inclusion XX Chromosomes) is a program with education on how to improve financial inclusion within Web3.",
  background: "/guides/sessionBackground.svg",
  image: "/placeholder.png",
};

export function Banner() {
  return (
    <section className="container mx-auto w-full ">
      <SectionBanner data={data} />
    </section>
  );
}
