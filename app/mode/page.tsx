export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const ModeClient = dynamicImport(
  () => import("./mode-client"),
  { ssr: false }
);

export default function Page() {
  return <ModeClient />;
}