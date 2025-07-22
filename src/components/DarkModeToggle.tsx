'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface DarkModeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DarkModeToggle({ className, size = 'md' }: DarkModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          'rounded-full border border-gray-300 bg-gray-100',
          size === 'sm' && 'h-8 w-14',
          size === 'md' && 'h-10 w-18',
          size === 'lg' && 'h-12 w-22',
          className
        )}
      />
    );
  }

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const sizeClasses = {
    sm: {
      container: 'h-8 w-14',
      switch: 'h-6 w-6',
      icon: 'h-3 w-3',
      translate: isDark ? 'translate-x-6' : 'translate-x-1',
    },
    md: {
      container: 'h-10 w-18',
      switch: 'h-8 w-8',
      icon: 'h-4 w-4',
      translate: isDark ? 'translate-x-8' : 'translate-x-1',
    },
    lg: {
      container: 'h-12 w-22',
      switch: 'h-10 w-10',
      icon: 'h-5 w-5',
      translate: isDark ? 'translate-x-10' : 'translate-x-1',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        isDark ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-gray-200',
        sizes.container,
        className
      )}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className={cn(
          'inline-block rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
          sizes.switch
        )}
        animate={{
          x: isDark ? (size === 'sm' ? 24 : size === 'md' ? 32 : 40) : 4,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <div className="flex h-full w-full items-center justify-center">
          {isDark ? (
            <motion.div
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className={cn('text-blue-600', sizes.icon)} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className={cn('text-yellow-500', sizes.icon)} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </button>
  );
}

// Icon-only toggle button
export function IconDarkModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn('h-9 w-9 rounded-md border border-gray-300 bg-gray-100', className)}
      />
    );
  }

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : 180,
          scale: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className="h-4 w-4" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className="h-4 w-4" />
      </motion.div>
    </motion.button>
  );
}
