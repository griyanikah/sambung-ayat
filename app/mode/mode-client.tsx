"use client";

import { Suspense } from "react";
import ModeInner from "./modeinner";

export default function ModeClient() {
  return (
    <Suspense fallback={<div>Memuat mode...</div>}>
      <ModeInner />
    </Suspense>
  );
}