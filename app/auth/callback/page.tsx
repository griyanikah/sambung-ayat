"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      await supabase.auth.getSession();
      router.push("/");
    }

    handleAuth();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Memproses login...</p>
    </main>
  );
}