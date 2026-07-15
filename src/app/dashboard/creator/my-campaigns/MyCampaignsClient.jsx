'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Megaphone, Plus, Edit2, Trash2, Eye,
    CheckCircle, XCircle, Clock3, Loader2,
    AlertTriangle, X, Save, Coins, Target
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { updateCampaign, deleteCampaign } from '@/lib/actions/campaigns';

const VERIFY_CONFIG = {
    pending: { label: 'Pending Review', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', icon: Clock3 },
    approved: { label: 'Approved', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: XCircle },
};

function DeleteModal({ campaign, onConfirm, onCancel, isLoading }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1a1d24] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 text-center mb-2">Delete Campaign?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-gray-100">&quot;{campaign?.campaign_title}&quot;</span>?
                    Approved supporters will be refunded their credits. This cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete & Refund'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Per doc + backend: only campaign_title, campaign_story, and reward_info are editable after creation.
function EditModal({ campaign, onSave, onCancel, isLoading }) {
    const [form, setForm] = useState({
        campaign_title: campaign?.campaign_title || '',
        campaign_story: campaign?.campaign_story || '',
        reward_info: campaign?.reward_info || '',
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-lg bg-white dark:bg-[#1a1d24] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Update Campaign</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-xs text-gray-400 mb-4">
                    Only the title, story, and reward info can be edited after a campaign is created.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Campaign Title</label>
                        <input
                            type="text"
                            name="campaign_title"
                            value={form.campaign_title}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Campaign Story</label>
                        <textarea
                            name="campaign_story"
                            value={form.campaign_story}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all resize-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Reward Info</label>
                        <input
                            type="text"
                            name="reward_info"
                            value={form.reward_info}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(form)}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" />Save Changes</>}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function MyCampaignsClient({ user }) {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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
                `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns?creatorEmail=${user?.email}&perPage=100`,
                { headers: { authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            const list = Array.isArray(data.campaigns) ? data.campaigns : [];
            // sorted by deadline desc, per doc requirement
            list.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
            setCampaigns(list);
        } catch {
            toast.error('Failed to load campaigns');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            const result = await deleteCampaign(deleteTarget._id);
            if (result?.deletedCount) {
                toast.success('Campaign deleted and supporters refunded');
                setCampaigns((prev) => prev.filter((c) => c._id !== deleteTarget._id));
                setDeleteTarget(null);
            } else {
                toast.error(result?.message || 'Failed to delete campaign');
            }
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = async (form) => {
        if (!editTarget) return;
        setIsEditing(true);
        try {
            const result = await updateCampaign(editTarget._id, form);
            if (result?.acknowledged) {
                toast.success('Campaign updated!');
                setCampaigns((prev) => prev.map((c) => c._id === editTarget._id ? { ...c, ...form } : c));
                setEditTarget(null);
            } else {
                toast.error(result?.message || 'Failed to update campaign');
            }
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setIsEditing(false);
        }
    };

    const filteredCampaigns = filter === 'all' ? campaigns : campaigns.filter((c) => c.status === filter);
    const counts = {
        all: campaigns.length,
        pending: campaigns.filter((c) => c.status === 'pending').length,
        approved: campaigns.filter((c) => c.status === 'approved').length,
        rejected: campaigns.filter((c) => c.status === 'rejected').length,
    };

    const tabs = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
    ];

    return (
        <div className="p-6 pt-8 max-w-6xl mx-auto space-y-6 mt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Campaigns</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sorted by deadline, most recent first</p>
                </div>
                <Link
                    href="/dashboard/creator/add-campaign"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-semibold"
                >
                    <Plus className="w-4 h-4" />
                    Add Campaign
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-2"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === tab.value
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white'
                            : 'bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        {tab.label}
                        <span className={`px-1.5 py-0.5 rounded-lg text-xs font-bold ${filter === tab.value ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                            }`}>
                            {counts[tab.value]}
                        </span>
                    </button>
                ))}
            </motion.div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
            ) : filteredCampaigns.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800"
                >
                    <Megaphone className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">No campaigns found</h3>
                    <p className="text-sm text-gray-400 mb-5">
                        {filter === 'all' ? "You haven't launched any campaigns yet." : `No ${filter} campaigns.`}
                    </p>
                    {filter === 'all' && (
                        <Link
                            href="/dashboard/creator/add-campaign"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-semibold"
                        >
                            <Plus className="w-4 h-4" />
                            Launch Your First Campaign
                        </Link>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {filteredCampaigns.map((campaign, index) => {
                        const verify = VERIFY_CONFIG[campaign.status] || VERIFY_CONFIG.pending;
                        const VerifyIcon = verify.icon;
                        const isRejected = campaign.status === 'rejected';
                        const progress = campaign.funding_goal
                            ? Math.min(100, ((campaign.amount_raised || 0) / campaign.funding_goal) * 100)
                            : 0;

                        return (
                            <motion.div
                                key={campaign._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-white dark:bg-[#1a1d24] rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${isRejected
                                    ? 'border-red-100 dark:border-red-900/30 opacity-75'
                                    : 'border-gray-100 dark:border-gray-800 hover:shadow-emerald-500/10'
                                    }`}
                            >
                                <div className="relative h-40 overflow-hidden">
                                    {campaign.campaign_image_url ? (
                                        <Image src={campaign.campaign_image_url} alt={campaign.campaign_title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
                                            <Megaphone className="w-12 h-12 text-emerald-300" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                    <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full ${verify.bg} ${verify.border} border backdrop-blur-sm`}>
                                        <VerifyIcon className={`w-3.5 h-3.5 ${verify.color}`} />
                                        <span className={`text-xs font-semibold ${verify.color}`}>{verify.label}</span>
                                    </div>

                                    <div className="absolute bottom-3 left-3 right-3">
                                        <span className="text-white font-semibold text-sm truncate">{campaign.category}</span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-2 truncate">
                                        {campaign.campaign_title}
                                    </h3>

                                    <div className="mb-2">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                                                <Coins className="w-3 h-3" /> {(campaign.amount_raised || 0).toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <Target className="w-3 h-3" /> {(campaign.funding_goal || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-400 mb-4">
                                        Deadline: {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </p>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/campaigns/${campaign._id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium hover:border-emerald-300 hover:text-emerald-600 transition-all"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            View
                                        </Link>
                                        <button
                                            onClick={() => setEditTarget(campaign)}
                                            disabled={isRejected}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium hover:border-emerald-300 hover:text-emerald-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(campaign)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-100 dark:border-red-900/30 text-red-400 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            <AnimatePresence>
                {deleteTarget && (
                    <DeleteModal
                        campaign={deleteTarget}
                        onConfirm={handleDelete}
                        onCancel={() => setDeleteTarget(null)}
                        isLoading={isDeleting}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editTarget && (
                    <EditModal
                        campaign={editTarget}
                        onSave={handleEdit}
                        onCancel={() => setEditTarget(null)}
                        isLoading={isEditing}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
