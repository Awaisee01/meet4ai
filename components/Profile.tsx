"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface UserProfile {
  name: string;
  email: string;
  image?: string | null;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<UserProfile>({ name: "", email: "" });
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch latest user info
  const fetchUser = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch("/api/profile", { method: "GET" });
      const data = await res.json();
      if (res.ok) {
        setUser({ name: data.user.name, email: data.user.email });
        setImage(data.user.image || null);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user) fetchUser();
  }, [session, status, router]);

  if (status === "loading")
    return (
  <div className="flex items-center justify-center h-screen bg-purple-50">
    <div className="flex flex-col items-center">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-purple-700 text-lg">Loading profile...</p>
    </div>
  </div>
);


  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    setMessage("");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64String = reader.result as string;

      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64String }),
        });
        const data = await res.json();
        if (res.ok) {
          setImage(data.image);
          setMessage("Profile updated successfully!");
        } else {
          setMessage(data.error || "Failed to update profile.");
        }
      } catch {
        setMessage("Something went wrong.");
      } finally {
        setSaving(false);
      }
    };
  };

  return (
    <div className=" pt-10 sm:pt-28 min-h-screen bg-purple-50 sm:flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          Your Profile
        </h1>

        <div className="flex flex-col items-center mb-6">
          <div
            className="w-28 h-28 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-4xl font-bold mb-3 border-4 border-purple-300 cursor-pointer hover:scale-105 transition-transform overflow-hidden "
            onClick={triggerFileSelect}
          >
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              user.name?.[0] || "U"
            )}

            {saving && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-sm">
                Uploading...
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-gray-600 text-sm">Name</label>
          <input
            type="text"
            value={user.name}
            disabled
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-50"
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-600 text-sm">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-50"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-full border border-purple-600 text-purple-700 py-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
