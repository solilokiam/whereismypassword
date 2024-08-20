import { kv } from "@vercel/kv";
import { User, UserDevice } from "./types";

const userPrefix = "nextjs-webauthn-example-user-";

export const find = async (email: string): Promise<User | null> => {
  const user = await kv.get<User>(`${userPrefix}${email}`);

  return user;
};

export const create = async (
  email: string,
  devices: UserDevice[]
): Promise<User> => {
  const user = await find(email);

  if (user) {
    throw new Error("User already exists");
  }

  await kv.set(`${userPrefix}${email}`, { email, devices });
  return { email, devices };
};
