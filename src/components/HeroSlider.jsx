'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Rocket, HeartHandshake, Tag } from 'lucide-react';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Technology', value: 'Technology' },
  { label: 'Art & Design', value: 'Art & Design' },
  { label: 'Community', value: 'Community' },
  { label: 'Charity', value: 'Charity' },
];

const slides = [
  {
    id: 1,
    title: 'Fund Ideas',
    highlight: 'That Matter',
    subtitle: 'Back the projects, causes, and creators you believe in — one credit at a time.',
    image: 'https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 2,
    title: 'Launch Your',
    highlight: 'Own Campaign',
    subtitle: 'Turn your idea into reality. Set a goal, tell your story, and let supporters carry you there.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 3,
    title: 'Transparent,',
    highlight: 'Credit by Credit',
    subtitle: 'Every contribution is tracked openly — from pledge, to approval, to impact.',
    image: 'https://images.pexels.com/photos/7551442/pexels-photo-7551442.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 4,
    title: 'Small Credits,',
    highlight: 'Big Impact',
    subtitle: 'Communities, creators, and causes grow when supporters show up together.',
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
];

const HeroSlider = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    router.push(`/campaigns?${params.toString()}`);
  };

  return (
    <div className="relative w-full h-[680px] md:h-[780px] overflow-hidden">

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 z-20 flex flex-col md:justify-center justify-start px-6 sm:px-12 lg:px-20 pt-24 md:pt-0 pb-32 md:pb-0">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl space-y-4"
            >

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Crowdfunding, Reimagined
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                {slides[activeIndex]?.title}{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {slides[activeIndex]?.highlight}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-base md:text-lg text-gray-300 max-w-lg leading-relaxed"
              >
                {slides[activeIndex]?.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-3 pt-2"
              >
                <button
                  onClick={() => router.push('/campaigns')}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
                >
                  <HeartHandshake className="w-4 h-4" />
                  Explore Campaigns
                </button>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  <Rocket className="w-4 h-4" />
                  Start a Campaign
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-30 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-3 px-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${category === cat.value
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-white/10 backdrop-blur-md text-white/70 hover:bg-white/20 border border-white/10'
                  }`}
              >
                <Tag className="w-3 h-3" />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="bg-white/95 dark:bg-[#0f1117]/90 backdrop-blur-xl rounded-2xl p-3 shadow-2xl shadow-black/30 border border-white/20 dark:border-gray-800">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 w-full relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-indigo-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search campaigns (e.g. clean water, indie game)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-400 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-20 right-6 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
        <span className="text-indigo-400">{activeIndex + 1}</span>
        <span className="text-white/30">/</span>
        <span>{slides.length}</span>
      </div>

    </div>
  );
};

export default HeroSlider;
