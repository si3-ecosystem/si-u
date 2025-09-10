// export interface CreateRoomResponse {
//   roomId: string;
//   roomUrl?: string;
// }

// const HUDDLE_BASE = process.env.HUDDLE_API_BASE || "https://api.huddle01.com";

// function getApiKey(): string {
//   const key = process.env.HUDDLE_API_KEY;
//   if (!key) throw new Error("Missing HUDDLE_API_KEY env var");
//   return key;
// }

// export async function createTestRoom(): Promise<CreateRoomResponse> {
//   const apiKey = getApiKey();
//   const response = await fetch(`${HUDDLE_BASE}/api/v1/create-room`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": apiKey,
//     },
//     body: JSON.stringify({
//       title: "SI-U Test NFT-Gated Livestream",
//       hostWallets: [],
//       roomLocked: false,
//     }),
//   });
//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data?.message || "Failed to create Huddle01 room");
//   }
//   return { roomId: data?.data?.roomId || data?.roomId, roomUrl: data?.data?.roomUrl || data?.roomUrl };
// }




export interface CreateRoomResponse {
  roomId: string;
  roomUrl?: string;
}

const HUDDLE_BASE = process.env.HUDDLE_API_BASE || "https://api.huddle01.com";

function getApiKey(): string {
  const key = process.env.HUDDLE_API_KEY;
  if (!key) throw new Error("Missing HUDDLE_API_KEY env var");
  return key;
}

export async function createTestRoom(): Promise<CreateRoomResponse> {
  const apiKey = getApiKey();
  const response = await fetch(`${HUDDLE_BASE}/api/v2/sdk/rooms/create-room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      title: "SI-U Test NFT-Gated Livestream",
      hostWallets: [],
      roomLocked: false,
    }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to create Huddle01 room");
  }
  
  return { 
    roomId: data?.data?.roomId || data?.roomId, 
    roomUrl: data?.data?.roomUrl || data?.roomUrl 
  };
}