import { api } from "@/api/api";
import { useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    async function performLogout() {
      logout();

      try {
        await api<void>("GET", "/auth/logout", {}, false);
      } catch (error) {
        console.error("Logout API error", error);
      }
    }

    performLogout();
  }, []);

  return (
    <div className="flex items-center justify-center h-[50vh]">
      <h1 className="text-2xl font-bold">You have been logged out.</h1>
    </div>
  );
}
