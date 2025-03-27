import Link from "next/link";
import { useState, useEffect } from "react";
import { arrayData } from "@/data/arrayData";
import { randomQuestion } from "@/data/randomData";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: { 
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { 
    scale: 0.98 
  }
};

const difficultyColors = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

// Custom hook for managing solved problems
const useSolvedProblems = () => {
  const [solvedProblems, setSolvedProblems] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('solvedProblems');
      if (savedProgress) {
        try {
          return JSON.parse(savedProgress);
        } catch (error) {
          console.error('Error parsing saved progress:', error);
        }
      }
    }
    return {
      problems: {},
      stats: {
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0
      }
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('solvedProblems', JSON.stringify(solvedProblems));
    }
  }, [solvedProblems]);

  return [solvedProblems, setSolvedProblems];
};

export default function Problems() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [solvedProblems, setSolvedProblems] = useSolvedProblems();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get unique categories from problems
  const categories = ["All", ...new Set(arrayData.flatMap(problem => problem.topicTags.map(tag => tag.name)))];

  // Filter problems based on selected filters
  const filteredProblems = arrayData.filter(problem => {
    const matchesDifficulty = selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === "All" || problem.topicTags.some(tag => tag.name === selectedCategory);
    const matchesSearch = searchQuery === "" || 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.topicTags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDifficulty && matchesCategory && matchesSearch;
  });

  const handleSolveClick = (e, problem) => {
    e.preventDefault();
    window.open(`https://leetcode.com/problems/${problem.titleSlug}/`, '_blank', 'noopener,noreferrer');
  };

  const handleCheckboxChange = (e, problem) => {
    e.stopPropagation();
    
    const isSolved = !solvedProblems.problems[problem.questionId];
    const difficulty = problem.difficulty.toLowerCase();
    
    setSolvedProblems(prev => {
      const newStats = { ...prev.stats };
      if (isSolved) {
        newStats[difficulty]++;
        newStats.total++;
      } else {
        newStats[difficulty]--;
        newStats.total--;
      }

      return {
        problems: {
          ...prev.problems,
          [problem.questionId]: isSolved
        },
        stats: newStats
      };
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Problems - DailyDSA</title>
        <meta name="description" content="Practice DSA problems to improve your problem-solving skills" />
      </Head>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              DSA Problems
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Practice data structures and algorithms with our curated collection of problems
            </p>
          </motion.div>

          {/* Filters Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-violet-500 focus:border-violet-500"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option>All</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-violet-500 focus:border-violet-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-violet-500 focus:border-violet-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Problems List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredProblems.map((problem) => (
                <motion.div
                  key={problem.questionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {problem.title}
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                      <input
                        type="checkbox"
                        checked={solvedProblems.problems[problem.questionId] || false}
                        onChange={(e) => handleCheckboxChange(e, problem)}
                        className="w-5 h-5 text-violet-600 border-gray-300 rounded focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {problem.topicTags.map((tag) => (
                      <span
                        key={tag.slug}
                        className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Acceptance Rate: {problem.acRate}
                    </span>
                    <button
                      onClick={(e) => handleSolveClick(e, problem)}
                      className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium flex items-center gap-2"
                    >
                      Solve
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* No Results */}
            {filteredProblems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No problems found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
} 