import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setDarkMode } from '../store/slices/themeSlice';

/**
 * Custom hook for managing dark mode
 * @returns An object containing the current dark mode state and a function to toggle it
 */
export const useDarkMode = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  // Update document class when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [darkMode]);

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Only change if user hasn't manually set a preference
      if (!('theme' in localStorage)) {
        dispatch(setDarkMode(mediaQuery.matches));
      }
    };
    
    // Set initial value
    if (!('theme' in localStorage)) {
      dispatch(setDarkMode(mediaQuery.matches));
    }
    
    // Listen for system preference changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [dispatch]);

  return { darkMode };
};

export default useDarkMode;