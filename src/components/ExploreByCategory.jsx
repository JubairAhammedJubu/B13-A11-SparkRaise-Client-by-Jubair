'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

const ExploreByCategory = () => {
  const categories = [
    {
      id: 1,
      name: 'Technology',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Gadgets, apps, and hardware pushing what\'s possible.',
    },
    {
      id: 2,
      name: 'Art & Design',
      image: 'https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Illustration, sculpture, and design projects worth backing.',
    },
    {
      id: 3,
      name: 'Music',
      image: 'https://images.pexels.com/photos/1749822/pexels-photo-1749822.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Albums, tours, and instruments from independent artists.',
    },
    {
      id: 4,
      name: 'Games',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Indie video games and tabletop projects in the making.',
    },
    {
      id: 5,
      name: 'Community',
      image: 'https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Local initiatives that bring neighborhoods together.',
    },
    {
      id: 6,
      name: 'Charity',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Causes and relief efforts that need a helping hand.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      },
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
          Browse by Interest
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Explore Campaigns by{' '}
          <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            Category
          </span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
          Whatever you care about, there&apos;s a campaign worth backing.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            variants={itemVariants}
            whileHover={{ y: -6, boxShadow: "0px 16px 40px rgba(99, 102, 241, 0.15)" }}
            whileTap={{ scale: 0.96 }}
            className="group relative bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md cursor-pointer"
          >
            <div className="relative h-[320px] md:h-[340px] w-full overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500" />

              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-amber-400 flex items-center gap-1.5 text-xs font-medium"
              >
                <Sparkles className="w-3 h-3 fill-current" />
                Trending
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 60, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 p-5 pt-10 bg-gradient-to-t from-black/90 via-black/70 to-transparent"
            >
              <h3 className="text-white text-lg font-bold mb-1.5">
                {cat.name}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-3">
                {cat.description}
              </p>

              <Link
                href={`/campaigns?category=${encodeURIComponent(cat.name)}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
              >
                <Compass className="w-3 h-3" />
                Explore {cat.name}
              </Link>
            </motion.div>

            <div className="absolute bottom-4 left-4 right-4 sm:hidden group-hover:hidden block">
              <p className="text-white text-sm font-medium drop-shadow-md truncate">
                {cat.name}
              </p>
            </div>

          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ExploreByCategory;
