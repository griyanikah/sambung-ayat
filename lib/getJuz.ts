export function getJuzFromSurah(surahId: number) {
  if (surahId >= 78) return 30;
  if (surahId >= 67) return 29;
  if (surahId >= 58) return 28;
  if (surahId >= 51) return 27;
  if (surahId >= 46) return 26;
  if (surahId >= 41) return 25;
  if (surahId >= 36) return 24;
  if (surahId >= 31) return 23;
  if (surahId >= 26) return 22;
  if (surahId >= 21) return 21;
  if (surahId >= 16) return 20;
  if (surahId >= 11) return 19;
  if (surahId >= 6) return 18;
  if (surahId >= 1) return 1;

  return 30;
}