"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface UserProfile {
  ID: string;
  Ten: string;
  CCCD: string;
  SoDienThoai: string;
  NgaySinh: string;
  GioiTinh: string;
  Email: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorUpdate, setErrorUpdate] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${Cookies.get("tokenuser")}`,
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        setProfile(data.data);
      } else {
        setError("Failed to fetch profile data");
      }
    } catch (error) {
      setError("An error occurred while fetching profile data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [API_URL]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestBody = new URLSearchParams();
    if (profile?.Ten) requestBody.append("cusName", profile.Ten);
    if (profile?.CCCD) requestBody.append("cusCitizenId", profile.CCCD);
    if (profile?.NgaySinh) requestBody.append("cusDOB", profile.NgaySinh);
    if (profile?.GioiTinh) requestBody.append("cusSex", profile.GioiTinh);
    if (profile?.Email) requestBody.append("cusEmail", profile.Email);

    try {
      const res = await fetch(`${API_URL}/auth/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${Cookies.get("tokenuser")}`,
        },
        body: requestBody.toString(),
      });
      const data = await res.json();
      if (data.status === "success") {
        setProfile(data.data);
        setIsEdit(false);
        fetchProfile();
      } else {
        setErrorUpdate(data.message);
      }
    } catch (error) {
      setError("An error occurred while updating profile data");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white w-full">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center mb-6">
          Thông tin cá nhân
        </h1>
        {profile && (
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              {isEdit ? (
                <input
                  type="text"
                  value={profile.Ten}
                  onChange={(e) =>
                    setProfile({ ...profile, Ten: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              ) : (
                <p className="mt-1 text-lg">{profile.Ten}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Citizen ID
              </label>
              {isEdit ? (
                <input
                  type="text"
                  value={profile.CCCD}
                  onChange={(e) =>
                    setProfile({ ...profile, CCCD: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              ) : (
                <p className="mt-1 text-lg">{profile.CCCD}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <p className="mt-1 text-lg">{profile.SoDienThoai}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of Birth
              </label>
              {isEdit ? (
                <input
                  type="date"
                  value={formatDate(profile.NgaySinh)}
                  onChange={(e) =>
                    setProfile({ ...profile, NgaySinh: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              ) : (
                <p className="mt-1 text-lg">
                  {profile.NgaySinh
                    ? new Date(profile.NgaySinh).toLocaleDateString()
                    : "N/A"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              {isEdit ? (
                <select
                  value={profile.GioiTinh}
                  onChange={(e) =>
                    setProfile({ ...profile, GioiTinh: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-lg">{profile.GioiTinh}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              {isEdit ? (
                <input
                  type="email"
                  value={profile.Email}
                  onChange={(e) =>
                    setProfile({ ...profile, Email: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              ) : (
                <p className="mt-1 text-lg">{profile.Email}</p>
              )}
            </div>
            {isEdit && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEdit(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Save
                </button>
              </div>
            )}
            {!isEdit && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEdit(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                >
                  Edit
                </button>
              </div>
            )}
            {errorUpdate && (
              <p className="text-red-500 text-sm mt-2">{errorUpdate}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
