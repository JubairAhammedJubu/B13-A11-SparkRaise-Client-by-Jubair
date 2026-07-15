import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="space-y-6 max-w-2xl">
                <div className="text-9xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                    404
                </div>
                <div className="text-6xl animate-pulse">🚀🌌</div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Sorry, we’ve searched the galaxy but weren’t able to locate that page.
                </h1>

                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-medium shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-200"
                >
                    <ArrowLeft className="w-4 h-4" /> Return to Home
                </Link>
            </div>
        </div>
    );
}