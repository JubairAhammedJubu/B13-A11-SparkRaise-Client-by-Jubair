import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Coins } from 'lucide-react';
import { recordCreditPurchase } from '@/lib/actions/payments';

export default async function PaymentSuccessPage({ searchParams }) {
    const { session_id } = await searchParams;

    if (!session_id) redirect('/dashboard/supporter');

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.status !== 'complete') {
        redirect('/dashboard/supporter');
    }

    const credits = Number(session.metadata?.credits || 0);
    const price = Number(session.metadata?.price || (session.amount_total / 100));

    if (credits > 0) {
        try {
            await recordCreditPurchase({
                credits_purchased: credits,
                price_paid: price,
                transactionId: session.id,
            });
        } catch (err) {
            console.error('Failed to record credit purchase:', err);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center px-4">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 text-center">

                <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border-4 border-emerald-100 dark:border-emerald-800 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Your credits have been added to your account 🎉
                </p>

                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-6 text-left space-y-2 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-xs truncate max-w-[160px]">
                            {session.id}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Credits Purchased</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" /> {credits.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">${price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Email</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-xs truncate max-w-[160px]">
                            {session.customer_email}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/dashboard/supporter"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                    >
                        <Coins className="w-4 h-4" />
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/campaigns"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                        Explore Campaigns
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
