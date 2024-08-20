import { kv } from "@vercel/kv";
import { SessionData } from "./types";

const sessionPrefix = "where-is-my-password-session-";

export const find = async (id: string) => {
  return kv.get<SessionData>(`${sessionPrefix}${id}`);
};

export const save = async (id: string, data: SessionData) => {
  return kv.set(`${sessionPrefix}${id}`, JSON.stringify(data));
};
