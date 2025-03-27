import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { arrayData } from '@/data/arrayData';
import Head from "next/head";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const progressBarVariants = {
  hidden: { width: 0 },
  visible: width => ({
    width: `${width}%`,
    transition: { duration: 1.5, ease: "easeOut" }
  })
};

const statVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function Profile() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showResetModal, setShowResetModal] = useState(false);
  const [progress, setProgress] = useState({
    problems: {},
    stats: {
      easy: 0,
      medium: 0,
      hard: 0,
      total: 0
    }
  });
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = localStorage.getItem('solvedProblems');
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadProgress();
  }, []);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Replace with actual API call
        const response = await fetch("/api/user/stats");
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-violet-500 border-solid rounded-full animate-spin"
        />
      </div>
    );
  }

  if (!isAuthenticated && !loading) {
    router.push('/login?callbackUrl=/profile');
    return null;
  }

  const handleResetProgress = () => {
    try {
      localStorage.removeItem('solvedProblems');
      setProgress({
        problems: {},
        stats: {
          easy: 0,
          medium: 0,
          hard: 0,
          total: 0
        }
      });
      setShowResetModal(false);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  const progressPercentage = (progress.stats.total / arrayData.length) * 100;

  return (
    <>
      <Head>
        <title>Profile - DailyDSA</title>
        <meta
          name="description"
          content="View your DailyDSA profile and progress"
        />
      </Head>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container mx-auto px-4 py-8"
      >
        {/* Profile Header */}
        <motion.div 
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-900 dark:to-indigo-900 px-6 py-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold text-violet-600 dark:text-violet-400 shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </div>
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white text-center mt-4"
            >
              {user?.name || 'Guest'}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-violet-100 text-center"
            >
              {user?.email || ''}
            </motion.p>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div 
          variants={fadeIn}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Problem Solving Progress */}
          <motion.div 
            variants={fadeIn}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Problem Solving Progress
            </h2>
            
            {/* Easy Problems */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Easy</span>
                <span className="text-sm font-medium text-violet-600 dark:text-violet-400">{progress.stats.easy}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  custom={progress.stats.easy}
                  variants={progressBarVariants}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
            </div>

            {/* Medium Problems */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Medium</span>
                <span className="text-sm font-medium text-violet-600 dark:text-violet-400">{progress.stats.medium}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  custom={progress.stats.medium}
                  variants={progressBarVariants}
                  className="h-full bg-yellow-500 rounded-full"
                />
              </div>
            </div>

            {/* Hard Problems */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Hard</span>
                <span className="text-sm font-medium text-violet-600 dark:text-violet-400">{progress.stats.hard}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  custom={progress.stats.hard}
                  variants={progressBarVariants}
                  className="h-full bg-red-500 rounded-full"
                />
              </div>
            </div>

            {/* Overall Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Progress</span>
                <span className="text-sm font-medium text-violet-600 dark:text-violet-400">{progressPercentage}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  custom={progressPercentage}
                  variants={progressBarVariants}
                  className="h-full bg-violet-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div 
            variants={fadeIn}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Your Statistics
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                variants={statVariants}
                className="bg-violet-50 dark:bg-violet-900/50 rounded-lg p-4 text-center"
              >
                <h3 className="text-3xl font-bold text-violet-600 dark:text-violet-400">{progress.stats.total}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Problems Solved</p>
              </motion.div>

              <motion.div 
                variants={statVariants}
                className="bg-green-50 dark:bg-green-900/50 rounded-lg p-4 text-center"
              >
                <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">{progress.stats.easy}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Day Streak</p>
              </motion.div>

              <motion.div 
                variants={statVariants}
                className="bg-yellow-50 dark:bg-yellow-900/50 rounded-lg p-4 text-center"
              >
                <h3 className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{progress.stats.medium}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Accuracy Rate</p>
              </motion.div>

              <motion.div 
                variants={statVariants}
                className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 text-center"
              >
                <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{progress.stats.hard}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Submissions</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Solved Problems List */}
        <motion.div 
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Solved Problems
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Solved Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {arrayData
                  .filter(problem => progress.problems[problem.questionId])
                  .map((problem) => (
                    <tr key={problem.questionId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {problem.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date().toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div 
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Account Settings
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowResetModal(true)}
              className="w-full px-4 py-2 text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-md transition-colors duration-200"
            >
              Reset Progress
            </button>
          </div>
        </motion.div>

        {/* Reset Progress Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Reset Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This action cannot be undone. Are you sure you want to reset your progress?
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetProgress}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reset Progress
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
} 