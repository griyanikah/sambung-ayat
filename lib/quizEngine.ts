import quranData from "@/dataset/quran.json";

type Verse = {
  id: number;
  text: string;
};

type Surah = {
  id: number;
  transliteration: string;
  verses: Verse[];
};

function randomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * ENGINE UTAMA (support range pendek)
 */
export function getQuestionByRange(
  type: "surah" | "juz",
  start: number,
  end: number,
  surahId?: number
) {
  let selectedSurah: Surah | null = null;

  // MODE SURAH
  if (type === "surah" && surahId) {
    selectedSurah = (quranData as Surah[]).find(
      (s) => s.id === surahId
    ) ?? null;
  }

  // MODE JUZ
  else {
    const surahs = (quranData as Surah[]).filter(
      (s) => s.id >= start && s.id <= end
    );

    if (!surahs.length) return null;

    selectedSurah = randomItem(surahs);
  }

  if (!selectedSurah) return null;

  let verses = selectedSurah.verses;

  // FILTER RANGE AYAT
  if (type === "surah") {
    verses = verses.filter(
      (v) => v.id >= start && v.id <= end
    );
  }

  // RANGE 1 AYAT → tidak bisa sambung ayat
  if (verses.length < 2) {
    console.warn("Range minimal 2 ayat");
    return null;
  }

  // RANGE NORMAL
  const index =
    verses.length === 2
      ? 0
      : Math.floor(
          Math.random() *
            (verses.length - 1)
        );

  const question = verses[index];
  const correctAnswer = verses[index + 1];

  const wrongAnswers: Verse[] = [];

  // kalau range sempit → boleh repeat
  while (wrongAnswers.length < 3) {
    const v = randomItem(verses);

    if (v.text !== correctAnswer.text) {
      wrongAnswers.push(v);
    }
  }

  const options = [
    correctAnswer,
    ...wrongAnswers,
  ].sort(() => Math.random() - 0.5);

  return {
    question,
    correctAnswer,
    options,
    surahName: selectedSurah.transliteration,
    surahId: selectedSurah.id,
    verseRangeSize: verses.length, // penting untuk scoring nanti
  };
}

/**
 * MODE GRATIS DEFAULT = JUZ 30
 */
export function getRandomQuestionJuz30() {
  return getQuestionByRange(
    "surah",
    78,
    114
  );
}