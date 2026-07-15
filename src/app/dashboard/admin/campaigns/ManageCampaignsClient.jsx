'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Megaphone, Search, CheckCircle, XCircle,
    Clock3, Loader2, ArrowRight, Eye, Trash2, Filter, Coins
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { setCampaignStatus, adminDeleteCampaign } from '@/lib/actions/campaigns';

const VERIFY_CONFIG = {
    pending: { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', icon: Clock3 },
    approved: { label: 'Approved', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: XCircle },
};

export default function ManageCampaignsClient() {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns?perPage=200`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            setCampaigns(Array.isArray(data.campaigns) ? data.campaigns : []);
        } catch {
            toast.error('Failed to load campaigns');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (campaignId, status) => {
        setActionLoading(campaignId + status);
        try {
            const result = await setCampaignStatus(campaignId, status);
            if (result?.acknowledged) {
                toast.success(`Campaign ${status}!`);
                setCampaigns(prev =>
                    prev.map(c => c._id === campaignId ? { ...c, status } : c)
                );
            } else {
                toast.error('Action failed');
            }
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (campaignId) => {
        if (!confirm('Delete this campaign permanently? Contributions data will also be removed.')) return;
        setActionLoading(campaignId + 'delete');
        try {
            const result = await adminDeleteCampaign(campaignId);
            if (result?.deletedCount || result?.acknowledged) {
                toast.success('Campaign deleted!');
                setCampaigns(prev => prev.filter(c => c._id !== campaignId));
            } else {
                toast.error('Failed to delete');
            }
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = campaigns.filter(c => {
        const matchSearch = search
            ? c.campaign_title?.toLowerCase().includes(search.toLowerCase()) ||
            c.creator_email?.toLowerCase().includes(search.toLowerCase()) ||
            c.category?.toLowerCase().includes(search.toLowerCase())
            : true;
        const matchFilter = filter === 'all' ? true : c.status === filter;
        return matchSearch && matchFilter;
    });

    const counts = {
        all: campaigns.length,
        pending: campaigns.filter(c => c.status === 'pending').length,
        approved: campaigns.filter(c => c.status === 'approved').length,
        rejected: campaigns.filter(c => c.status === 'rejected').length,
    };

    return (
        <div className="p-6 pt-8 max-w-7xl mx-auto space-y-6 mt-4">

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Campaign Approvals</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Review and approve campaigns submitted by creators
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total', value: counts.all, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                    { label: 'Pending', value: counts.pending, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: 'Approved', value: counts.approved, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Rejected', value: counts.rejected, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
                ].map((stat, i) => (
                    <div key={i} className={`${stat.bg} rounded-2xl p-4 border border-gray-100 dark:border-gray-800`}>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-col sm:flex-row gap-3"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, creator or category..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-gray-400" />
                    {['all', 'pending', 'approved', 'rejected'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${filter === f
                                ? 'bg-red-500 text-white shadow-md'
                                : 'bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800">
                    <Megaphone className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No campaigns found</p>
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
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Campaign</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Creator</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Goal</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {filtered.map((campaign, i) => {
                                    const verify = VERIFY_CONFIG[campaign.status] || VERIFY_CONFIG.pending;
                                    const VerifyIcon = verify.icon;

                                    return (
                                        <motion.tr
                                            key={campaign._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.02 }}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                                                        {campaign.campaign_image_url ? (
                                                            <img src={campaign.campaign_image_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Megaphone className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                                                            {campaign.campaign_title}
                                                        </p>
                                                        <span className="text-xs text-gray-400">{campaign.category}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[160px]">
                                                    {campaign.creator_email}
                                                </p>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-gray-100">
                                                    <Coins className="w-3.5 h-3.5 text-indigo-400" />
                                                    {campaign.funding_goal?.toLocaleString()}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${verify.bg} ${verify.border} border`}>
                                                    <VerifyIcon className={`w-3.5 h-3.5 ${verify.color}`} />
                                                    <span className={`text-xs font-semibold ${verify.color}`}>{verify.label}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/campaigns/${campaign._id}`}
                                                        className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-500 hover:border-indigo-300 transition-all"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Link>

                                                    {campaign.status !== 'approved' && (
                                                        <button
                                                            onClick={() => handleVerify(campaign._id, 'approved')}
                                                            disabled={actionLoading === campaign._id + 'approved'}
                                                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-all disabled:opacity-50"
                                                        >
                                                            {actionLoading === campaign._id + 'approved' ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <CheckCircle className="w-3 h-3" />
                                                            )}
                                                            Approve
                                                        </button>
                                                    )}

                                                    {campaign.status !== 'rejected' && (
                                                        <button
                                                            onClick={() => handleVerify(campaign._id, 'rejected')}
                                                            disabled={actionLoading === campaign._id + 'rejected'}
                                                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-500 text-xs font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
                                                        >
                                                            {actionLoading === campaign._id + 'rejected' ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <XCircle className="w-3 h-3" />
                                                            )}
                                                            Reject
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleDelete(campaign._id)}
                                                        disabled={actionLoading === campaign._id + 'delete'}
                                                        className="p-1.5 rounded-lg border border-red-100 dark:border-red-900/30 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                                                    >
                                                        {actionLoading === campaign._id + 'delete' ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
