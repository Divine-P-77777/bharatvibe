import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Track the number of server-down pings directly in the running Vercel / Node memory wrapper
const globalForRequests = globalThis as unknown as { serverDownCount?: number };

export async function POST() {
    if (typeof globalForRequests.serverDownCount === 'undefined') {
        globalForRequests.serverDownCount = 0;
    }
    
    globalForRequests.serverDownCount++;
    const currentCount = globalForRequests.serverDownCount;

    console.log(`[Server Status API] Received down ping #${currentCount}`);

    // Trigger an email every 10 requests
    if (currentCount % 10 === 0 && resend) {
        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev', // Ensure you have this configured, or set your own verified domain
                to: process.env.ADMIN_EMAIL || 'admin@bharatvibes.in',
                subject: 'URGENT: Supabase Project is Paused or Unreachable',
                html: `
                  <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #e53e3e;">Server Down Alert</h2>
                    <p>The Supabase project associated with Bharat Vibes is currently paused or unreachable.</p>
                    <p>The client application has reported connection failures <strong>${currentCount}</strong> times.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888;">This is an automated alert triggered by the client-side server status hook.</p>
                  </div>
                `,
            });
            console.log(`[Server Status API] Sent Resend email successfully for count ${currentCount}`);
        } catch (error) {
            console.error('[Server Status API] Error sending resend email:', error);
        }
    } else if (currentCount % 10 === 0 && !resend) {
        console.warn(`[Server Status API] Missing RESEND_API_KEY! Would have sent email for count ${currentCount}`);
    }

    return NextResponse.json({ success: true, count: currentCount });
}
