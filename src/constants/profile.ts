export type ProfileStat = {
  label: string;
  value: number | string;
};

export type KollabItem = {
  title: string;
  description: string;
  imageSrc: string;
  isEvent?: boolean;
};

export type KollaboardItem = {
  title: string;
  organization: string;
  buttonText: string;
  buttonVariant?: "primary" | "outline";
  imageSrc: string;
};

export const profileStats: ProfileStat[] = [
  { label: "Kollabs completed", value: 12 },
  { label: "Sessions Attended", value: 11 },
  { label: "Certifications Earned", value: 5 },
];

export const kollabs: KollabItem[] = [
  {
    title: "Unlock Protocol",
    description: "Explore Unlock Protocol",
    imageSrc: "/frame1.png",
  },
  // {
  //   title: "Consensus with Coindesk",
  //   description: "Attend the crypto most influential event!",
  //   imageSrc: "/frame2.png",
  //   isEvent: true,
  // },
  // {
  //   title: "Open Campus",
  //   description: "Start your OC journey",
  //   imageSrc: "/frame3.png",
  // },
];

export const suggestedKollaboards: KollaboardItem[] = [
  {
    title: "Web3 Natives: LATAM",
    organization: "By SI<3>",
    buttonText: "View",
    imageSrc: "/frame11.png",
  },
  {
    title: "Missing Links",
    organization: "By ApeCoin x SI<3>",
    buttonText: "Apply",
    imageSrc: "/frame15.png",
  },
  {
    title: "Emerging Tech Fest",
    organization: "By CONFUSION&JOY",
    buttonText: "Kollab",
    buttonVariant: "primary",
    imageSrc: "/frame13.png",
  },
];
