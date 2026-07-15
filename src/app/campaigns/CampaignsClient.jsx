'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search, ArrowRight, Coins, Target, Calendar,
    SlidersHorizontal, Tag, Megaphone
} from 'lucide-react';

const CATEGORIES = [
    'all', 'Technology', 'Art & Design', 'Music', 'Film & Video',
    'Games', 'Food & Craft', 'Fashion', 'Publishing', 'Community', 'Charity',
];

const SORT_OPTIONS = [
    { value: 'default', label: 'Newest' },
    { value: 'goal_asc', label: 'Goal: Low to High' },
    { value: 'goal_desc', label: 'Goal: High to Low' },
    { value: 'deadline', label: 'Ending Soon' },
];

function daysLeft(deadline) {
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
}

function CampaignCard({ campaign, index }) {
    const progress = campaign.funding_goal
        ? Math.min(100, ((campaign.amount_raised || 0) / campaign.funding_goal) * 100)
        : 0;
    const remaining = daysLeft(campaign.deadline);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800
        shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]
        hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_12px_40px_rgba(99,102,241,0.2)]
        transition-all duration-500"
        >
            <div className="relative h-44 overflow-hidden">
                {campaign.campaign_image_url ? (
                    <Image
                        src={campaign.campaign_image_url}
                        alt={campaign.campaign_title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/20 dark:to-violet-900/20 flex items-center justify-center">
                        <Megaphone className="w-12 h-12 text-indigo-300" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-white/20 backdrop-blur-sm">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-600">{campaign.category}</span>
                </div>

                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                    {remaining > 0 ? `${remaining} days left` : 'Ending soon'}
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-3 truncate">
                    {campaign.campaign_title}
                </h3>

                <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                            <Coins className="w-3.5 h-3.5" /> {(campaign.amount_raised || 0).toLocaleString()} raised
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                            <Target className="w-3.5 h-3.5" /> {(campaign.funding_goal || 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Min. contribution</p>
                        <p className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                            {campaign.minimum_Contribution} cr
                        </p>
                    </div>
                    <Link
                        href={`/campaigns/${campaign._id}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-400 transition-all duration-200"
                    >
                        View
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export default function CampaignsClient({ initialParams }) {
    const [campaigns, setCampaigns] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [search, setSearch] = useState(initialParams?.search || '');
    const [category, setCategory] = useState(initialParams?.category || 'all');
    const [sortBy, setSortBy] = useState('default');
    const [page, setPage] = useState(1);
    const perPage = 9;

    const fetchCampaigns = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (category !== 'all') params.set('category', category);
            if (sortBy !== 'default') params.set('sort', sortBy);
            params.set('page', page);
            params.set('perPage', perPage);
            params.set('activeOnly', 'true');

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns?${params.toString()}`);
            const data = await res.json();
            setCampaigns(data.campaigns || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [search, category, sortBy, page]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCampaigns();
    }, [fetchCampaigns]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchCampaigns();
    };

    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">

            <div className="relative pt-24 pb-32 overflow-visible">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent" />

                <div className="absolute top-10 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-10 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10"
                    >
                        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-white/10 border border-white/20 text-white/80">
                            Explore Campaigns
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                            Discover Projects to Support
                        </h1>
                        <p className="text-white/60 text-base max-w-xl mx-auto">
                            Back the ideas, causes, and creators you believe in.
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        onSubmit={handleSearch}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="flex gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                                <input
                                    type="text"
                                    placeholder="Search campaigns..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold shadow-lg hover:shadow-indigo-500/40 transition-all"
                            >
                                Search
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-16">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-4 mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 sm:hidden"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </button>

                        <div className={`flex-1 flex flex-wrap gap-2 ${isFilterOpen ? 'flex' : 'hidden sm:flex'}`}>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { setCategory(cat); setPage(1); }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${category === cat
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white'
                                        : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-indigo-600'
                                        }`}
                                >
                                    {cat === 'all' ? 'All' : cat}
                                </button>
                            ))}
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                            className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-96 rounded-2xl bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800">
                        <Megaphone className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">No campaigns found</h3>
                        <p className="text-sm text-gray-400">Try a different search or category</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {campaigns.map((campaign, index) => (
                            <CampaignCard key={campaign._id} campaign={campaign} index={index} />
                        ))}
                    </motion.div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
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
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-xl bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
