import { client } from "../client";
import { fixCardByIdQuery } from "../groq";

export async function getFixCardById(id: string) {
  if (!client) throw new Error("Sanity client not configured");
  return client.fetch(fixCardByIdQuery(id));
}
