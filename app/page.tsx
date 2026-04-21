"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("username, role")
          .eq("id", user.id)
          .single();

      if (!profileError && profile) {
        setUsername(profile.username ?? "user");
        setRole(profile.role ?? "free");
      }

      setLoading(false);
    }

    checkUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Memuat halaman... ⏳
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center">

      {/* HEADER */}
      <div className="absolute top-5 right-5 flex items-center gap-3 text-sm">

        <span>
          👤 <b>{username}</b> ({role})
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-4">
        Sambung Ayat
      </h1>

      <p className="mb-6">
        Pilih mode latihan 📖
      </p>

      <div className="flex gap-4">

        <button
          onClick={() => router.push("/mode?type=juz")}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Latihan per Juz
        </button>

        <button
          onClick={() => router.push("/mode?type=surah")}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Latihan per Surat
        </button>

      </div>
    </main>
  );
}