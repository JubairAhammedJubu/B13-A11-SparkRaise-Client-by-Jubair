'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Bell,
  HeadphonesIcon,
  Eye,
  Coins,
  Wallet,
} from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: ShieldCheck,
      title: 'Verified Campaigns',
      description:
        'Every campaign is reviewed by our team before it goes live, so you know exactly what you\'re backing.',
      gradient: 'from-indigo-500 to-violet-500',
      shadow: 'shadow-indigo-500/20',
    },
    {
      id: 2,
      icon: Bell,
      title: 'Instant Notifications',
      description:
        'Get notified the moment your contribution is reviewed, or when your campaign gets a new supporter.',
      gradient: 'from-cyan-500 to-blue-500',
      shadow: 'shadow-cyan-500/20',
    },
    {
      id: 3,
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description:
        'Our dedicated support team is available round the clock to assist you with any queries.',
      gradient: 'from-violet-500 to-fuchsia-500',
      shadow: 'shadow-violet-500/20',
    },
    {
      id: 4,
      icon: Eye,
      title: 'Transparent Tracking',
      description:
        'Watch funding progress update in real time, credit by credit, for every campaign you follow.',
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20',
    },
    {
      id: 5,
      icon: Coins,
      title: 'Simple Credits System',
      description:
        'Buy credits once via Stripe, then use them to back as many campaigns as you like — no repeat checkouts.',
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20',
    },
    {
      id: 6,
      icon: Wallet,
      title: 'Easy Withdrawals',
      description:
        'Creators can cash out raised credits to real payouts as soon as they hit the minimum threshold.',
      gradient: 'from-rose-500 to-pink-500',
      shadow: 'shadow-rose-500/20',
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
            Why SparkRaise
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              SparkRaise?
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
            A crowdfunding experience built on transparency, speed, and trust —
            for supporters and creators alike.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{opacity: 0, rotateY: 90, transformPerspective: 1000}}
              whileInView={{
                opacity: 1,
                rotateY: 0,
                transformPerspective: 1000,
                transition: {
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              viewport={{once: true, amount: 0.2}}
              whileHover={{
                y: -8,
                rotateY: -6,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.08)",
                transition: {duration: 0.2},
              }}
              className="group relative bg-white dark:bg-[#1a1d24] rounded-2xl p-6
                border border-gray-100 dark:border-gray-800
                shadow-sm hover:shadow-2xl
                transition-shadow duration-500 overflow-hidden
                transform-gpu"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-2xl`}
              />

              <div className="flex flex-col items-start">
                <motion.div
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.shadow} shadow-lg flex items-center justify-center mb-5`}
                  animate={{
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      "0px 8px 24px rgba(99,102,241,0)",
                      "0px 8px 24px rgba(99,102,241,0.2)",
                      "0px 8px 24px rgba(99,102,241,0)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.4,
                    ease: "easeInOut",
                  }}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </motion.div>

                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl`}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once: true}}
          transition={{duration: 0.6, delay: 0.2}}
          className="mt-16"
        >
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-6">
            Platform Impact in Numbers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {value: "10K+", label: "Supporters Onboard"},
              {value: "500+", label: "Campaigns Launched"},
              {value: "2M+", label: "Credits Contributed"},
              {value: "4.9★", label: "Average Rating"},
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{scale: 1.03, transition: {duration: 0.2}}}
                className="text-center p-6 rounded-2xl bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <motion.p
                  initial={{scale: 0.8, opacity: 0}}
                  whileInView={{scale: 1, opacity: 1}}
                  viewport={{once: true}}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: i * 0.1,
                  }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent mb-1"
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
