import { auth } from "@/lib/auth";
import HomePageView from "@/modules/home/ui/views/home-page-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  return <HomePageView />;
}
