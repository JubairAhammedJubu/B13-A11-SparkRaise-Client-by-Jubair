'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Megaphone, Activity, Coins,
    Clock3, CheckCircle, XCircle,
    Plus, Loader2, Rocket, Eye, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { updateContributionStatus } from '@/lib/actions/contributions';

function ContributionModal({ contribution, onClose }) {
    if (!contribution) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1a1d24] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Contribution Details</h3>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Supporter</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{contribution.supporter_name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Campaign</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{contribution.campaign_title}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Amount</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{contribution.Contribution_amount} credits</p>
                    </div>
                    {contribution.message && (
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Message</p>
                            <p className="text-gray-700 dark:text-gray-300">{contribution.message}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function CreatorDashboardClient({ user: serverUser }) {
    const user = serverUser;
    const [stats, setStats] = useState({ totalCampaigns: 0, activeCampaigns: 0, totalRaised: 0 });
    const [pendingContributions, setPendingContributions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [viewTarget, setViewTarget] = useState(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;
            const headers = { authorization: `Bearer ${token}` };

            const [statsRes, contribRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creator/stats`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions?creatorEmail=${user?.email}&status=pending&perPage=100`, { headers }),
            ]);

            const statsData = await statsRes.json();
            const contribData = await contribRes.json();

            setStats(statsData || {});
            setPendingContributions(Array.isArray(contribData.contributions) ? contribData.contributions : []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setActionLoading(id + status);
        try {
            const result = await updateContributionStatus(id, status);
            if (result?.acknowledged) {
                toast.success(`Contribution ${status}!`);
                setPendingContributions((prev) => prev.filter((c) => c._id !== id));
            } else {
                toast.error(result?.message || 'Action failed');
            }
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    const statCards = [
        {
            label: 'Total Campaigns',
            value: stats.totalCampaigns || 0,
            icon: Megaphone,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            border: 'border-indigo-100 dark:border-indigo-800',
        },
        {
            label: 'Active Campaigns',
            value: stats.activeCampaigns || 0,
            icon: Activity,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-100 dark:border-emerald-800',
        },
        {
            label: 'Total Amount Raised',
            value: `${(stats.totalRaised || 0).toLocaleString()} credits`,
            icon: Coins,
            color: 'text-violet-600 dark:text-violet-400',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            border: 'border-violet-100 dark:border-violet-800',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full py-32">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 pt-8 max-w-6xl mx-auto space-y-6 mt-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 text-white"
            >
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
                />
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Rocket className="w-5 h-5 text-white/80" />
                            <span className="text-white/80 text-sm font-medium">Creator Dashboard</span>
                        </div>
                        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                        <p className="text-white/70 text-sm mt-1">Here&apos;s what&apos;s happening with your campaigns today.</p>
                    </div>
                    <Link
                        href="/dashboard/creator/add-campaign"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-semibold transition-all border border-white/20 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Campaign
                    </Link>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
                {statCards.map((stat, i) => (
                    <div key={i} className={`bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border ${stat.border} shadow-sm`}>
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Contributions To Review</h2>
                    <span className="text-xs px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-semibold">
                        {pendingContributions.length} pending
                    </span>
                </div>

                {pendingContributions.length === 0 ? (
                    <div className="text-center py-10">
                        <Clock3 className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">No pending contributions right now</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800">
                                    <th className="text-left pb-3 font-medium">Supporter</th>
                                    <th className="text-left pb-3 font-medium">Campaign</th>
                                    <th className="text-left pb-3 font-medium">Amount</th>
                                    <th className="text-left pb-3 font-medium"></th>
                                    <th className="text-right pb-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {pendingContributions.map((c) => (
                                    <tr key={c._id}>
                                        <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-gray-100">{c.supporter_name}</td>
                                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-400 truncate max-w-[140px]">{c.campaign_title}</td>
                                        <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-gray-100">{c.Contribution_amount} cr</td>
                                        <td className="py-3 pr-4">
                                            <button
                                                onClick={() => setViewTarget(c)}
                                                className="flex items-center gap-1 text-xs text-indigo-500 hover:underline"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> View
                                            </button>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(c._id, 'approved')}
                                                    disabled={actionLoading === c._id + 'approved'}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-all disabled:opacity-50"
                                                >
                                                    {actionLoading === c._id + 'approved' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(c._id, 'rejected')}
                                                    disabled={actionLoading === c._id + 'rejected'}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-500 text-xs font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
                                                >
                                                    {actionLoading === c._id + 'rejected' ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            <AnimatePresence>
                {viewTarget && <ContributionModal contribution={viewTarget} onClose={() => setViewTarget(null)} />}
            </AnimatePresence>
        </div>
    );
}
