// file: components/StatsPanel.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BadgeDollarSign, Upload, ThumbsUp, MessageCircle, Eye, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';

const StatsPanel = () => {
  const { user } = useAuth();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    coins: 0,
    uploads: 0,
    likes: 0,
    views: 0,
    comments: 0,
    achievements: [] as string[],
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const [postsRes, coinsRes, likesRes, viewsRes, commentsRes] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('profiles').select('coins').eq('id', user.id).single(),
        supabase.from('likes').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('post_views').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('comments').select('id', { count: 'exact' }).eq('user_id', user.id),
      ]);

      setData({
        coins: coinsRes.data?.coins || 0,
        uploads: postsRes.count || 0,
        likes: likesRes.count || 0,
        views: viewsRes.count || 0,
        comments: commentsRes.count || 0,
        achievements: ['First Post', '10 Likes Received'],
      });
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  if (!user || loading) {
    return (
      <div className={`rounded-2xl p-6 shadow-md ${isDarkMode ? 'bg-black/30 text-white' : 'bg-white text-black'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-black/30 text-white' : 'bg-white text-black'}`}>
      <h3 className="text-xl font-bold mb-6 heading-gradient inline-block">User Rewards & Activities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Stat icon={BadgeDollarSign} label="Total Coins" value={data.coins} color="amber" extra={`+${data.likes * 2} from likes, +${data.views} from views`} />
          <Stat icon={Upload} label="Your Uploads" value={data.uploads} color="blue" />
          <Stat icon={ThumbsUp} label="Content Likes" value={data.likes} color="green" />
          <Stat icon={Eye} label="Total Views" value={data.views} color="yellow" />
          <Stat icon={MessageCircle} label="Comments Posted" value={data.comments} color="purple" />
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Achievements</h4>
          <div className="space-y-3">
            {data.achievements.map((achievement, i) => (
              <div key={i} className={`flex items-center rounded-lg p-3 ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-700'}`}>
                <CircleCheck className="h-5 w-5 text-green-500 mr-2" />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-sm text-gray-500 mb-2">Convert coins to rewards</div>
            <Link href={user ? '/redeem' : '/auth'}>
              <Button variant="outline" className="w-full border-amber-500 text-amber-600 hover:bg-amber-50">
                <BadgeDollarSign className="mr-2 h-4 w-4" /> Redeem Coins
              </Button>
            </Link>
          </div>
          <div className="mt-6">
            <div className="text-sm text-gray-500 mb-2">Invite friends and earn bonus coins</div>
            <Link href="/profile/refer">
              <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-white/10">
                <Upload className="mr-2 h-4 w-4" /> Refer & Earn
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value, color, extra }: any) => (
  <div className="flex items-center">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-${color}-50`}>
      <Icon className={`w-6 h-6 text-${color}-500`} />
    </div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      {extra && <div className={`text-xs text-${color}-600 mt-1`}>{extra}</div>}
    </div>
  </div>
);

export default StatsPanel;
