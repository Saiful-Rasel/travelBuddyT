// components/shared/footer.tsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 text-gray-900 shadow dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-8">
        
        {/* About Section */}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-4 cursor-pointer text-blue-600 dark:text-blue-400">
            <Link href={"/"}>TravelBuddy</Link>
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Connect with fellow travelers, share experiences, and explore the world together.
          </p>
          
        </div>

        {/* Contact Section */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Contact
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Email: saifulrasel737rf@gmail.com
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Phone: +8801624616583
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Bangladesh
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-6 py-4 text-center text-sm text-gray-700 dark:text-gray-300">
        &copy; {new Date().getFullYear()} TravelBuddy. All rights reserved.
      </div>
    </footer>
  );
}
