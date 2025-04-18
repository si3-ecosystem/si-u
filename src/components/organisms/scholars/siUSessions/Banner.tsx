import { SessionBanner } from "@/components/molecules/banners/SessionBanner";
import { SessionBanner as Types } from "@/types/session";

export function Banner({
  globalFilter,
  setGlobalFilter,
  data,
}: {
  globalFilter?: string;
  setGlobalFilter?: (filter: string) => void;
  data: Types;
}) {
  return (
    <section className="w-full mx-auto ">
      <SessionBanner
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter || (() => {})}
        className="max-w-[340px]"
        showSearch
      />
    </section>
  );
}
