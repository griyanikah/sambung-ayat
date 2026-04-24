import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const ModeInner = nextDynamic(
  () => import("./ModeInner"),
  { ssr: false }
);

export default function Page() {
  return <ModeInner />;
}