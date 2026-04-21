"use client";

export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import quranData from "@/dataset/quran.json";

export default function ModePage() {
  const params = useSearchParams();
  const router = useRouter();

  const type = params.get("type");

  const surahs = quranData as any[];

  // MODE SURAH STATE
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [startAyat, setStartAyat] = useState(1);
  const [endAyat, setEndAyat] = useState(7);

  // MODE JUZ STATE
  const [startJuz, setStartJuz] = useState(1);
  const [endJuz, setEndJuz] = useState(30);

  // COMMON STATE
  const [total, setTotal] = useState(5);

  const currentSurah = surahs.find(
    (s) => s.id === selectedSurah
  );

  function startQuizSurah() {
    if (startAyat > endAyat) {
      alert("Range ayat tidak valid");
      return;
    }

    router.push(
      `/quiz?type=surah&surah=${selectedSurah}&start=${startAyat}&end=${endAyat}&total=${total}`
    );
  }

  function startQuizJuz() {
    if (startJuz > endJuz) {
      alert("Range juz tidak valid");
      return;
    }

    router.push(
      `/quiz?type=juz&start=${startJuz}&end=${endJuz}&total=${total}`
    );
  }

  /**
   * MODE SURAH
   */
if (type === "surah") {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">

      
      <h1 className="text-2xl font-bold mb-6">
        Mode Latihan: Per Surat
      </h1>

      {/* SELECT SURAH */}
      <label className="mb-1">
        Pilih Surat
      </label>

      <select
        value={selectedSurah}
        onChange={(e) => {
          const surahId = Number(e.target.value);
          const surah = surahs.find(
            (s) => s.id === surahId
          );

          setSelectedSurah(surahId);
          setStartAyat(1);
          setEndAyat(surah.total_verses);
        }}
        className="border p-2 mb-4"
      >
        {surahs.map((surah) => (
          <option
            key={surah.id}
            value={surah.id}
          >
            {surah.id}. {surah.transliteration}
          </option>
        ))}
      </select>

      {/* AYAT RANGE */}
      <label>Dari Ayat</label>

      <input
        type="number"
        min={1}
        max={currentSurah.total_verses}
        value={startAyat}
        onChange={(e) =>
          setStartAyat(Number(e.target.value))
        }
        className="border p-2 mb-3"
      />

      <label>Sampai Ayat</label>

      <input
        type="number"
        min={1}
        max={currentSurah.total_verses}
        value={endAyat}
        onChange={(e) =>
          setEndAyat(Number(e.target.value))
        }
        className="border p-2 mb-4"
      />

      {/* TOTAL QUESTIONS */}
      <label>Jumlah Soal</label>

      <input
        type="number"
        min={1}
        max={50}
        value={total}
        onChange={(e) =>
          setTotal(Number(e.target.value))
        }
        className="border p-2 mb-6"
      />

      <button
        onClick={startQuizSurah}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Mulai Latihan
      </button>

    </main>
  );
}

  /**
   * MODE JUZ
   */
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">

      <h1 className="text-2xl font-bold mb-6">
        Mode Latihan: Per Juz
      </h1>

      {/* RANGE JUZ */}
      <label>Dari Juz</label>

      <input
        type="number"
        min={1}
        max={30}
        value={startJuz}
        onChange={(e) =>
          setStartJuz(Number(e.target.value))
        }
        className="border p-2 mb-3"
      />

      <label>Sampai Juz</label>

      <input
        type="number"
        min={1}
        max={30}
        value={endJuz}
        onChange={(e) =>
          setEndJuz(Number(e.target.value))
        }
        className="border p-2 mb-4"
      />

      {/* JUMLAH SOAL */}
      <label>Jumlah Soal</label>

      <input
        type="number"
        min={1}
        max={50}
        value={total}
        onChange={(e) =>
          setTotal(Number(e.target.value))
        }
        className="border p-2 mb-6"
      />

      <button
        onClick={startQuizJuz}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Mulai Latihan
      </button>

    </main>
  );
}