'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Users, Rocket, Coins, CreditCard,
    Loader2, ArrowRight, CheckCircle,
    Shield, Wallet, Flag, Megaphone
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function AdminOverviewClient({ user }) {
    const [stats, setStats] = useState(null);
    const [pendingCampaigns, setPendingCampaigns] = useState(0);
    const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
    const [openReports, setOpenReports] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const s = await authClient.getSession();
            const token = s?.data?.session?.token;
            const headers = { authorization: `Bearer ${token}` };

            const [statsRes, campaignsRes, withdrawalsRes, reportsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns?status=pending&perPage=100`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals?status=pending`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, { headers }),
            ]);

            setStats(await statsRes.json());
            const campaignsData = await campaignsRes.json();
            setPendingCampaigns(campaignsData.total || 0);
            const withdrawalsData = await withdrawalsRes.json();
            setPendingWithdrawals(Array.isArray(withdrawalsData) ? withdrawalsData.length : 0);
            const reportsData = await reportsRes.json();
            setOpenReports(Array.isArray(reportsData) ? reportsData.filter(r => r.status === 'open').length : 0);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 pt-8 max-w-6xl mx-auto space-y-6 mt-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-r from-red-500 via-rose-500 to-pink-600 rounded-2xl p-6 text-white"
            >
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
                />
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-4 h-4 text-white/80" />
                            <span className="text-white/80 text-sm font-medium">Admin Dashboard</span>
                        </div>
                        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                        <p className="text-white/60 text-sm mt-1">Platform overview at a glance</p>
                    </div>
                    <Link
                        href="/dashboard/admin/campaigns"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-semibold transition-all border border-white/20 whitespace-nowrap"
                    >
                        Review Campaigns
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total Supporters', value: stats?.totalSupporters || 0, icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800', href: '/dashboard/admin/users' },
                    { label: 'Total Creators', value: stats?.totalCreators || 0, icon: Rocket, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800', href: '/dashboard/admin/users' },
                    { label: 'Total Available Credits', value: (stats?.totalAvailableCredits || 0).toLocaleString(), icon: Coins, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-800', href: '/dashboard/admin/users' },
                    { label: 'Total Payments', value: stats?.totalPayments || 0, icon: CreditCard, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-100 dark:border-cyan-800', href: '/dashboard/admin/withdrawals' },
                ].map((stat, i) => (
                    <Link key={i} href={stat.href}>
                        <div className={`bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border ${stat.border} shadow-sm hover:shadow-md transition-all cursor-pointer`}>
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </Link>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
            >
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Needs Your Attention
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Link
                        href="/dashboard/admin/campaigns"
                        className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-black/20 flex items-center justify-center flex-shrink-0">
                            <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{pendingCampaigns}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Campaigns pending</p>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/admin/withdrawals"
                        className="flex items-center gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 hover:bg-violet-100 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-black/20 flex items-center justify-center flex-shrink-0">
                            <Wallet className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-violet-600 dark:text-violet-400">{pendingWithdrawals}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Withdrawals pending</p>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/admin/reports"
                        className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 hover:bg-red-100 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-black/20 flex items-center justify-center flex-shrink-0">
                            <Flag className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-red-600 dark:text-red-400">{openReports}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Open reports</p>
                        </div>
                    </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2">
                    <Link
                        href="/dashboard/admin/campaigns"
                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                    >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Campaign Approvals
                    </Link>
                    <Link
                        href="/dashboard/admin/users"
                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                    >
                        <Users className="w-3.5 h-3.5" />
                        Manage Users
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
