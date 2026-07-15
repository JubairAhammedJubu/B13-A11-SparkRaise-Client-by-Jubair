'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Heart, Loader2, Calendar, Coins,
    Clock3, CheckCircle, XCircle, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', icon: Clock3 },
    approved: { label: 'Approved', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: XCircle },
};

export default function MyContributionsClient({ user }) {
    const [contributions, setContributions] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const perPage = 8;

    const fetchContributions = useCallback(async () => {
        setIsLoading(true);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;

            const params = new URLSearchParams();
            params.set('supporterEmail', user?.email);
            if (filter !== 'all') params.set('status', filter);
            params.set('page', page);
            params.set('perPage', perPage);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/contributions?${params.toString()}`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            setContributions(Array.isArray(data.contributions) ? data.contributions : []);
            setTotal(data.total || 0);
        } catch {
            toast.error('Failed to load contributions');
        } finally {
            setIsLoading(false);
        }
    }, [user, filter, page]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchContributions();
    }, [fetchContributions]);

    const handleFilterChange = (value) => {
        setFilter(value);
        setPage(1);
    };

    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="p-6 pt-8 max-w-5xl mx-auto space-y-6 mt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Contributions</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Every campaign you've supported</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-2"
            >
                {[
                    { value: 'all', label: 'All' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleFilterChange(tab.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === tab.value
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white'
                            : 'bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : contributions.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800"
                >
                    <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">No contributions found</h3>
                    <p className="text-sm text-gray-400 mb-5">
                        {filter === 'all' ? "You haven't contributed to any campaigns yet." : `No ${filter} contributions.`}
                    </p>
                    {filter === 'all' && (
                        <Link
                            href="/campaigns"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold"
                        >
                            Explore Campaigns
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Campaign</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {contributions.map((c, i) => {
                                    const status = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
                                    const StatusIcon = status.icon;
                                    return (
                                        <motion.tr
                                            key={c._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                                        >
                                            <td className="px-4 py-4">
                                                <Link href={`/campaigns/${c.campaign_id}`} className="font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-500 truncate max-w-[220px] block">
                                                    {c.campaign_title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
                                                    <Coins className="w-3.5 h-3.5 text-indigo-400" />
                                                    {c.Contribution_amount}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>
                                                        {new Date(c.current_date).toLocaleDateString('en-US', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bg} ${status.border} border text-xs font-semibold ${status.color}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {status.label}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === i + 1
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/25'
                                : 'bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
