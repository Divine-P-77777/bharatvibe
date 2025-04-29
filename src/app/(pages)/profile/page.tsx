'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import {
    BadgeDollarSign,
    Upload,
    ThumbsUp,
    CircleCheck,
    Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ProfileCard from './ProfileCard';
import StatsPanel from './StatsPanel';

const UserProfile = () => {
    const { user } = useAuth();

    // Dialog state for redeem explanation
    const [open, setOpen] = useState(false);

    // This would typically come from a user context or API
    const userData = {
        coins: 120,
        uploads: 5,
        likes: 28,
        views: 10250, // Add dummy views
        achievements: [
            "Cultural Contributor",
            "Photography Expert",
            "Food Connoisseur"
        ]
    };

    // Calculate how many coins would come from likes and views: 1k likes = 5 coins, 1M views = 10 coins
    const coinsFromLikes = Math.floor(userData.likes / 1000) * 5;
    const coinsFromViews = Math.floor(userData.views / 1000000) * 10;

    return (
        <section id="profile" className="py-16 md:py-24 bg-orange-50">
            <div className="bharat-container">
                {user ? (
                    <>
                        <div className="mb-8">
                            <ProfileCard
                                user={user}
                                isOwnProfile={true}
                                onEditClick={() => console.log('Edit button clicked')}
                            />

                        </div>
                        <div className="mb-8">
                            <StatsPanel
                                userData={userData}
                                coinsFromLikes={coinsFromLikes}
                                coinsFromViews={coinsFromViews}
                                isAuthenticated={!!user}
                            />

                        </div>
                        
                    </>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="col-span-1 lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-md p-6 h-full">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 bg-gradient-sunset rounded-full flex items-center justify-center mb-4">
                                        <span className="text-white text-3xl font-bold">U</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">User Profile</h3>
                                    <p className="text-gray-500 text-sm mb-4">Join to unlock your profile</p>

                                    <Button
                                        className="w-full bg-gradient-sunset hover:opacity-90 transition-opacity"
                                        onClick={() => window.location.href = '/auth'}
                                    >
                                        Sign Up Now
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 lg:col-span-2">
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
                                            <Button variant="outline" className="w-full border-amber-500 text-amber-600 hover:bg-amber-50">
                                                <BadgeDollarSign className="mr-2 h-4 w-4" /> Redeem Coins
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UserProfile;