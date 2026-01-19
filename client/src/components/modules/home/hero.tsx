/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";
import TravelPlanCard from "../travel-plans/travelPlanCard";
import Link from "next/link";
import { TravelPlan } from "@/components/types/travelPlan";
import { User } from "@/components/types/user";
import PremiumItineraryClient from "../local-ai/localai";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface HeroProps {
  travelPlans: TravelPlan[];
  user?: User | null;
}

export default function Hero({ travelPlans, user }: HeroProps) {
  const travelPlansRef = useRef<HTMLDivElement>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [plans, setPlans] = useState(travelPlans);
  const [loading, setLoading] = useState(false);

  const scrollToTravelPlans = () => {
    if (travelPlansRef.current) {
      travelPlansRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const fetchPlans = async (type?: string) => {
    setLoading(true);
    try {
      const query = type ? `?travelType=${type}` : "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/travel-plans/feed${query}`,
      );
      const data = await res.json();
      setPlans(data.data?.data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
    fetchPlans(type);
  };

  return (
    <div className="w-full mt-4 flex flex-col gap-12 px-4 sm:px-6 md:px-10 transition-colors">
      {/* Hero Banner */}
      <section className="h-[60vh] sm:h-[70vh] md:h-[80vh] flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 sm:p-10 rounded-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4"
        >
          Explore Bangladesh With Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg md:max-w-2xl"
        >
          Discover the beauty of Bangladesh, explore hidden gems, and plan your
          perfect journey.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTravelPlans}
          className="
    mt-6
    px-4 sm:px-6 py-2 sm:py-3
    text-sm sm:text-base
    cursor-pointer
    bg-white text-blue-600 font-semibold
    rounded-lg shadow-lg
  "
        >
          Explore Travel Plans
        </motion.button>
      </section>

      {/* Explore Travel Plans */}
      <section
        ref={travelPlansRef}
        className="w-full py-5 bg-white dark:bg-black rounded-xl sm:rounded-2xl"
      >
        <div className="text-center max-w-xl sm:max-w-3xl md:max-w-6xl mx-auto mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Explore Travel Plans
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
            Find the best trips and adventures for your next journey.
          </p>
        </div>

        <div className="mx-auto  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {travelPlans.map((plan) => (
            <Link
              key={plan.id}
              href={`/travel-plans/${plan.id}`}
              className="block"
            >
              <TravelPlanCard {...plan} />
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link
            href="/travel-plans"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            See More
            <span className="text-lg sm:text-xl">→</span>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="p-6 sm:p-8 md:p-10 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow dark:shadow-gray-700 transition-colors">
        <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 dark:text-gray-100">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
              className="p-4 sm:p-6 bg-zinc-100 dark:bg-gray-700 rounded-xl shadow dark:shadow-gray-600 transition-colors text-center"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-900 dark:text-gray-100">
                {item}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
                We ensure the best travel experience for you.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Travel Categories */}
      <section className="p-4 sm:p-6 md:p-10 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow dark:shadow-gray-700 transition-colors">
        <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 dark:text-gray-100">
          Travel Type
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
          {["SOLO", "FAMILY", "FRIENDS", "COUPLE", "GROUP"].map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleTypeClick(cat)}
              className={`p-4 sm:p-5 md:p-6 flex flex-col items-center justify-center rounded-xl border shadow-md cursor-pointer transition-all duration-300 text-center ${
                selectedType === cat
                  ? "bg-blue-500 text-white dark:bg-blue-600 shadow-lg"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <h3 className="text-sm sm:text-base md:text-lg font-semibold">
                {cat}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Travel Plans Cards */}
      <section className="w-full ">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-60 sm:h-72 md:h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {!loading && plans.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-base sm:text-lg">
            No travel plans found.
          </p>
        )}

        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(selectedType ? plans : plans.slice(0, 4)).map((plan) => (
            <Link
              key={plan.id}
              href={`/travel-plans/${plan.id}`}
              className="block"
            >
              <motion.div
                className=" md:h-120  "
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <TravelPlanCard {...plan} />
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium Itinerary */}
      <section className=" p-4 bg-white dark:bg-gray-900 w-full rounded-xl md:mb-6 sm:rounded-2xl shadow dark:shadow-gray-700 transition-colors">
        <PremiumItineraryClient user={user} />
      </section>

      {/* {newsletter section } */}
      <section className="w-full py-12 px-4 mb-8 md:mb-12 sm:px-6  bg-white dark:bg-gray-900 rounded-2xl flex flex-col items-center gap-6 shadow-lg transition-colors">
        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-white">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-center text-sm sm:text-base md:text-lg max-w-2xl text-gray-700 dark:text-gray-300">
          Get the latest travel plans, tips, and special deals delivered to your
          inbox.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const email = (
              e.currentTarget.elements.namedItem("email") as HTMLInputElement
            ).value;
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newsletter/subscribe`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                },
              );

              const data = await res.json();

              if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
              }

              toast.success(data.message);
            } catch (err: any) {
              toast.error(err.message || "Failed to subscribe");
              console.error(err);
            }
          }}
          className="flex flex-col sm:flex-row gap-2 w-full max-w-md"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 sm:py-3 rounded-lg border focus:outline-none text-gray-900 dark:text-gray-100 text-sm sm:text-base"
          />
          <button
            type="submit"
            className="px-6 py-2 cursor-pointer sm:py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600 transition text-sm sm:text-base"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
