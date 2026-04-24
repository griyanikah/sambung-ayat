"use client";

import { Suspense } from "react";
import ModeInner from "./ModeInner";

export default function ModeClient() {
  return (
    <Suspense fallback={<div>Memuat mode...</div>}>
      <ModeInner />
    </Suspense>
  );
}