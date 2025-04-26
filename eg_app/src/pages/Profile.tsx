import { api } from "@/api/api";
import { IProfile } from "@/api/typings";
import { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState<IProfile>();
  useEffect(() => {
    const fetchProfile = async () => {
      const data = await api<IProfile>("GET", "/auth/me");

      setProfile(data);
    };
    fetchProfile();
  }, []);
  return (
    <div className="max-w-3xl mx-auto py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
      <h1>Hey {profile?.name}</h1>
    </div>
  );
}
