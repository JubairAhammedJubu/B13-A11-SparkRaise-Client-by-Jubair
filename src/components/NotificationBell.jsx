'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

function timeAgo(dateString) {
    const diff = (new Date() - new Date(dateString)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationBell() {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const session = await authClient.getSession();
            const token = session?.data?.session?.token;
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
                headers: { authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch {
            // fail silently — notifications are non-critical
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Poll every 30s so the bell stays fresh without a websocket
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Click-outside-to-close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const getToken = async () => {
        const session = await authClient.getSession();
        return session?.data?.session?.token;
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            setNotifications((prev) =>
                prev.map((n) => n._id === notification._id ? { ...n, read: true } : n)
            );
            try {
                const token = await getToken();
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notification._id}/read`, {
                    method: 'PATCH',
                    headers: { authorization: `Bearer ${token}` },
                });
            } catch {
                // non-critical
            }
        }
        setIsOpen(false);
        if (notification.actionRoute) router.push(notification.actionRoute);
    };

    const handleMarkAllRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        try {
            const token = await getToken();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`, {
                method: 'PATCH',
                headers: { authorization: `Bearer ${token}` },
            });
        } catch {
            // non-critical
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl z-50 overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {isLoading ? (
                                <div className="py-8 text-center text-xs text-gray-400">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="py-10 text-center">
                                    <Inbox className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.slice(0, 20).map((n) => (
                                    <button
                                        key={n._id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`w-full text-left px-4 py-3 flex items-start gap-2.5 border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                                            }`}
                                    >
                                        {!n.read && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                                        )}
                                        <div className={`min-w-0 ${n.read ? 'pl-4' : ''}`}>
                                            <p className={`text-xs leading-relaxed ${!n.read ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.time)}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
