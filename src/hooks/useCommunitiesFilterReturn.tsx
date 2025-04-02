import { Community } from "@/components/molecules/cards/collabCard";
import { useState } from "react";

const communityTypes = [
  { value: "all", label: "All Types" },
  { value: "Women & Non-Binary", label: "Women & Non-Binary" },
  { value: "Education", label: "Education" },
];

const communityLocations = [
  { value: "all", label: "All Locations" },
  { value: "Global", label: "Global" },
];

interface UseCommunitiesFilterReturn {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  filteredCommunities: Community[];
  communityTypes: { value: string; label: string }[];
  communityLocations: { value: string; label: string }[];
}

export function useCommunitiesFilter(
  communities: Community[]
): UseCommunitiesFilterReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.communityName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      community.communityDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      community.communityLocation
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      community.communityType.some((type) =>
        type.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType =
      selectedType === "all" || community.communityType.includes(selectedType);

    const matchesLocation =
      selectedLocation === "all" ||
      community.communityLocation === selectedLocation;

    return matchesSearch && matchesType && matchesLocation;
  });

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedLocation,
    setSelectedLocation,
    filteredCommunities,
    communityTypes,
    communityLocations,
  };
}
