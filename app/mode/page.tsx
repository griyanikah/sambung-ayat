"use client";

import { Suspense } from "react";
import ModeInner from "./ModeInner";

export const dynamic = "force-dynamic";

export default function ModePage() {
  return (
    <Suspense fallback={<div>Memuat mode...</div>}>
      <ModeInner />
    </Suspense>
  );
}