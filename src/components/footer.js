import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              DailyDSA
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Practice data structures and algorithms daily to improve your problem-solving skills.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/problems" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400">
                  Problems
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@dailydsa.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  support@dailydsa.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/yourusername/dailydsa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} DailyDSA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}