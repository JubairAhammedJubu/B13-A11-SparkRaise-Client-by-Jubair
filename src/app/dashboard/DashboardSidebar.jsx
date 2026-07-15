'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, clearAccessToken, useSession } from '@/lib/auth-client';
import { useLiveCredits } from '@/lib/hooks/useLiveCredits';
import toast from 'react-hot-toast';
import NotificationBell from '@/components/NotificationBell';
import {
  LayoutDashboard, User, Heart, Rocket, Coins,
  Plus, ClipboardList, Wallet, Receipt,
  Users, LogOut, ChevronLeft, Compass,
  ChevronRight, Shield, Menu, X, Flag, Megaphone
} from 'lucide-react';

const NAV_LINKS = {
  supporter: [
    { label: 'Overview', href: '/dashboard/supporter', icon: LayoutDashboard },
    { label: 'My Profile', href: '/dashboard/supporter/profile', icon: User },
    { label: 'Explore Campaigns', href: '/campaigns', icon: Compass },
    { label: 'My Contributions', href: '/dashboard/supporter/my-contributions', icon: Heart },
    { label: 'Purchase Credit', href: '/dashboard/supporter/purchase-credit', icon: Coins },
    { label: 'Payment History', href: '/dashboard/supporter/payment-history', icon: Receipt },
  ],
  creator: [
    { label: 'Overview', href: '/dashboard/creator', icon: LayoutDashboard },
    { label: 'My Profile', href: '/dashboard/creator/profile', icon: User },
    { label: 'Add Campaign', href: '/dashboard/creator/add-campaign', icon: Plus },
    { label: 'My Campaigns', href: '/dashboard/creator/my-campaigns', icon: ClipboardList },
    { label: 'Withdrawals', href: '/dashboard/creator/withdrawals', icon: Wallet },
    { label: 'Payment History', href: '/dashboard/creator/payment-history', icon: Receipt },
  ],
  admin: [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'My Profile', href: '/dashboard/admin/profile', icon: User },
    { label: 'Campaign Approvals', href: '/dashboard/admin/campaigns', icon: Megaphone },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Withdrawal Requests', href: '/dashboard/admin/withdrawals', icon: Wallet },
    { label: 'Reports', href: '/dashboard/admin/reports', icon: Flag },
  ],
};

const ROLE_CONFIG = {
  supporter: { label: 'Supporter', color: 'from-indigo-500 to-violet-500', icon: Heart },
  creator: { label: 'Creator', color: 'from-emerald-500 to-teal-500', icon: Rocket },
  admin: { label: 'Admin', color: 'from-red-500 to-rose-500', icon: Shield },
};

export default function DashboardSidebar({ user: serverUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const user = session?.user || serverUser;
  const role = user?.role || 'supporter';

  const links = NAV_LINKS[role] || NAV_LINKS.supporter;
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.supporter;
  const RoleIcon = roleConfig.icon;

  const { credits: liveCredits, raisedCredits: liveRaisedCredits } = useLiveCredits(user);
  const creditsToShow = role === 'creator' ? liveRaisedCredits : liveCredits;
  const creditsLabel = role === 'creator' ? 'raised' : 'credits';

  const handleSignOut = async () => {
    await signOut();
    clearAccessToken();
    toast.success('Signed out successfully!');
    router.push('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* User Profile Card */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-shrink-0">
              <img
                src={
                  user?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "U",
                  )}&background=6366f1&color=fff&size=40`
                }
                alt={user?.name}
                className="w-10 h-10 rounded-xl object-cover border-2 border-indigo-100 dark:border-indigo-900"
              />

              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${roleConfig.color} flex items-center justify-center`}
              >
                <RoleIcon className="w-2.5 h-2.5 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {user?.name}
                  </p>

                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="hidden lg:block">
                  <NotificationBell />
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${roleConfig.color} text-white`}
                >
                  {roleConfig.label}
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
                  <Coins className="w-3 h-3" />
                  {creditsToShow.toLocaleString()} {creditsLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400"
              } ${isCollapsed ? "justify-center px-2" : ""}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{link.label}</span>}

              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {link.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 w-10 h-10 rounded-xl bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile-only floating notification bell, since the sidebar itself is hidden below lg */}
      <div className="lg:hidden fixed top-20 right-4 z-40">
        <NotificationBell />
      </div>  

      <aside className={`hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-[#1a1d24] border-r border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
        }`}>
        {SidebarContent()}
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#1a1d24] border-r border-gray-100 dark:border-gray-800 shadow-xl z-50"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
              {SidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
