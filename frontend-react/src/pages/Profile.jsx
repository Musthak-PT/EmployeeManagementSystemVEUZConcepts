import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("accounts/profile/");
      setProfile(res.data);
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  if (!profile) {
    return (
      <div className="p-6">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded p-6 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>

        <div className="space-y-3">
          <div>
            <strong>Username:</strong> {profile.username}
          </div>

          <div>
            <strong>Email:</strong> {profile.email}
          </div>

          <div>
            <strong>User ID:</strong> {profile.id}
          </div>
        </div>
      </div>
    </div>
  );
}