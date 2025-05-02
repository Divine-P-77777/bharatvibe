"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProfileCard from '../ProfileCard';
import { supabase } from '@/lib/supabase/client';
import Loader from '@/components/ui/loader';
import Link from "next/link";
export default function OnboardPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || loading) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) return;

      setProfile(data);

      if (data.username) {
        router.push(`/profile/${data.username}`);
      }
    };

    fetchProfile();
  }, [user, loading, router]);

  if (loading || !profile) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
       <Link href="/"><button className='w-fit py-2 px-4 bg-gradient-to-r from-rose-400 to-amber-600 rounded-4xl'>
       Back to Home
      </button></Link>
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
      <ProfileCard user={profile} isOwnProfile={true} />
    </div>
  );
}
