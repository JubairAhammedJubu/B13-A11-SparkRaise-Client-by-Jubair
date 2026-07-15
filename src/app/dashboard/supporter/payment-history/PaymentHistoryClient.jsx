'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    CreditCard, Loader2, Calendar, Hash, Coins, TrendingUp, ArrowRight
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function PaymentHistoryClient({ user }) {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/payments?supporterEmail=${user?.email}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            setPayments(Array.isArray(data) ? data : []);
        } catch {
        } finally {
            setIsLoading(false);
        }
    };

    const totalSpent = payments.reduce((sum, p) => sum + (p.price_paid || 0), 0);
    const totalCredits = payments.reduce((sum, p) => sum + (p.credits_purchased || 0), 0);

    return (
        <div className="p-6 pt-8 max-w-5xl mx-auto space-y-6 mt-4">

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Payment History</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">All your credit purchases</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
                {[
                    { label: 'Total Purchases', value: payments.length, icon: CreditCard, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                    { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Total Credits Bought', value: totalCredits.toLocaleString(), icon: Coins, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                ].map((stat, i) => (
                    <div key={i} className={`${stat.bg} rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex items-center gap-4`}>
                        <div className="w-11 h-11 rounded-xl bg-white/60 dark:bg-black/20 flex items-center justify-center">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : payments.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800">
                    <CreditCard className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">No purchases yet</h3>
                    <p className="text-sm text-gray-400 mb-5">Your credit purchase history will appear here</p>
                    <Link
                        href="/dashboard/supporter/purchase-credit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold"
                    >
                        Buy Credits
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Transaction ID</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Credits</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount Paid</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {payments.map((tx, i) => (
                                    <motion.tr
                                        key={tx._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate max-w-[140px]">
                                                    {tx.transactionId}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
                                                <Coins className="w-3.5 h-3.5 text-indigo-400" />
                                                {tx.credits_purchased?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                ${tx.price_paid?.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>
                                                    {new Date(tx.paidAt || tx.createdAt).toLocaleDateString('en-US', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                                ✓ Paid
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
