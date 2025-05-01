"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import UserNav from "@/components/layout/UserNav"
import Footer from "@/components/layout/Footer"
import Loader from '@/components/ui/loader'

const MIN_REDEEM = 5000;
const CONVERSION_RATE = 0.05; // ₹0.05 per coin => 1000 coins = ₹50

export default function RedeemPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [upiId, setUpiId] = useState('');
    const [coins, setCoins] = useState(0);
    const [loading, setLoading] = useState(false)

    const handleRedeem = async () => {
        if (!user) {
            toast({ title: 'Not logged in', description: 'You must be logged in to redeem coins.' });
            return;
        }
    
        if (!upiId || !upiId.includes('@')) {
            toast({ title: 'Invalid UPI ID', description: 'Please enter a valid UPI ID' });
            return;
        }
        if (coins < MIN_REDEEM) {
            toast({ title: 'Minimum 5000 Coins', description: 'You need at least 5000 coins to redeem' });
            return;
        }
    
        setLoading(true);
    
        const { data: profile, error } = await supabase.from('profiles').select('coins').eq('id', user.id).single();
        if (error || !profile) {
            toast({ title: 'Error', description: 'Could not fetch your profile' });
            setLoading(false);
            return;
        }
    
        if (profile.coins < coins) {
            toast({ title: 'Insufficient Coins', description: 'You do not have enough coins to redeem this amount' });
            setLoading(false);
            return;
        }
    
        const { error: redeemError } = await supabase.from('redeem_requests').insert({
            user_id: user.id,
            upi_id: upiId,
            coins,
            status: 'pending'
        });
    
        if (redeemError) {
            toast({ title: 'Redeem Failed', description: redeemError.message });
            setLoading(false);
            return;
        }
    
        const { error: updateError } = await supabase.from('profiles')
            .update({ coins: profile.coins - coins })
            .eq('id', user.id);
    
        if (updateError) {
            toast({ title: 'Error Updating Profile', description: updateError.message });
            setLoading(false);
            return;
        }
    
        toast({
            title: 'Redeem Request Submitted',
            description: `₹${(coins * CONVERSION_RATE).toFixed(2)} will be sent to ${upiId}`
        });
    
        setCoins(0);
        setUpiId('');
        setLoading(false);
    };
    

    return (
        <>
            {loading && <Loader />}
            <UserNav />
            <motion.div
                className="max-w-xl mx-auto mt-10 py-30"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="shadow-lg border dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">🎉 Redeem Your Vibe Coins</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="upi" className="block text-sm font-medium">Enter your UPI ID</label>
                            <Input id="upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="example@upi" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="coins" className="block text-sm font-medium">Enter coins to redeem</label>
                            <Input id="coins" type="number" min={MIN_REDEEM} value={coins} onChange={(e) => setCoins(Number(e.target.value))} />
                            <p className="text-sm text-muted-foreground">1000 coins = ₹50 | Min. {MIN_REDEEM} coins</p>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-4"
                        >
                            <Button disabled={loading} onClick={handleRedeem} className="w-full text-white bg-gradient-to-br from-amber-500 to-yellow-400">
                                {loading ? 'Processing...' : 'Request Redeem'}
                            </Button>
                        </motion.div>

                        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                            <h4 className="font-medium mb-1">🔎 Redemption Info</h4>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>Coins earned from posting, likes, views, and referrals</li>
                                <li>Minimum 5000 coins required to redeem</li>
                                <li>Conversion rate: 1000 coins = ₹50</li>
                                <li>Bonus: 7-day login = 50 coins, 10 posts = 200, Top liked = 500</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            <Footer />
        </>
    );
}
