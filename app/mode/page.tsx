import dynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const ModeClient = dynamic(
  () => import("./mode-client"),
  { ssr: false }
);

export default function Page() {
  return <ModeClient />;
}