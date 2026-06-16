'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProgress } from '@/types';

const defaultProgress: UserProgress = {
  xp: 0,
  hearts: 999, // قيمة وهمية ثابتة لن تؤثر أو تظهر
  level: 1,
  badges: [],
  currentPath: '',
  lessonsCompleted: [],
  stats: { totalCorrect: 0, totalWrong: 0, streak: 0 },
  learnedWords: [],
};

interface UserContextType {
  progress: UserProgress;
  updateProgress: (fn: (p: UserProgress) => UserProgress) => void;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  unlockBadge: (badgeId: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  useEffect(() => {
    const stored = localStorage.getItem('userProgress');
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch { }
    }
  }, []);

  const updateProgress = (fn: (p: UserProgress) => UserProgress) => {
    setProgress(prev => {
      const newProgress = fn(prev);
      localStorage.setItem('userProgress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const addXP = (amount: number) => {
    updateProgress(p => {
      const newXp = p.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      return { ...p, xp: newXp, level: newLevel };
    });
  };

  const completeLesson = (lessonId: string) => {
    updateProgress(p => {
      if (p.lessonsCompleted.includes(lessonId)) return p;
      return { ...p, lessonsCompleted: [...p.lessonsCompleted, lessonId] };
    });
  };

  const unlockBadge = (badgeId: string) => {
    updateProgress(p => {
      if (p.badges.includes(badgeId)) return p;
      return { ...p, badges: [...p.badges, badgeId] };
    });
  };

  return (
    <UserContext.Provider value={{ progress, updateProgress, addXP, completeLesson, unlockBadge }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
