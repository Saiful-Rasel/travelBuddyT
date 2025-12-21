"use client";
import { motion } from "framer-motion";
import TravelPlanCard from "../travel-plans/travelPlanCard";
import Link from "next/link";
import { TravelPlan } from "@/components/types/travelPlan";
import { User } from "@/components/types/user";
import PremiumItineraryClient from "../local-ai/localai";

interface HeroProps {
  travelPlans: TravelPlan[];
  user?: User | null;
}
export default function Hero({ travelPlans, user }: HeroProps) {
  
  return (
    <div className="w-full flex flex-col gap-20 px-4 md:px-10  transition-colors">
      {/* Hero Banner */}
      <section className="h-[80vh] flex flex-col items-center border mt-18 justify-center text-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-10 rounded-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-bold mb-4"
        >
          Explore Bangladesh With Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-lg max-w-2xl"
        >
          Discover the beauty of Bangladesh, explore hidden gems, and plan your
          perfect journey.
        </motion.p>
      </section>
      {/* Popular Destinations */}
     
      {/* card  */}
      <section className="w-full py-5  bg-zinc-50 dark:bg-black">
        <div className="text-center max-w-6xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Explore Travel Plans
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Find the best trips and adventures for your next journey.
          </p>
        </div>

        {/* Cards grid */}
        <div className=" mx-auto lg:max-w-[1600px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {travelPlans.map((plan) => (
            <TravelPlanCard key={plan.id} {...plan} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href="/travel-plans"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold
               text-blue-600 hover:text-blue-700 transition"
          >
            See More
            <span className="text-lg">→</span>
          </Link>
        </div>
      </section>
    
      {/* Why Choose Us */}
      <section className="p-10 bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-gray-700 transition-colors">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Verified Travelers",
            "Best Recommendations",
            "Secure & Fast Booking",
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-zinc-100 dark:bg-gray-700 rounded-xl shadow dark:shadow-gray-600 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {item}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-gray-300">
                We ensure the best travel experience for you.
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Travel Categories */}
      <section className="p-10 bg-zinc-50 dark:bg-gray-900 rounded-2xl shadow dark:shadow-gray-700 transition-colors">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Travel Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {["SOLO", "FAMILY", "COUPLE", "GROUP"].map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm text-center transition-colors"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {cat}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="p-10 bg-zinc-50 dark:bg-gray-900 rounded-2xl shadow dark:shadow-gray-700 transition-colors">
        <PremiumItineraryClient user={user} />
      </section>
    </div>
  );
}
