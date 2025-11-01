// import LandingPage from "@/components/LandingPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import LandingPage from "@/components/Landing";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Redirect if not logged in
  if (!session) {
    redirect("/login");
  }

  // Render LandingPage only for logged-in users
  return <LandingPage />;
}
