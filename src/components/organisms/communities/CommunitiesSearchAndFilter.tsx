import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface CommunitiesSearchAndFilterProps {
  search: string;
  setSearch: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  allTypes: string[];
  allLocations: string[];
}

export function CommunitiesSearchAndFilter({
  search,
  setSearch,
  type,
  setType,
  location,
  setLocation,
  allTypes,
  allLocations,
}: CommunitiesSearchAndFilterProps) {
  return (
    <section className="flex flex-col gap-8 lg:gap-11 w-full ">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 w-full max-w-[512px]">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, description, or location"
              className="w-full  h-11 rounded-full border border-gray-300 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-4">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full md:w-48 h-11 bg-white">
              <SelectValue placeholder="Community Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Community Type</SelectItem>
              {allTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full md:w-48 h-11 bg-white">
              <SelectValue placeholder="Community Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Community Location</SelectItem>
              {allLocations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
