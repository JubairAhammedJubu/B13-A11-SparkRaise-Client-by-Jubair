'use client';

import { motion } from 'framer-motion';
import { Search, HeartHandshake, TrendingUp, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    icon: Search,
    title: 'Discover a Campaign',
    description:
      'Browse approved campaigns by category, funding goal, or deadline and find a project you actually care about.',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    id: 2,
    icon: HeartHandshake,
    title: 'Contribute Credits',
    description:
      'Pledge any amount above the campaign\'s minimum contribution using your platform credits — purchased 10 credits per dollar.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 3,
    icon: TrendingUp,
    title: 'Track the Impact',
    description:
      'Follow your contribution status from pending to approved, get notified on every update, and watch the campaign grow.',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-20 bg-white dark:bg-[#0f1117] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-xs font-bold tracking-widest text-indigo-500 uppercase">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Three steps to back an idea
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            No paperwork, no middlemen — just credits moving from supporters to the creators building something worth funding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative bg-gray-50 dark:bg-[#1a1d24] rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <span className="absolute top-6 right-6 text-4xl font-black text-gray-100 dark:text-gray-800">
                0{step.id}
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>

              {index < STEPS.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 dark:text-gray-700 z-10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
