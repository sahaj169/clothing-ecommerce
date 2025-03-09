import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";
  const isLoading = status === "loading";

  return {
    session,
    user: session?.user,
    isAuthenticated,
    isAdmin,
    isLoading,
  };
}
