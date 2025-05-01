"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase/client";
import Loader from "@/components/ui/loader";

export default function RedirectToUsername() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkOrCreateProfile = async () => {
      if (loading) return;

      // If no user is logged in, redirect to auth
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username,email")
        .eq("id", user.id)
        .single();

      if (profile) {
        if (!profile.username) {
          await supabase
            .from("profiles")
            .update({ email: user.email })
            .eq("id", user.id);
          router.push("/onboard");
        } else {
          router.push(`/profile/${profile.username}`);
        }
      } else {
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
        });
        router.push("/onboard");
      }
    };

    checkOrCreateProfile();
  }, [user, loading, router]);

  return <Loader />;
}
