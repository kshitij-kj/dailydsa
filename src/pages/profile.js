import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { arrayData } from '@/data/arrayData';
import Head from "next/head";
import { useSession } from 'next-auth/react';

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
  const [userProgress, setUserProgress] = useState({
    problems: {},
    stats: {
      easy: 0,
      medium: 0,
      hard: 0,
      total: 0
    }
  });
  const [mounted, setMounted] = useState(false);
  const [userStats, setUserStats] = useState({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/stats');
        if (response.ok) {
          const data = await response.json();
          setUserProgress(data);
          setUserStats({
            totalSolved: data.stats.total || 0,
            easySolved: data.stats.easy || 0,
            mediumSolved: data.stats.medium || 0,
            hardSolved: data.stats.hard || 0
          });
          setRecentActivity(data.recentActivity);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [session]);

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

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Please sign in to view your profile
            </h1>
            <p className="text-gray-400">
              Sign in to track your progress and view your statistics
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleResetProgress = () => {
    try {
      localStorage.removeItem('solvedProblems');
      setUserProgress({
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

  const progressPercentage = (userProgress.stats.total / arrayData.length) * 100;

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {session.user.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {session.user.name || 'User'}
              </h1>
              <p className="text-gray-400">{session.user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-400">Total Solved</h3>
            <p className="text-3xl font-bold text-white mt-2">{userStats.totalSolved}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-900/50 rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-green-400">Easy</h3>
            <p className="text-3xl font-bold text-green-300 mt-2">{userStats.easySolved}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-yellow-900/50 rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-yellow-400">Medium</h3>
            <p className="text-3xl font-bold text-yellow-300 mt-2">{userStats.mediumSolved}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-red-900/50 rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-red-400">Hard</h3>
            <p className="text-3xl font-bold text-red-300 mt-2">{userStats.hardSolved}</p>
          </motion.div>
        </div>

        {/* Progress Section */}
        <motion.div 
          variants={fadeIn}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
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
                <span className="text-sm font-medium text-violet-600 dark:text-violet-400">{((userProgress.stats.easy / arrayData.filter(p => p.difficulty === 'Easy').length) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(userProgress.stats.easy / arrayData.filter(p => p.difficulty === 'Easy').length) * 100}%` }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
            </div>

            {/* Medium Problems */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Medium</span>
                <span className="text-sm font-medium text-violet-600 dark:text-violet-400">{((userProgress.stats.medium / arrayData.filter(p => p.difficulty === 'Medium').length) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(userProgress.stats.medium / arrayData.filter(p => p.difficulty === 'Medium').length) * 100}%` }}
                  className="h-full bg-yellow-500 rounded-full"
                />
              </div>
            </div>

            {/* Hard Problems */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Hard</span>
                <span className="text-sm font-medium text-violet-600 dark:text-violet-400">{((userProgress.stats.hard / arrayData.filter(p => p.difficulty === 'Hard').length) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(userProgress.stats.hard / arrayData.filter(p => p.difficulty === 'Hard').length) * 100}%` }}
                  className="h-full bg-red-500 rounded-full"
                />
              </div>
            </div>

            {/* Overall Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Progress</span>
                <span className="text-sm font-medium text-violet-600 dark:text-violet-400">{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-violet-500 rounded-full"
                />
              </div>
            </div>
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
                    .filter(problem => userProgress.problems[problem.questionId])
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