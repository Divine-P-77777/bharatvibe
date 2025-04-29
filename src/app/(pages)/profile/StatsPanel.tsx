
import React from 'react';
import Link from 'next/link';

import { BadgeDollarSign, Upload, ThumbsUp, CircleCheck, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StatsPanelProps {
  userData: {
    coins: number;
    uploads: number;
    likes: number;
    views: number;
    achievements: string[];
  };
  coinsFromLikes: number;
  coinsFromViews: number;
  isAuthenticated: boolean;
}

const StatsPanel = ({
  userData,
  coinsFromLikes,
  coinsFromViews,
  isAuthenticated
}: StatsPanelProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-full">
      <h3 className="text-xl font-bold mb-6 heading-gradient inline-block">User Rewards & Activities</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mr-4">
              <BadgeDollarSign className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Coins</div>
              <div className="text-2xl font-bold">{userData.coins}</div>
              {isAuthenticated && (
                <div className="text-xs text-amber-600 mt-1">
                  +{coinsFromLikes} from likes, +{coinsFromViews} from views
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Your Uploads</div>
              <div className="text-2xl font-bold">{userData.uploads}</div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
              <ThumbsUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Content Likes</div>
              <div className="text-2xl font-bold">{userData.likes}</div>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mr-4">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Views</div>
                <div className="text-2xl font-bold">{userData.views}</div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Achievements</h4>
          <div className="space-y-3">
            {userData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center text-gray-700 bg-gray-50 rounded-lg p-3">
                <CircleCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>{achievement}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="text-sm text-gray-500 mb-2">Convert coins to rewards</div>
            <Link href={isAuthenticated ? "/redeem" : "/auth"}>
              <Button
                variant="outline"
                className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
                type="button"
              >
                <BadgeDollarSign className="mr-2 h-4 w-4" /> Redeem Coins
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;