import { redirect } from "next/navigation";
import { getSessionUserFromServerCookies } from "@/lib/auth/session";

export default async function HomePage() {
  const user = await getSessionUserFromServerCookies();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "PRODUCT_ADMIN") {
    redirect("/admin/packages");
  }

  redirect("/chat");
}
