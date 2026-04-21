"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { playVerseAudio } from "@/lib/playVerseAudio";
import {
  getRandomQuestionJuz30,
  getQuestionByRange,
} from "@/lib/quizEngine";
import { useSearchParams } from "next/navigation";

/**
 * Difficulty calculator
 */
function getDifficultyLevel(verseText: string) {
  const length = verseText.length;

  if (length <= 40) {
    return { level: "Pemula", multiplier: 1 };
  }

  if (length <= 90) {
    return { level: "Intermediate", multiplier: 2 };
  }

  return { level: "Pro", multiplier: 3 };
}

/**
 * Promo mode (aktif = free semua fitur)
 */
const PROMO_MODE = true;

export default function QuizPage() {
  const params = useSearchParams();

  const rawType = params.get("type");

  const type =
    rawType === "surah"
      ? "surah"
      : "juz";

  const surah =
    Number(params.get("surah")) || undefined;

  const start =
    Number(params.get("start") ?? 1);

  const end =
    Number(params.get("end") ?? 30);

  const requestedQuestions =
  Number(params.get("total") ?? 5);

    const totalQuestions =
      type === "surah"
        ? Math.min(
            requestedQuestions,
            end - start
          )
        : requestedQuestions;
  
        useEffect(() => {
  if (
    type === "surah" &&
    requestedQuestions > end - start
  ) {
    alert(
      `Jumlah soal otomatis disesuaikan menjadi ${
        end - start
      } karena range ayat terlalu pendek.`
    );
  }
}, []);

  const FREE_LIMIT = 5;

  const [role, setRole] =
    useState("free");

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const [score, setScore] =
    useState(0);

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState<any>(null);

  const [showResult, setShowResult] =
    useState(false);

  const [isBlocked, setIsBlocked] =
    useState(false);

  /**
   * Play audio soal
   */
  function playAudio() {
    if (!currentQuestion) return;

    playVerseAudio(
      currentQuestion.surahId,
      currentQuestion.question.id
    );
  }

  /**
   * Engine selector soal
   */
  function pickQuestion(userRole: string) {
    if (PROMO_MODE)
      return getQuestionByRange(
        type,
        start,
        end,
        surah
      );

    if (userRole === "premium")
      return getQuestionByRange(
        type,
        start,
        end,
        surah
      );

    return getRandomQuestionJuz30();
  }

  /**
   * Load role + first question
   */
  useEffect(() => {
    async function loadUserRole() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setCurrentQuestion(
          pickQuestion("free")
        );
        return;
      }

      const { data } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

      const userRole =
        data?.role ?? "free";

      setRole(userRole);

      setCurrentQuestion(
        pickQuestion(userRole)
      );
    }

    loadUserRole();
  }, [type, start, end, surah]);

  /**
   * Free limit checker
   */
  useEffect(() => {
    async function checkLimit() {
      if (PROMO_MODE) return;

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (user) return;

      const playCount =
        Number(
          localStorage.getItem(
            "playCount"
          ) ?? 0
        );

      if (playCount >= FREE_LIMIT)
        setIsBlocked(true);
    }

    checkLimit();
  }, []);

  /**
   * SAVE SCORE (VERSI LENGKAP UNTUK HISTORY + LEADERBOARD)
   */
  async function saveScore(
    finalScore: number,
    difficultyLevel: string
  ) {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      console.log(
        "User belum login"
      );
      return;
    }

    const insertData = {
      user_id: user.id,
      score: finalScore,
      total: totalQuestions,

      mode: type ?? "global",

      start_range: start ?? null,
      end_range: end ?? null,

      surah_id:
        type === "surah"
          ? surah
          : null,

      juz:
        type === "juz"
          ? start
          : null,

      difficulty:
        difficultyLevel,
    };

    const { error } =
      await supabase
        .from("quiz_progress")
        .insert(insertData);

    if (error) {
      console.error(
        "Insert gagal:",
        error.message
      );
    } else {
      console.log(
        "Score tersimpan:",
        insertData
      );
    }
  }

  /**
   * Handle answer
   */
  async function handleAnswer(
    answerText: string
  ) {
    if (!currentQuestion) return;

    let newScore = score;

    if (
      answerText ===
      currentQuestion.correctAnswer.text
    ) {
      const difficulty =
        getDifficultyLevel(
          currentQuestion
            .correctAnswer.text
        );

      let multiplier = difficulty.multiplier;

        // penalti range pendek
        if (currentQuestion.verseRangeSize <= 3)
          multiplier *= 0.5;

        if (currentQuestion.verseRangeSize <= 2)
          multiplier *= 0.5;

        newScore += multiplier;

      setScore(newScore);
    }

    const nextIndex =
      currentQuestionIndex + 1;

    if (
      nextIndex < totalQuestions
    ) {
      setCurrentQuestionIndex(
        nextIndex
      );

      const q = pickQuestion(role);

        if (!q) {
          alert("Range ayat terlalu sempit. Minimal 2 ayat.");
          return;
        }

        setCurrentQuestion(q);

      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (
      !user &&
      !PROMO_MODE
    ) {
      const playCount =
        Number(
          localStorage.getItem(
            "playCount"
          ) ?? 0
        );

      localStorage.setItem(
        "playCount",
        String(playCount + 1)
      );
    }

    const difficulty =
      getDifficultyLevel(
        currentQuestion
          .correctAnswer.text
      );

    await saveScore(
      newScore,
      difficulty.level
    );

    setShowResult(true);
  }

  /**
   * Loading screen
   */
  if (!currentQuestion) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Memuat soal...
      </main>
    );
  }

  /**
   * Free blocked screen
   */
  if (isBlocked) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        Latihan gratis habis
      </main>
    );
  }

  /**
   * Result screen
   */
  if (showResult) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

        <div className="bg-white p-6 rounded-xl shadow-md text-center w-full max-w-md">

          <h2 className="text-2xl font-bold mb-3">
            Hasil Akhir
          </h2>

          <p className="mb-6 text-lg">
            Skor kamu: {score} / {totalQuestions}
          </p>

          <div className="flex flex-col gap-3">

            <button
              onClick={() => {
                setScore(0);
                setCurrentQuestionIndex(0);
                const q = pickQuestion(role);

                if (!q) {
                  alert("Range ayat terlalu sempit. Minimal 2 ayat.");
                  return;
                }

                setCurrentQuestion(q);
                setShowResult(false);
              }}
              className="bg-blue-600 text-white py-2 rounded"
            >
              🔁 Latihan Lagi
            </button>

            <a
              href="/leaderboard"
              className="bg-yellow-500 text-white py-2 rounded"
            >
              🏆 Leaderboard
            </a>

            <a
              href="/dashboard"
              className="bg-green-600 text-white py-2 rounded"
            >
              📊 Riwayat Skor
            </a>

            <a
              href="/mode"
              className="bg-purple-600 text-white py-2 rounded"
            >
              📖 Pilih Mode
            </a>

            <a
              href="/"
              className="bg-gray-600 text-white py-2 rounded"
            >
              🏠 Beranda
            </a>

          </div>

        </div>

      </main>
    );
  }

  /**
   * Quiz screen
   */
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">

      <h1 className="text-2xl font-bold mb-6">
        Sambung Ayat
      </h1>

      <p className="text-sm text-gray-500 mb-4">
        Mode: {type.toUpperCase()}
        {type === "surah" && ` | Ayat ${start}–${end}`}
        {type === "juz" && ` | Juz ${start}`}
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-xl w-full text-center">

        <p className="text-sm text-gray-500 mb-2">
          Surat: {currentQuestion.surahName}
        </p>

        <button
          onClick={playAudio}
          className="bg-green-600 text-white px-4 py-2 rounded mb-3"
        >
          🔊 Putar Soal
        </button>

        <p className="text-2xl mb-6">
          {currentQuestion.question.text}
        </p>

        <div className="grid gap-3">

          {currentQuestion.options.map(
            (option: any, index: number) => (
              <button
                key={index}
                onClick={() =>
                  handleAnswer(option.text)
                }
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {option.text}
              </button>
            )
          )}

        </div>

      </div>

    </main>
  );
}