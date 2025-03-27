import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useSolvedProblems() {
  const { data: session } = useSession();
  const [solvedProblems, setSolvedProblems] = useState({
    problems: {},
    stats: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
  });

  // Load progress from API
  useEffect(() => {
    const loadProgress = async () => {
      if (!session) return;
      
      try {
        const response = await fetch('/api/progress');
        if (!response.ok) throw new Error('Failed to fetch progress');
        const data = await response.json();
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadProgress();
  }, [session]);

  // Save progress to API
  const saveProgress = async (newProgress) => {
    if (!session) return;

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProgress),
      });

      if (!response.ok) throw new Error('Failed to save progress');
      setSolvedProblems(newProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const toggleProblem = (problemId, difficulty) => {
    const newProgress = { ...solvedProblems };
    const isSolved = newProgress.problems[problemId];

    if (isSolved) {
      // Remove problem from solved
      delete newProgress.problems[problemId];
      newProgress.stats[difficulty]--;
    } else {
      // Add problem to solved
      newProgress.problems[problemId] = true;
      newProgress.stats[difficulty]++;
    }

    saveProgress(newProgress);
  };

  const resetProgress = async () => {
    const newProgress = {
      problems: {},
      stats: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    };
    await saveProgress(newProgress);
  };

  return {
    solvedProblems,
    toggleProblem,
    resetProgress,
  };
} 