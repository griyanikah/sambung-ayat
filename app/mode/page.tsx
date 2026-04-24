import dynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const ModeInner = dynamic(
  () => import("./ModeInner"),
  { ssr: false }
);

export default function Page() {
  return <ModeInner />;
}