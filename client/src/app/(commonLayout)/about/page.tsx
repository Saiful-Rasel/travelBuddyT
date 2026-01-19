// src/pages/About.tsx
import Link from "next/link";
import React from "react";

const About = () => {
  return (
    <div className="pt-4 md:pt-8 bg-white dark:bg-black transition-colors duration-300">
      <div className="bg-white dark:bg-black  px-12 text-black dark:text-white min-h-screen transition-colors duration-300">
        <section className=" dark:bg-gray-900 rounded-xl bg-gray-100 dark:text-white py-20 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Bangladesh, One Journey at a Time
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            TravelBuddy makes planning trips in Bangladesh effortless, fun, and
            safe—whether it’s city tours, nature adventures, or cultural
            journeys.
          </p>
        </section>

        <section className="py-16 px-6 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Our Mission & Vision</h2>
          <p className="text-lg mb-4">
            <strong>Mission:</strong> To empower travelers to discover the
            beauty, culture, and adventure of Bangladesh while providing
            seamless travel planning tools.
          </p>
          <p className="text-lg">
            <strong>Vision:</strong> To become Bangladesh’s most trusted travel
            platform for curated travel plans, local experiences, and
            unforgettable memories.
          </p>
        </section>

        <section className="py-16 rounded-xl px-6 bg-gray-100 dark:bg-gray-900">
          <h2 className="text-3xl font-semibold text-center mb-12">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">
                Curated Travel Plans
              </h3>
              <p>
                Pre-made itineraries for destinations like Sundarbans, Cox’s
                Bazar, Sylhet, and more.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">
                Custom Trip Builder
              </h3>
              <p>
                Create trips matching your budget, dates, and interests with
                ease.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Local Experiences</h3>
              <p>
                Connect with guides, explore local cuisine, and immerse in
                culture.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">
                Community & Reviews
              </h3>
              <p>
                Check feedback from other travelers before planning your
                journey.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-10">How It Works</h2>
          <ol className="list-decimal list-inside text-left space-y-4 text-lg">
            <li>
              <strong>Explore:</strong> Browse curated travel plans or create
              your own.
            </li>
            <li>
              <strong>Plan:</strong> Select dates, budget, and activities.
            </li>
            <li>
              <strong>Book:</strong> Get recommendations for transport,
              accommodation, and guides.
            </li>
            <li>
              <strong>Enjoy:</strong> Travel safely, track your itinerary, and
              share memories.
            </li>
          </ol>
        </section>

        <section className="py-16 rounded-xl bg-gray-100  px-6 dark:bg-gray-900 text-black dark:text-white text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to plan your next adventure?
          </h2>
          <Link href={"travel-plans"}>
            <button className="px-2 py-2 bg-blue-400 cursor-pointer text-white font-bold rounded">
              Explore TravelPlan
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default About;
