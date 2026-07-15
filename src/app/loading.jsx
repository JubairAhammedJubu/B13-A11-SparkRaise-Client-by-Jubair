export default function Loading() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#0f1117]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
            <div
              className="absolute inset-2 rounded-full border-4 border-transparent border-t-violet-400 animate-spin"
              style={{animationDuration: "0.6s", animationDirection: "reverse"}}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              SparkRaise
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Loading your journey...
            </span>
          </div>
        </div>
      </div>
    );
}