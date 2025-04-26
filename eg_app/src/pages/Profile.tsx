import { api } from "@/api/api";
import { IProfile } from "@/api/typings";
import { User } from "@/components/User";
import { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState<IProfile>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api<IProfile>("GET", "/auth/me");
        setProfile(data);
      } catch (error) {
        let message = "error loading profile";
        if (error instanceof Error) {
          message = error.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
      {loading ? <p>loading...</p> : error ? <p>{error}</p> : profile ? <User {...profile} /> : null}
    </div>
  );
}
