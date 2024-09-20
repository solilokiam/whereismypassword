"use server";

import { closeSession } from "@/lib/session/session";
import { revalidatePath } from "next/cache";

export async function logout() {
  closeSession();

  revalidatePath("/");
}
