'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, authClient } from '@/lib/auth-client';
import { useLiveCredits, broadcastCreditsRefresh } from '@/lib/hooks/useLiveCredits';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target, Coins, ArrowRight, Gift, Tag,
    Calendar, ChevronLeft, X, AlertCircle,
    Flag, Shield, User as UserIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createContribution } from '@/lib/actions/contributions';

function Countdown({ deadline }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    const [isPast, setIsPast] = useState(false);

    useEffect(() => {
        const target = new Date(deadline);

        const tick = () => {
            const now = new Date();
            const diff = target - now;

            if (diff <= 0) {
                setIsPast(true);
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                mins: Math.floor((diff / (1000 * 60)) % 60),
                secs: Math.floor((diff / 1000) % 60),
            });
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [deadline]);

    if (isPast) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-500">Campaign ended</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hrs' },
                { value: timeLeft.mins, label: 'Min' },
                { value: timeLeft.secs, label: 'Sec' },
            ].map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center">
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {String(unit.value).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{unit.label}</span>
                </div>
            ))}
        </div>
    );
}

function ContributeModal({ campaign, credits, onClose }) {
    const router = useRouter();
    const [amount, setAmount] = useState(campaign.minimum_Contribution || 1);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const insufficientCredits = amount > credits;

    const handleContribute = async () => {
        if (amount < campaign.minimum_Contribution) {
            toast.error(`Minimum contribution is ${campaign.minimum_Contribution} credits`);
            return;
        }
        if (insufficientCredits) {
            toast.error('Insufficient credits. Please purchase more.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await createContribution({
                campaign_id: campaign._id,
                Contribution_amount: Number(amount),
                message,
            });

            if (result?.insertedId) {
                toast.success('Contribution submitted! 🎉');
                broadcastCreditsRefresh();
                onClose();
                router.push('/dashboard/supporter/my-contributions');
            } else {
                toast.error(result?.message || 'Contribution failed. Try again.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 w-full max-w-md bg-white dark:bg-[#1a1d24] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-gradient-to-r from-indigo-600 to-violet-600 p-5 flex flex-col justify-end">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <h3 className="text-white font-bold text-lg">{campaign.campaign_title}</h3>
                    <p className="text-white/70 text-sm">You have {credits.toLocaleString()} credits available</p>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                            Contribution Amount (credits)
                        </label>
                        <div className="relative">
                            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                min={campaign.minimum_Contribution}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">Minimum: {campaign.minimum_Contribution} credits</p>
                        {insufficientCredits && (
                            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Insufficient credits —{' '}
                                <Link href="/dashboard/supporter/purchase-credit" className="underline">buy more</Link>
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                            Message (optional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            placeholder="Say something encouraging..."
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all resize-none"
                        />
                    </div>

                    <button
                        onClick={handleContribute}
                        disabled={isLoading || insufficientCredits}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Contribute {amount} credits</>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" />
                        Credits are held until the creator reviews your contribution
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

function ReportModal({ campaign, onClose }) {
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReport = async () => {
        if (!reason.trim()) {
            toast.error('Please describe the issue');
            return;
        }
        setIsLoading(true);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    campaign_id: campaign._id,
                    campaign_title: campaign.campaign_title,
                    reason: reason.trim(),
                }),
            });
            const data = await res.json();
            if (data.insertedId) {
                toast.success('Report submitted. Our admin team will review it.');
                onClose();
            } else {
                toast.error(data.message || 'Failed to submit report');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1a1d24] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-red-500" /> Report Campaign
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    placeholder="Tell us what seems wrong with this campaign..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 transition-all resize-none mb-4"
                />
                <button
                    onClick={handleReport}
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Submitting...' : 'Submit Report'}
                </button>
            </motion.div>
        </motion.div>
    );
}

export default function CampaignDetailsClient({ campaign }) {
    const [showContribute, setShowContribute] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;
    const isSupporter = user?.role === 'supporter';
    // Reads /api/users/me directly instead of the cached Better Auth session,
    // so this always reflects the real balance (e.g. right after a Stripe
    // purchase or a previous contribution), not what it was at login.
    const { credits } = useLiveCredits(isSupporter ? user : null);

    const isPast = new Date(campaign.deadline) < new Date();
    const isDisabled = campaign.status !== 'approved' || isPast;
    const progress = campaign.funding_goal
        ? Math.min(100, ((campaign.amount_raised || 0) / campaign.funding_goal) * 100)
        : 0;

    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const handleContributeClick = () => {
        if (!user) {
            toast.error('Please sign in to contribute');
            return;
        }
        if (!isSupporter) {
            toast.error('Only supporters can contribute to campaigns');
            return;
        }
        setShowContribute(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">

            <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
                {campaign.campaign_image_url && (
                    <Image
                        src={campaign.campaign_image_url}
                        alt={campaign.campaign_title}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0f1117] via-black/30 to-black/20" />

                <Link
                    href="/campaigns"
                    className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white text-sm font-medium hover:bg-black/50 transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Link>

                <div className="absolute top-20 right-4 sm:right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-white/20 backdrop-blur-md">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-600">{campaign.category}</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                        {campaign.campaign_title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                        <UserIcon className="w-3.5 h-3.5" />
                                        <span>{campaign.creator_name}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowReport(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
                                >
                                    <Flag className="w-3.5 h-3.5" />
                                    Report
                                </button>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                                        <Coins className="w-4 h-4" /> {(campaign.amount_raised || 0).toLocaleString()} credits raised
                                    </span>
                                    <span className="flex items-center gap-1.5 text-gray-400">
                                        <Target className="w-4 h-4" /> Goal: {(campaign.funding_goal || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1.5">{progress.toFixed(0)}% funded</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Campaign Story</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                {campaign.campaign_story}
                            </p>
                        </motion.div>

                        {campaign.reward_info && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
                            >
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-indigo-500" />
                                    Reward Info
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.reward_info}</p>
                            </motion.div>
                        )}
                    </div>

                    <div className="space-y-5">

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Campaign ends in:
                            </p>
                            <Countdown deadline={campaign.deadline} />
                            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> {formatDate(campaign.deadline)}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24"
                        >
                            <div className="mb-4">
                                <p className="text-xs text-gray-400 mb-1">Minimum contribution</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                                    {campaign.minimum_Contribution} credits
                                </p>
                            </div>

                            <button
                                onClick={handleContributeClick}
                                disabled={isDisabled}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isPast
                                    ? 'Campaign Ended'
                                    : campaign.status !== 'approved'
                                        ? 'Not Yet Approved'
                                        : !user
                                            ? 'Sign In to Contribute'
                                            : !isSupporter
                                                ? 'Not Available for Your Role'
                                                : 'Contribute Now'}
                            </button>

                            {!isDisabled && (
                                <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                                    <ArrowRight className="w-3 h-3" />
                                    Every credit brings this campaign closer to its goal
                                </p>
                            )}
                        </motion.div>

                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showContribute && (
                    <ContributeModal
                        campaign={campaign}
                        credits={credits}
                        onClose={() => setShowContribute(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showReport && (
                    <ReportModal
                        campaign={campaign}
                        onClose={() => setShowReport(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
