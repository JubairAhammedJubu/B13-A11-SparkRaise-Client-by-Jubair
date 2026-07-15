'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Coins, DollarSign, Wallet, Loader2,
    Clock3, CheckCircle, AlertTriangle, Send, CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { createWithdrawal } from '@/lib/actions/withdrawals';

const PAYMENT_SYSTEMS = ['Stripe', 'bKash', 'Nagad', 'Rocket', 'Bank Transfer', 'PayPal'];
const MIN_WITHDRAWAL_CREDITS = 200;
const CREDITS_PER_DOLLAR = 20;

export default function WithdrawalsClient({ user }) {
    const [stats, setStats] = useState({ raisedCredits: 0, withdrawableDollars: 0 });
    const [withdrawals, setWithdrawals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        withdrawal_credit: '',
        payment_system: '',
        account_number: '',
    });

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

            const [statsRes, withdrawalsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creator/stats`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals`, { headers }),
            ]);

            setStats(await statsRes.json());
            const w = await withdrawalsRes.json();
            setWithdrawals(Array.isArray(w) ? w : []);
        } catch {
            toast.error('Failed to load withdrawal data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const canWithdraw = (stats.raisedCredits || 0) >= MIN_WITHDRAWAL_CREDITS;
    const requestedAmount = form.withdrawal_credit ? (Number(form.withdrawal_credit) / CREDITS_PER_DOLLAR) : 0;

    const handleSubmit = async () => {
        if (!canWithdraw) return;
        if (!form.withdrawal_credit || Number(form.withdrawal_credit) <= 0) return toast.error('Enter a valid credit amount');
        if (Number(form.withdrawal_credit) > (stats.raisedCredits || 0)) return toast.error('Amount exceeds your available raised credits');
        if (!form.payment_system) return toast.error('Select a payment method');
        if (!form.account_number.trim()) return toast.error('Enter your account/wallet number');

        setIsSubmitting(true);
        try {
            const result = await createWithdrawal({
                withdrawal_credit: Number(form.withdrawal_credit),
                payment_system: form.payment_system,
                account_number: form.account_number.trim(),
            });
            if (result?.insertedId) {
                toast.success('Withdrawal request submitted!');
                setForm({ withdrawal_credit: '', payment_system: '', account_number: '' });
                fetchData();
            } else {
                toast.error(result?.message || 'Failed to submit request');
            }
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 pt-8 max-w-3xl mx-auto space-y-6 mt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Withdrawals</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Cash out the credits your campaigns have raised</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-4"
            >
                <div className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-3">
                        <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Available Raised Credits</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{(stats.raisedCredits || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-violet-100 dark:border-violet-800 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-3">
                        <DollarSign className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Withdrawable Value</p>
                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">${(stats.withdrawableDollars || 0).toFixed(2)}</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
            >
                <div className="flex items-center gap-2 mb-5">
                    <Wallet className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Request a Withdrawal</h2>
                </div>

                {!canWithdraw ? (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                                Insufficient credit to withdraw
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                                You need at least {MIN_WITHDRAWAL_CREDITS} raised credits before you can request a withdrawal.
                                You currently have {(stats.raisedCredits || 0).toLocaleString()}.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Credits to Withdraw</label>
                            <div className="relative">
                                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="withdrawal_credit"
                                    value={form.withdrawal_credit}
                                    onChange={handleChange}
                                    min="1"
                                    max={stats.raisedCredits}
                                    placeholder={`Up to ${stats.raisedCredits}`}
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
                                />
                            </div>
                            {form.withdrawal_credit > 0 && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5">
                                    ≈ ${requestedAmount.toFixed(2)} at {CREDITS_PER_DOLLAR} credits = $1
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Payment Method</label>
                            <div className="flex flex-wrap gap-2">
                                {PAYMENT_SYSTEMS.map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => setForm((prev) => ({ ...prev, payment_system: method }))}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${form.payment_system === method
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-emerald-300'
                                            }`}
                                    >
                                        <CreditCard className="w-3 h-3" />
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Account / Wallet Number</label>
                            <input
                                type="text"
                                name="account_number"
                                value={form.account_number}
                                onChange={handleChange}
                                placeholder="e.g. 01XXXXXXXXX"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
                            ) : (
                                <><Send className="w-4 h-4" />Request Withdrawal</>
                            )}
                        </button>
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5"
            >
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Your Withdrawal Requests</h2>
                {withdrawals.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">No withdrawal requests yet</p>
                ) : (
                    <div className="space-y-3">
                        {withdrawals.map((w) => (
                            <div key={w._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${w.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                                    {w.status === 'approved'
                                        ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        : <Clock3 className="w-4 h-4 text-amber-500" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {w.withdrawal_credit} credits · ${w.withdrawal_amount?.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-400">{w.payment_system} · {w.account_number}</p>
                                </div>
                                <span className={`text-xs font-semibold flex-shrink-0 ${w.status === 'approved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                    {w.status === 'approved' ? 'Paid' : 'Pending'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
