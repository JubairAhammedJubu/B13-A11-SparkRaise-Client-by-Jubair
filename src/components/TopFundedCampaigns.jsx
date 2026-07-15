'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ArrowRight, Tag, Coins, Target,
    Megaphone, Trophy
} from 'lucide-react';

function CampaignCard({ campaign, rank }) {
    const progress = campaign.funding_goal
        ? Math.min(100, ((campaign.amount_raised || 0) / campaign.funding_goal) * 100)
        : 0;

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
            }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none" />

            <div className="relative h-44 overflow-hidden">
                {campaign.campaign_image_url ? (
                    <img
                        src={campaign.campaign_image_url}
                        alt={campaign.campaign_title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                        <Megaphone className="w-16 h-16 text-white/30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg border border-white/10 backdrop-blur-sm">
                    <Trophy className="w-3 h-3" />
                    #{rank} Top Funded
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                    <Tag className="w-3 h-3" />
                    {campaign.category}
                </div>
            </div>

            <div className="p-4 relative z-10">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {campaign.campaign_title}
                </h3>

                <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                            <Coins className="w-3.5 h-3.5" /> {(campaign.amount_raised || 0).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                            <Target className="w-3.5 h-3.5" /> {(campaign.funding_goal || 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                        <p className="text-xs text-gray-400">funded</p>
                        <p className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                            {progress.toFixed(0)}%
                        </p>
                    </div>
                    <Link
                        href={`/campaigns/${campaign._id}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                        View
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </motion.div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="h-44 bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div className="p-4 space-y-4">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/2 animate-pulse" />
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="space-y-1">
                        <div className="h-3 w-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export default function TopFundedCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRef = useRef(null);
    const pathname = usePathname();

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    });
    const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);

    const fetchTopFunded = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/top-funded`);
            const data = await res.json();
            setCampaigns(Array.isArray(data) ? data : []);
        } catch {
            console.error('Failed to fetch top funded campaigns');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (pathname === '/') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchTopFunded();
        }
    }, [pathname, fetchTopFunded]);

    if (!isLoading && campaigns.length === 0) return null;

    return (
        <section ref={sectionRef} className="relative py-24 overflow-hidden">

            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    style={{ y: y1 }}
                    className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-[120px]"
                />
                <motion.div
                    style={{ y: y2 }}
                    className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-[120px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
                >
                    <div>
                        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                            Community Favorites
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                            Top Funded{' '}
                            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                                Campaigns
                            </span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-base max-w-lg">
                            The campaigns supporters are rallying behind right now — ranked automatically by credits raised.
                        </p>
                    </div>

                    <Link
                        href="/campaigns"
                        className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-200"
                    >
                        Explore All Campaigns
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {campaigns.map((campaign, index) => (
                            <CampaignCard key={campaign._id} campaign={campaign} rank={index + 1} />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
