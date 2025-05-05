import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  darkMode: boolean;
}

// Check if dark mode is enabled in local storage or by system preference
const isDarkMode = () => {
  if (typeof window !== 'undefined') {
    if (localStorage.theme === 'dark') {
      return true;
    }
    if (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
  }
  return false;
};

const initialState: ThemeState = {
  darkMode: isDarkMode(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const { toggleTheme, setDarkMode } = themeSlice.actions;

export default themeSlice.reducer;