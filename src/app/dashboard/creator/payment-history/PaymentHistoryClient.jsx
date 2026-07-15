'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Loader2, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function PaymentHistoryClient({ user }) {
    const [withdrawals, setWithdrawals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals?status=approved`, {
                headers: { authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setWithdrawals(Array.isArray(data) ? data : []);
        } catch {
        } finally {
            setIsLoading(false);
        }
    };

    const totalPaid = withdrawals.reduce((sum, w) => sum + (w.withdrawal_amount || 0), 0);

    return (
        <div className="p-6 pt-8 max-w-4xl mx-auto space-y-6 mt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Payment History</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">All withdrawals paid out to you so far</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800 shadow-sm inline-flex items-center gap-4"
            >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Total Paid Out</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${totalPaid.toFixed(2)}</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                ) : withdrawals.length === 0 ? (
                    <div className="text-center py-16">
                        <Receipt className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">No paid withdrawals yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800">
                                    <th className="text-left px-5 py-3 font-medium">Credits</th>
                                    <th className="text-left px-5 py-3 font-medium">Amount</th>
                                    <th className="text-left px-5 py-3 font-medium">Method</th>
                                    <th className="text-left px-5 py-3 font-medium">Account</th>
                                    <th className="text-left px-5 py-3 font-medium">Date</th>
                                    <th className="text-right px-5 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {withdrawals.map((w) => (
                                    <tr key={w._id}>
                                        <td className="px-5 py-4 font-semibold text-gray-900 dark:text-gray-100">{w.withdrawal_credit}</td>
                                        <td className="px-5 py-4 font-semibold text-emerald-600 dark:text-emerald-400">${w.withdrawal_amount?.toFixed(2)}</td>
                                        <td className="px-5 py-4">
                                            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                                <CreditCard className="w-3.5 h-3.5" /> {w.payment_system}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{w.account_number}</td>
                                        <td className="px-5 py-4">
                                            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(w.approvedAt || w.withdraw_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                                <CheckCircle className="w-3.5 h-3.5" /> Paid
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
