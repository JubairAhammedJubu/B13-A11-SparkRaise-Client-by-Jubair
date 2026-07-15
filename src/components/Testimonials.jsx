'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Quote, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "Ariana Cole",
    role: "Supporter · 12 campaigns backed",
    avatar:
      "https://ui-avatars.com/api/?name=Ariana+Cole&background=6366f1&color=fff&size=64",
    quote:
      "I love that I can see exactly where my credits go — from pledge to approval. It makes backing small creators feel a lot less like a leap of faith.",
  },
  {
    name: "Marcus Webb",
    role: "Creator · Solar Water Purifier",
    avatar:
      "https://ui-avatars.com/api/?name=Marcus+Webb&background=10b981&color=fff&size=64",
    quote:
      "SparkRaise made it simple to launch and track funding in real time. Withdrawing our raised credits once we hit the goal was refreshingly painless.",
  },
  {
    name: "Priya Nair",
    role: "Supporter · Community campaigns",
    avatar:
      "https://ui-avatars.com/api/?name=Priya+Nair&background=8b5cf6&color=fff&size=64",
    quote:
      "Buying credits once and using them across multiple campaigns beats re-entering payment details every time. Small thing, but it matters.",
  },
  {
    name: "Daniel Ortiz",
    role: "Creator · Indie Game Studio",
    avatar:
      "https://ui-avatars.com/api/?name=Daniel+Ortiz&background=f59e0b&color=fff&size=64",
    quote:
      "The approval workflow kept our backers' trust intact — nothing gets counted until we actually confirm it. That transparency won us repeat supporters.",
  },
  {
    name: "Leah Sun",
    role: "Supporter · First-time backer",
    avatar:
      "https://ui-avatars.com/api/?name=Leah+Sun&background=ef4444&color=fff&size=64",
    quote:
      "Signed up, bought a small credit pack, and backed a local charity campaign in under five minutes. Genuinely that easy.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Loved by Supporters{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              and Creators
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
            Real stories from the people funding and building on SparkRaise.
          </p>
        </motion.div>

        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, delay: 0.1}}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{delay: 1500, disableOnInteraction: false}}
            pagination={{clickable: true}}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: {slidesPerView: 2},
            }}
            className="pb-12"
          >
            {TESTIMONIALS.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="h-full bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
                  <Quote className="w-8 h-8 text-indigo-200 dark:text-indigo-900 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 mb-5">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{t.role}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5 flex-shrink-0">
                      {[...Array(5)].map((_, s) => (
                        <Star
                          key={s}
                          className="w-3 h-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
