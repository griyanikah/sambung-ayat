"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import quranData from "@/dataset/quran.json";

export default function LeaderboardPage() {

  const [mode, setMode] = useState("global");
  const [data, setData] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState(105);
  const [selectedJuz, setSelectedJuz] = useState(30);

  useEffect(() => {

    async function loadLeaderboard() {

      let query: any;

      if (mode === "global") {

        query = supabase
          .from("leaderboard_cache")
          .select(`
            total_score,
            profiles(username)
          `)
          .order("total_score", { ascending: false });

      }

      else if (mode === "weekly") {

        query = supabase
          .from("leaderboard_cache")
          .select(`
            weekly_score,
            profiles(username)
          `)
          .order("weekly_score", { ascending: false });

      }

      else if (mode === "monthly") {

        query = supabase
          .from("leaderboard_cache")
          .select(`
            monthly_score,
            profiles(username)
          `)
          .order("monthly_score", { ascending: false });

      }

      else if (mode === "surah") {

        query = supabase
          .from("leaderboard_surah_cache")
          .select(`
            total_score,
            profiles(username)
          `)
          .eq("surah_id", selectedSurah)
          .order("total_score", { ascending: false });

      }

      else if (mode === "juz") {

        query = supabase
          .from("leaderboard_juz_cache")
          .select(`
            total_score,
            profiles(username)
          `)
          .eq("juz", selectedJuz)
          .order("total_score", { ascending: false });

      }

      const { data, error } = await query.limit(20);

      if (error) {
        console.error("Supabase error:", error.message);
        return;
      }

      setData(data || []);
    }

    loadLeaderboard();

  }, [mode, selectedSurah, selectedJuz]);


  return (
    <main className="p-6">

      <h1 className="text-3xl font-bold mb-4">
        🏆 Leaderboard
      </h1>


      {/* BUTTON MODE */}
      <div className="flex gap-3 mb-4 flex-wrap">

        <button
          onClick={() => setMode("global")}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          Global
        </button>

        <button
          onClick={() => setMode("weekly")}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Mingguan
        </button>

        <button
          onClick={() => setMode("monthly")}
          className="bg-purple-600 text-white px-3 py-1 rounded"
        >
          Bulanan
        </button>

        <button
          onClick={() => setMode("surah")}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Per Surat
        </button>

        <button
          onClick={() => setMode("juz")}
          className="bg-yellow-600 text-white px-3 py-1 rounded"
        >
          Per Juz
        </button>

      </div>


      {/* DROPDOWN SURAH */}
      {mode === "surah" && (
        <div className="mb-4">

          <select
            value={selectedSurah}
            onChange={(e) =>
              setSelectedSurah(Number(e.target.value))
            }
            className="border p-2 rounded"
          >
            {quranData.map((surah: any) => (
              <option key={surah.id} value={surah.id}>
                {surah.transliteration} ({surah.name})
              </option>
            ))}
          </select>

          <p className="text-sm text-gray-500 mt-1">
            Menampilkan skor {
              quranData.find((s: any) => s.id === selectedSurah)?.transliteration
            }
          </p>

        </div>
      )}


      {/* DROPDOWN JUZ */}
      {mode === "juz" && (
        <div className="mb-4">

          <select
            value={selectedJuz}
            onChange={(e) =>
              setSelectedJuz(Number(e.target.value))
            }
            className="border p-2 rounded"
          >
            {[...Array(30)].map((_, i) => (
              <option key={i} value={i + 1}>
                Juz {i + 1}
              </option>
            ))}
          </select>

          <p className="text-sm text-gray-500 mt-1">
            Menampilkan skor Juz {selectedJuz}
          </p>

        </div>
      )}


      {/* LIST DATA */}
      {data.length === 0 && (
        <p className="text-gray-500">
          Belum ada data leaderboard.
        </p>
      )}

      {data.map((item, i) => (

        <div
          key={i}
          className="bg-white shadow rounded p-3 mb-2 flex justify-between"
        >

          <span>
            {i + 1}.{" "}
            {item.profiles?.username ??
             item.username ??
             "Unknown"}
          </span>

          <span>
            {item.total_score ??
             item.weekly_score ??
             item.monthly_score ??
             0}
          </span>

        </div>

      ))}

    </main>
  );
}