'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Flag, Loader2, Calendar, User,
    AlertTriangle, Ban, Trash2, ExternalLink, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { resolveReport } from '@/lib/actions/reports';

const STATUS_CONFIG = {
    open: { label: 'Open', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' },
    suspended: { label: 'Campaign Suspended', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' },
    resolved: { label: 'Campaign Deleted', color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800/40', border: 'border-gray-200 dark:border-gray-700' },
};

export default function ReportsClient() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
                headers: { authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setReports(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load reports');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        setActionLoading(id + action);
        try {
            const result = await resolveReport(id, action);
            if (result?.success) {
                toast.success(action === 'suspend' ? 'Campaign suspended' : 'Campaign deleted');
                setReports(prev => prev.map(r => r._id === id
                    ? { ...r, status: action === 'suspend' ? 'suspended' : 'resolved' }
                    : r));
            } else {
                toast.error(result?.message || 'Action failed');
            }
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    const openReports = reports.filter(r => r.status === 'open').length;

    return (
        <div className="p-6 pt-8 max-w-5xl mx-auto space-y-6 mt-4">

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Campaign Reports</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {openReports} open report{openReports !== 1 ? 's' : ''} awaiting review
                </p>
            </motion.div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
            ) : reports.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800">
                    <Flag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No reports have been filed</p>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    {reports.map((report, i) => {
                        const status = STATUS_CONFIG[report.status] || STATUS_CONFIG.open;
                        const isResolved = report.status !== 'open';

                        return (
                            <motion.div
                                key={report._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link
                                                href={`/campaigns/${report.campaign_id}`}
                                                className="font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-500 flex items-center gap-1.5"
                                            >
                                                {report.campaign_title}
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {report.reporter_name}</span>
                                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(report.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                    <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bg} ${status.border} border text-xs font-semibold ${status.color}`}>
                                        {isResolved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                        {status.label}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 mb-4">
                                    {report.reason}
                                </p>

                                {!isResolved && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAction(report._id, 'suspend')}
                                            disabled={!!actionLoading}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-100 transition-all disabled:opacity-50"
                                        >
                                            {actionLoading === report._id + 'suspend' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                                            Suspend Campaign
                                        </button>
                                        <button
                                            onClick={() => handleAction(report._id, 'delete')}
                                            disabled={!!actionLoading}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-500 text-xs font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
                                        >
                                            {actionLoading === report._id + 'delete' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                            Delete Campaign
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}
