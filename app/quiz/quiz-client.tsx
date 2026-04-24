"use client";

import { Suspense } from "react";
import QuizInner from "./QuizInner";

export default function QuizClient() {
  return (
    <Suspense fallback={<div>Memuat soal...</div>}>
      <QuizInner />
    </Suspense>
  );
}