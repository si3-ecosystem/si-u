import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ContentState } from "@/utils/types";

const initialState: ContentState = {
  landing: {
    fullName: "Kara Howard",
    title: "SI<3> Founder",
    headline: "& I create equitable platforms for the new economy.",
    hashTags: [
      "collaboration",
      "inclusivity",
      "impact",
      "transparency",
      "acessibility",
    ],
    region: "North America",
    organizationAffiliations: ["Si<3>"],
    communityAffiliations: ["Si Her", "BitQueens"],
    superPowers: ["Empathy", "Focus", "Leaps of Faith"],
    image:
      "https://res.cloudinary.com/dv52zu7pu/image/upload/v1751386821/girl_ainxhw.png",
    pronoun: "SHE/HER",
  },
  slider: [
    "focussed pathways",
    "economic freedom",
    "human potential",
    "collaborative growth",
  ],
  value: {
    experience:
      "My professional experience includes twelve years of womxn-in-tech community leadership and fifteen years in growth and partnerships in emerging technology. I am a strong ecosystem builder and connecter, and enjoy creating collaborative value with community networks and product integrations. I am values-driven in my personal and professional lives, and maintain a solid connection to my inner guidance system as I navigate the complexities of creating value in the new economy.",
    values:
      "My vision is for humanity to reach its greatest potential. This includes equitable and accessible financial systems created with care, emotional intelligence, and compassion. I envision an acceleration of feminine intelligence and underrepresented voices reaching new heights of leadership. I believe we will experience in our lifetimes profound growth in our abilities and capacities as humans, and I am hopeful for the end of centralized power structures that limit that potential.",
  },
  live: {
    image:
      "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363967/livemedia_turqfv.png",
    url: "https://res.cloudinary.com/dv52zu7pu/video/upload/v1751386825/vid_vxw5em.mp4",
    walletUrl:
      "https://pb.aurpay.net/pb/page/html/paymentbutton.html?token=pb_plugin_link_token_h6hzBGgZzFW1G5eO",
    details: [
      {
        title: "SI<3>",
        heading: "SI<3>'s Mission",
        url: "https://www.si3.space",
      },
      {
        title: "Wirex Podcast",
        heading: "How True is Web3's Commitment to Diversity and Inclusion",
        url: "https://www.youtube.com",
      },
      {
        title: "EcstaSHE LinkedIn Live",
        heading: "Fundraising in Web3: Summer Edition",
        url: "https://www.podcast.com",
      },
    ],
  },
  organizations: [
    "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363966/unlock_nrtdlk.png",
    "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363966/dune_n4xvii.png",
    "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363967/zerion_sjjw6q.png",
    "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363966/stellar_luopdr.png",
    "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363966/ledger_umjp3a.png",
  ],
  timeline: [
    {
      title: "Co-Creating SI<3>",
      to: "PRESENT",
      from: "2023",
    },
    {
      title: "Personal Development Retreat",
      to: "",
      from: "2022",
    },
    {
      title: "Managed the Feminine Intelligence",
      to: "2021",
      from: "2017",
    },
    {
      title: "VP of Growth & Partnerships at Clevertap",
      to: "2019",
      from: "2015",
    },
    {
      title: "MBA from NYU Stern & Marketing Entrepreneurship",
      to: "",
      from: "2025",
    },
    {
      title: "BSC from UW Madison - Personal Finance",
      to: "",
      from: "2004",
    },
    {
      title: "Equity Research Associate / Financial Analyst",
      to: "2010",
      from: "2002",
    },
  ],
  available: {
    avatar:
      "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363968/available_nzy4gl.png",
    availableFor: ["collaboration", "advising", "speaking"],
    ctaText: "Join SI<3>",
    ctaUrl: "https://www.si3.space",
  },
  socialChannels: [
    {
      icon: "https://res.cloudinary.com/dv52zu7pu/image/upload/v1751386798/LinkedIn_mrnvct.svg",
      url: "https://www.linkedin.com",
    },
    {
      icon: "https://res.cloudinary.com/dv52zu7pu/image/upload/v1751386821/Instagram_qpdoa3.svg",
      url: "https://www.instagram.com",
    },
    {
      icon: "https://res.cloudinary.com/dv52zu7pu/image/upload/v1751386803/Twitter_btmxyb.svg",
      url: "https://twitter.com",
    },
  ],
  isNewWebpage: true,
  domain: "",
  versionUpdated: false,
  version: 1,
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setAllContent: (state, action: PayloadAction<ContentState>) => {
      // Merge with existing state instead of replacing completely
      const newContent = action.payload;

      // Helper function to check if object has meaningful data
      const hasObjectData = (obj: any) => {
        if (!obj || typeof obj !== "object") return false;
        const keys = Object.keys(obj);
        if (keys.length === 0) return false;

        // Check if any value has meaningful content
        return keys.some((key) => {
          const value = obj[key];
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === "string") return value.trim() !== "";
          return value !== null && value !== undefined;
        });
      };

      // Helper function to check if array has meaningful data
      const hasArrayData = (arr: any) => Array.isArray(arr) && arr.length > 0;

      // Helper function to safely merge objects
      const safeMergeObject = (target: any, source: any) => {
        if (!hasObjectData(source)) return target;
        return { ...target, ...source };
      };

      // Only update fields that have actual data, otherwise keep existing state
      if (hasObjectData(newContent.landing)) {
        state.landing = safeMergeObject(state.landing, newContent.landing);
      }
      if (hasArrayData(newContent.slider)) {
        state.slider = newContent.slider;
      }
      if (hasObjectData(newContent.value)) {
        state.value = safeMergeObject(state.value, newContent.value);
      }
      if (hasObjectData(newContent.live)) {
        state.live = safeMergeObject(state.live, newContent.live);
      }
      if (hasArrayData(newContent.organizations)) {
        state.organizations = newContent.organizations;
      }
      if (hasArrayData(newContent.timeline)) {
        state.timeline = newContent.timeline;
      }
      if (hasObjectData(newContent.available)) {
        state.available = safeMergeObject(
          state.available,
          newContent.available
        );
      }
      if (hasArrayData(newContent.socialChannels)) {
        state.socialChannels = newContent.socialChannels;
      }
      if (typeof newContent.isNewWebpage === "boolean") {
        state.isNewWebpage = newContent.isNewWebpage;
      }
      if (newContent.domain && newContent.domain.trim() !== "") {
        (state as any).domain = newContent.domain;
      }
      if (typeof newContent.versionUpdated === "boolean") {
        state.versionUpdated = newContent.versionUpdated;
      }
      if (typeof newContent.version === "number") {
        state.version = newContent.version;
      }
    },
    updateContent: (
      state,
      action: PayloadAction<{ section: keyof ContentState; data: any }>
    ) => {
      const { section, data } = action.payload;
      if (section === "isNewWebpage" && typeof data === "boolean") {
        state.isNewWebpage = data;
        return;
      }
      if (section === "domain") {
        (state as any).domain = typeof data === "string" ? data : "";
        return;
      }
      if (section === "versionUpdated" && typeof data === "boolean") {
        console.log('[contentSlice] Updating versionUpdated from', state.versionUpdated, 'to', data);
        state.versionUpdated = data;
        return;
      }
      if (section === "version" && typeof data === "number") {
        state.version = data;
        return;
      }
      if (!state[section]) {
        console.error(`Invalid section: ${section}`);
        return;
      }
      if (Array.isArray(state[section])) {
        state[section] = data;
      } else if (
        typeof state[section] === "object" &&
        data !== null &&
        typeof data === "object"
      ) {
        Object.keys(data).forEach((key) => {
          (state[section] as any)[key] = data[key];
        });
      }
    },
    updateArrayItem: (
      state,
      action: PayloadAction<{
        section: keyof ContentState;
        fieldName: string;
        index: number;
        value: any;
      }>
    ) => {
      const { section, fieldName, index, value } = action.payload;
      if (!state[section] || typeof state[section] !== "object") {
        console.error(`Invalid section: ${section}`);
        return;
      }
      const field = (state[section] as any)[fieldName];
      if (!Array.isArray(field)) {
        console.error(
          `Field ${fieldName} is not an array in section ${section}`
        );
        return;
      }
      if (index < 0 || index >= field.length) {
        console.error(
          `Invalid index ${index} for array with length ${field.length}`
        );
        return;
      }
      field[index] = value;
    },
    addArrayItem: (
      state,
      action: PayloadAction<{
        section: keyof ContentState;
        fieldName: string;
        value: any;
      }>
    ) => {
      const { section, fieldName, value } = action.payload;
      if (!state[section] || typeof state[section] !== "object") {
        console.error(`Invalid section: ${section}`);
        return;
      }
      const field = (state[section] as any)[fieldName];
      if (!Array.isArray(field)) {
        console.error(
          `Field ${fieldName} is not an array in section ${section}`
        );
        return;
      }
      field.push(value);
    },
    removeArrayItem: (
      state,
      action: PayloadAction<{
        section: keyof ContentState;
        fieldName: string;
        index: number;
      }>
    ) => {
      const { section, fieldName, index } = action.payload;
      if (!state[section] || typeof state[section] !== "object") {
        console.error(`Invalid section: ${section}`);
        return;
      }
      const field = (state[section] as any)[fieldName];
      if (!Array.isArray(field)) {
        console.error(
          `Field ${fieldName} is not an array in section ${section}`
        );
        return;
      }
      if (index < 0 || index >= field.length) {
        console.error(
          `Invalid index ${index} for array with length ${field.length}`
        );
        return;
      }
      field.splice(index, 1);
    },
    clearContent: () => initialState,
    setDomain: (state, action: PayloadAction<string | undefined>) => {
      (state as any).domain = action.payload ?? "";
    },
    setIsNewWebpage: (state, action: PayloadAction<boolean>) => {
      state.isNewWebpage = action.payload;
    },
    setVersionUpdatedFalse: (state) => {
      console.log('[contentSlice] Setting versionUpdated to false');
      state.versionUpdated = false;
    },
  },
});

export const {
  setAllContent,
  updateContent,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  clearContent,
  setDomain,
  setIsNewWebpage,
  setVersionUpdatedFalse,
} = contentSlice.actions;

export default contentSlice.reducer;
