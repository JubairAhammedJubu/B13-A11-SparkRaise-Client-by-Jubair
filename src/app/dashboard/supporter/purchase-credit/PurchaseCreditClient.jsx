'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Loader2, Zap, Sparkles, Crown, Gem } from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const PACKAGES = [
    { credits: 100, price: 5, icon: Zap, label: 'Starter', tag: null },
    { credits: 250, price: 10, icon: Sparkles, label: 'Supporter', tag: 'Popular' },
    { credits: 600, price: 20, icon: Crown, label: 'Champion', tag: 'Best Value' },
    { credits: 1500, price: 45, icon: Gem, label: 'Patron', tag: null },
];

export default function PurchaseCreditClient({ user }) {
    const [loadingIndex, setLoadingIndex] = useState(null);

    const handlePurchase = async (pkg, index) => {
        setLoadingIndex(index);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;

            const res = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ credits: pkg.credits, price: pkg.price }),
            });
            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || 'Failed to start checkout');
                setLoadingIndex(null);
            }
        } catch (err) {
            toast.error('Something went wrong');
            setLoadingIndex(null);
        }
    };

    return (
        <div className="p-6 pt-8 max-w-5xl mx-auto space-y-6 mt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Purchase Credits</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Buy credits to contribute to campaigns you believe in</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
                {PACKAGES.map((pkg, i) => (
                    <motion.div
                        key={pkg.credits}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className={`relative bg-white dark:bg-[#1a1d24] rounded-2xl border shadow-sm p-6 flex flex-col items-center text-center transition-all hover:shadow-md ${pkg.tag === 'Best Value'
                            ? 'border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20'
                            : 'border-gray-100 dark:border-gray-800'
                            }`}
                    >
                        {pkg.tag && (
                            <span className={`absolute -top-3 px-3 py-1 rounded-full text-xs font-semibold ${pkg.tag === 'Best Value'
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white'
                                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                }`}>
                                {pkg.tag}
                            </span>
                        )}

                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4 mt-2">
                            <pkg.icon className="w-7 h-7 text-indigo-500" />
                        </div>

                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">{pkg.label}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 mb-1">
                            <Coins className="w-6 h-6 text-indigo-500" />
                            {pkg.credits.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mb-5">credits</p>

                        <button
                            onClick={() => handlePurchase(pkg, i)}
                            disabled={loadingIndex !== null}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loadingIndex === i ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                `$${pkg.price}`
                            )}
                        </button>
                    </motion.div>
                ))}
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-xs text-gray-400"
            >
                Payments are securely processed by Stripe. Credits are added to your account instantly after checkout.
            </motion.p>
        </div>
    );
}
