import Link from "next/link";

export default function Discuss() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-900 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Discussion Forum
            </h1>
            <p className="text-xl text-violet-100 mb-8">
              Connect with fellow developers, share your solutions, and learn from others
            </p>
            <div className="inline-block px-6 py-3 bg-violet-500/20 rounded-xl">
              <div className="flex flex-col items-center gap-4">
                <span className="text-2xl text-violet-100 font-semibold">
                  Coming Soon
                </span>
                <p className="text-violet-200">
                  We're working hard to bring you a space where you can discuss DSA problems, 
                  share your approaches, and learn from the community.
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
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