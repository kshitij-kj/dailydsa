import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { arrayData } from '@/data/arrayData';

// Add server-side authentication check
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session }
  };
}

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    problems: {},
    stats: {
      easy: 0,
      medium: 0,
      hard: 0,
      total: 0
    }
  });

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('solvedProblems');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    setLoading(false);
  }, []);

  const handleResetProgress = () => {
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
  };

  const progressPercentage = (progress.stats.total / arrayData.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || 'Guest'}</h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Progress Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {progress.stats.total}/{arrayData.length} problems
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{progress.stats.easy}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Easy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{progress.stats.medium}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{progress.stats.hard}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hard</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h2>
            <div className="space-y-4">
              <button
                onClick={() => setShowResetModal(true)}
                className="w-full px-4 py-2 text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-md transition-colors duration-200"
              >
                Reset Progress
              </button>
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-600 hover:border-gray-700 rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Solved Problems List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Solved Problems</h2>
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
        </div>
      </div>

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
    </div>
  );
} 