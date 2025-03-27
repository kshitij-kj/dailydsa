import Link from "next/link";

export default function Contest() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-900 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              DSA Contests
            </h1>
            <p className="text-xl text-violet-100 mb-8">
              Participate in coding contests and compete with fellow developers
            </p>
            <div className="inline-block px-6 py-3 bg-violet-500/20 rounded-xl">
              <div className="flex flex-col items-center gap-4">
                <span className="text-2xl text-violet-100 font-semibold">
                  Coming Soon
                </span>
                <p className="text-violet-200">
                  We&apos;re preparing exciting coding contests where you can test your skills,
                  compete with others, and win prizes!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[200px]"
            >
              <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-violet-600 dark:text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-violet-600 dark:text-violet-400 text-lg font-medium">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 