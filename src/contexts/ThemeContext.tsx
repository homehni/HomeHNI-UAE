import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'default' | 'green-white' | 'opaque';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Load theme from localStorage or default to 'default'
    const savedTheme = localStorage.getItem('homehni-theme') as Theme;
    return savedTheme || 'default';
  });

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('homehni-theme', theme);
    
    // Apply theme class to document root
    document.documentElement.setAttribute('data-theme', theme);
    
    // Remove other theme classes
    document.documentElement.classList.remove('theme-default', 'theme-green-white', 'theme-opaque');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

