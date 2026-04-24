import { Suspense } from "react";
import ModeClient from "./mode-client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Memuat mode...</div>}>
      <ModeClient />
    </Suspense>
  );
}