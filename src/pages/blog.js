import Link from "next/link";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Time Complexity in DSA",
      excerpt: "Learn about different types of time complexity and how to analyze algorithms effectively.",
      author: "Coming Soon",
      date: "Coming Soon",
      readTime: "Coming Soon",
      category: "Algorithms",
    },
    {
      id: 2,
      title: "Mastering Binary Search Trees",
      excerpt: "A comprehensive guide to understanding and implementing Binary Search Trees.",
      author: "Coming Soon",
      date: "Coming Soon",
      readTime: "Coming Soon",
      category: "Data Structures",
    },
    {
      id: 3,
      title: "Dynamic Programming Explained",
      excerpt: "Break down complex DP problems and learn how to solve them step by step.",
      author: "Coming Soon",
      date: "Coming Soon",
      readTime: "Coming Soon",
      category: "Algorithms",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-900 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              DSA Blog
            </h1>
            <p className="text-xl text-violet-100">
              Learn and explore Data Structures and Algorithms through our comprehensive articles
            </p>
            <div className="mt-4">
              <span className="inline-block px-4 py-2 bg-violet-500/20 text-violet-100 rounded-full text-lg">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="relative h-48 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 dark:from-violet-600/20 dark:to-indigo-600/20 flex items-center justify-center">
                <span className="text-violet-600 dark:text-violet-400 text-lg font-medium">
                  Coming Soon
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    By {post.author}
                  </span>
                  <button 
                    className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center gap-2"
                    disabled
                  >
                    Coming Soon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
} 