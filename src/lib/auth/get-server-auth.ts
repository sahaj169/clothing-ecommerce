import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";

export async function getServerAuth() {
  const session = await getServerSession(authOptions);

  return {
    user: session?.user || null,
    isAuthenticated: !!session?.user,
    isAdmin: session?.user?.role === "ADMIN",
  };
}
