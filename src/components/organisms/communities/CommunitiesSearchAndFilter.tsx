import { Community } from "@/components/molecules/cards/collabCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCommunitiesFilter } from "@/hooks/useCommunitiesFilterReturn";
import { Search } from "lucide-react";

interface CommunitiesSearchAndFilterProps {
  communities: Community[];
}

export function CommunitiesSearchAndFilter({
  communities,
}: CommunitiesSearchAndFilterProps) {
  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedLocation,
    setSelectedLocation,
    communityTypes,
    communityLocations,
  } = useCommunitiesFilter(communities);

  return (
    <section className="flex flex-col gap-8 lg:gap-11 container mx-auto w-full ">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="max-w-[512px] w-full flex py-2.5 px-3 items-center gap-3 rounded-full bg-white border border-gray-300">
            <Search className="size-6 text-gray-400" />
            <input
              type="search"
              className="w-full outline-none border-none text-gray-700 placeholder-gray-400"
              placeholder="search by name, location, description, values."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48 h-11 bg-white">
              <SelectValue placeholder="Community Type" />
            </SelectTrigger>
            <SelectContent>
              {communityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full md:w-48 h-11 bg-white">
              <SelectValue placeholder="Community Location" />
            </SelectTrigger>
            <SelectContent>
              {communityLocations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
