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

      if (!user) {
        router.replace("/auth");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username,email")
        .eq("id", user.id)
        .single();

      if (profile) {
        if (!profile.username) {
          router.replace("/profile/onboard");
          return;
        }
        router.replace(`/profile/${profile.username}`);
      } else {
        const email = user.email || user.user_metadata?.email;
        if (!email) {
          console.error("Missing user email; profile creation aborted.");
          return;
        }

        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          email,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        });

        if (!insertError) {
          router.replace("/profile/onboard");
        }
      }
    };

    checkOrCreateProfile();
  }, [user, loading, router]);

  return <Loader />;
}
