"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [scores, setScores] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("quiz_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setScores(data || []);
    }

    loadData();
  }, [router]);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Riwayat Latihan</h1>

      {scores.length === 0 && <p>Belum ada data.</p>}

      {scores.map((item, index) => (
        <div
          key={index}
          className="border p-4 rounded mb-3 bg-white shadow"
        >
          <p>Skor: {item.score} / {item.total_questions}</p>
          <p className="text-sm text-gray-500">
            {new Date(item.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </main>
  );
}