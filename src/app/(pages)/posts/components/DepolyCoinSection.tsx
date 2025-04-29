
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { toast } from "@/hooks/use-toast";

interface DeployCoinSectionProps {
  postUserId: string;
  postId: string;
}

export default function DeployCoinSection({ postUserId, postId }: DeployCoinSectionProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [awarded, setAwarded] = useState(false);

  useEffect(() => {
    checkAwarded();
    // eslint-disable-next-line
  }, [user, postId]);

  const checkAwarded = async () => {
    // For demo: prevent giving coin twice per user per post:
    if (!user) return;
    const key = `coin_${user.id}_${postId}`;
    if (localStorage.getItem(key)) setAwarded(true);
  };

  const awardCoin = async () => {
    if (awarded || !user) return;
    setLoading(true);
    // Calls increment_user_coins DB Function
    const { error } = await supabase.rpc('increment_user_coins', {
      user_id: postUserId,
      amount: 1
    });
    setLoading(false);
    if (!error) {
      setAwarded(true);
      localStorage.setItem(`coin_${user.id}_${postId}`, "1");
      toast({ title: "Coin deployed! Author has received +1 coin." });
    } else {
      toast({ title: "Failed to send coin", description: error.message });
    }
  };

  if (!user || user.id === postUserId) return null;

  return (
    <div className="mb-6">
      <Button
        disabled={loading || awarded}
        onClick={awardCoin}
        variant="outline"
        className="border-bharat-orange text-bharat-orange"
      >
        {awarded ? "Coin deployed ✨" : "Deploy Coin to Author"}
      </Button>
    </div>
  );
}