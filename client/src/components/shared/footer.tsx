"use client";



export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-10 flex justify-around gap-8">
        
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">TravelBuddy</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Connect with fellow travelers, share experiences, and explore the world together.
          </p>
        </div>

     

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">Email: support@travelbuddy.com</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">Phone: +880 1234 567890</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">Bangladesh</p>
        </div>

      
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-6 py-4 text-center text-sm text-gray-700 dark:text-gray-300">
        &copy; {new Date().getFullYear()} TravelBuddy. All rights reserved.
      </div>
    </footer>
  );
}
