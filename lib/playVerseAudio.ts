let audioInstance: HTMLAudioElement | null = null;

export function playVerseAudio(
  surahId: number,
  ayahId: number
) {
  const surah = String(surahId).padStart(3, "0");
  const ayah = String(ayahId).padStart(3, "0");

  const url = `https://everyayah.com/data/Alafasy_128kbps/${surah}${ayah}.mp3`;

  stopVerseAudio();

  audioInstance = new Audio(url);

  audioInstance.play().catch(() => {
    console.warn("Autoplay dicegah browser");
  });
}

export function stopVerseAudio() {
  if (audioInstance) {
    audioInstance.pause();
    audioInstance.currentTime = 0;
    audioInstance = null;
  }
}