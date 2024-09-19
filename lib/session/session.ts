import { cookies } from "next/headers";
import { find, save } from "./sessionStorage";
import { SessionData } from "./types";

export const getSession = async (): Promise<{
  sessionId: string;
  data: SessionData;
} | null> => {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("session-id");

  if (sessionId?.value) {
    const session = await find(sessionId.value);

    if (session) {
      return { sessionId: sessionId.value, data: session };
    }
  }
  return null;
};

export const closeSession = async () => {
  const cookieStore = cookies();

  cookieStore.delete("session-id");
};

export const getOrCreateSession = async (): Promise<{
  sessionId: string;
  data: SessionData;
}> => {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("session-id");

  if (sessionId?.value) {
    const session = await find(sessionId.value);

    if (session) {
      return { sessionId: sessionId.value, data: session };
    }
  }

  const newSessionId = Math.random().toString(36).slice(2);
  const newSession = { currentChallenge: undefined };
  cookieStore.set("session-id", newSessionId);

  await save(newSessionId, newSession);

  return { sessionId: newSessionId, data: newSession };
};

export const saveSession = async (data: SessionData): Promise<void> => {
  const { sessionId, data: oldData } = await getOrCreateSession();

  await save(sessionId, { ...oldData, ...data });
};
