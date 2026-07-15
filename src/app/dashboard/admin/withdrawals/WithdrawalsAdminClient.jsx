'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet, Loader2, Clock3, CheckCircle,
    CreditCard, Calendar, Filter, Coins
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { approveWithdrawal } from '@/lib/actions/withdrawals';

export default function WithdrawalsAdminClient() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        setIsLoading(true);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals`, {
                headers: { authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setWithdrawals(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load withdrawals');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            const result = await approveWithdrawal(id);
            if (result?.acknowledged) {
                toast.success('Payment marked as successful!');
                setWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status: 'approved' } : w));
            } else {
                toast.error(result?.message || 'Action failed');
            }
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = filter === 'all' ? withdrawals : withdrawals.filter(w => w.status === filter);
    const counts = {
        all: withdrawals.length,
        pending: withdrawals.filter(w => w.status === 'pending').length,
        approved: withdrawals.filter(w => w.status === 'approved').length,
    };

    return (
        <div className="p-6 pt-8 max-w-6xl mx-auto space-y-6 mt-4">

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Withdrawal Requests</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review and pay out creator withdrawal requests</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2"
            >
                <Filter className="w-4 h-4 text-gray-400" />
                {[
                    { value: 'pending', label: 'Pending' },
                    { value: 'approved', label: 'Paid' },
                    { value: 'all', label: 'All' },
                ].map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.value
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        {f.label}
                        <span className="ml-1.5 opacity-70">({counts[f.value]})</span>
                    </button>
                ))}
            </motion.div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800">
                    <Wallet className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No withdrawal requests found</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                >
                    {filtered.map((w, i) => (
                        <motion.div
                            key={w._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
                        >
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${w.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                                {w.status === 'approved'
                                    ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    : <Clock3 className="w-5 h-5 text-amber-500" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{w.creator_name}</p>
                                <p className="text-xs text-gray-400">{w.creator_email}</p>
                            </div>

                            <div className="flex items-center gap-5 text-sm">
                                <span className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
                                    <Coins className="w-4 h-4 text-indigo-400" /> {w.withdrawal_credit}
                                </span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    ${w.withdrawal_amount?.toFixed(2)}
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                                    <CreditCard className="w-3.5 h-3.5" /> {w.payment_system} · {w.account_number}
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                                    <Calendar className="w-3.5 h-3.5" /> {new Date(w.withdraw_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>

                            <div className="flex-shrink-0">
                                {w.status === 'approved' ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                        <CheckCircle className="w-3.5 h-3.5" /> Paid
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleApprove(w._id)}
                                        disabled={actionLoading === w._id}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold shadow-md hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === w._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                        Payment Success
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
