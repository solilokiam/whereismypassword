import { closeSession } from "@/lib/session/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  closeSession();

  revalidatePath("/");

  redirect("/");
}
