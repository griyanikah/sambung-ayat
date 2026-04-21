"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import quranData from "@/dataset/quran.json";

function getSurahName(id: number) {
  const surah = (quranData as any[]).find(
    (s) => s.id === id
  );

  return surah?.transliteration ?? "-";
}

type Score = {
  id: string;
  score: number;
  total: number | null;
  created_at: string;

  mode: "surah" | "juz" | "range" | string;

  surah_id?: number | null;
  juz?: number | null;

  start_range?: number | null;
  end_range?: number | null;

  difficulty?: string | null;
};

export default function DashboardPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadScores() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("quiz_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setScores(data as Score[]);
    }

    loadScores();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">
        Riwayat Skor Kamu
      </h1>

      {scores.length === 0 && (
        <p>Belum ada latihan yang tersimpan.</p>
      )}

      {scores.map((item) => (
        <div
          key={item.id}
          className="bg-white p-4 rounded shadow mb-3"
        >
          <p className="font-semibold">
            Skor: {item.score}
          </p>

          <p className="text-sm">
            Mode: {item.mode}
          </p>

          {item.mode === "surah" && item.surah_id && (
            <p className="text-sm">
              Surat: {getSurahName(item.surah_id)}
            </p>
          )}

          {item.mode === "juz" && item.juz && (
            <p className="text-sm">
              Juz: {item.juz}
            </p>
          )}

          {(item.start_range ?? null) !== null &&
            (item.end_range ?? null) !== null && (
              <p className="text-sm">
                Range: {item.start_range} - {item.end_range}
              </p>
            )}

          {item.difficulty && (
            <p className="text-sm">
              Level: {item.difficulty}
            </p>
          )}

          <p className="text-xs text-gray-500">
            {new Date(item.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </main>
  );
}