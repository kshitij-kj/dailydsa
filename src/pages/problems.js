import Link from "next/link";
import { useState, useEffect } from "react";
import { arrayData } from "@/data/arrayData";
import { randomQuestion } from "@/data/randomData";

// Custom hook for managing solved problems
const useSolvedProblems = () => {
  const [solvedProblems, setSolvedProblems] = useState(() => {
    // Initialize state from localStorage if available
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

  // Save solved problems to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('solvedProblems', JSON.stringify(solvedProblems));
    }
  }, [solvedProblems]);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'solvedProblems') {
        try {
          const newProgress = JSON.parse(e.newValue || '{}');
          setSolvedProblems(newProgress);
        } catch (error) {
          console.error('Error parsing storage event data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return [solvedProblems, setSolvedProblems];
};

export default function Problems() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [solvedProblems, setSolvedProblems] = useSolvedProblems();

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

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const topics = [
    { name: "Arrays", slug: "array" },
    { name: "Backtracking", slug: "backtracking" },
    { name: "Dynamic Programming", slug: "dynamic-programming" },
    { name: "String", slug: "string" },
    { name: "Hashing", slug: "hashing" },
    { name: "Stacks & Queues", slug: "stacks-queues" },
    { name: "Trees", slug: "trees" },
    { name: "Graphs", slug: "graphs" },
    { name: "Greedy", slug: "greedy" },
  ];

  const handleSolveClick = (e, problem) => {
    e.preventDefault(); // Prevent the Link component from navigating
    window.open(`https://leetcode.com/problems/${problem.titleSlug}/`, '_blank', 'noopener,noreferrer');
  };

  const handleCheckboxChange = (e, problem) => {
    e.stopPropagation(); // Prevent the Link component from triggering
    
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            DSA Problems
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Practice a wide range of Data Structures and Algorithms problems
          </p>
        </div>

        {/* Topic Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-violet-600 mb-4">Topic Based Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.slug}
                className="group relative bg-white dark:bg-gray-800 border-2 border-violet-100 rounded-2xl transition hover:z-[1] hover:shadow-2xl hover:shadow-violet-600/10 cursor-pointer"
                onClick={() => setActiveTab(topic.slug)}
              >
                <div className="relative space-y-4 py-6 p-6">
                  <div className="space-y-2">
                    <h5 className="text-xl font-semibold text-gray-700 dark:text-white transition group-hover:text-violet-600">
                      {topic.name}
                    </h5>
                  </div>
                  <Link
                    href={`/problems/${topic.slug}`}
                    className="flex items-center justify-between group-hover:text-violet-600"
                  >
                    <span className="text-sm font-medium">Solve</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 -translate-x-4 text-2xl opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Problems Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-violet-600 mb-4">All Problems</h2>
          
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
          <div className="space-y-4">
            {filteredProblems.map((problem) => (
              <div
                key={problem.questionId}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {problem.title}
                  </h2>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[problem.difficulty]}`}
                    >
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 