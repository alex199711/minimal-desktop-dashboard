import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';

import { useStore } from './store/useStore';
import { useEffect } from 'react';

function App() {
  const { glassOpacity, themeMode, accentColor } = useStore();

  useEffect(() => {
    // 动态调整全局玻璃态透明度
    const opacity = (glassOpacity / 100) * 0.95; // 0 到 0.95 之间
    document.documentElement.style.setProperty('--glass-opacity', opacity.toString());
    
    // 动态调整模糊度
    const blur = (glassOpacity / 100) * 40; // 0px 到 40px
    document.documentElement.style.setProperty('--glass-blur', `${blur}px`);
  }, [glassOpacity]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (themeMode === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(themeMode);
    }
  }, [themeMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    // Map accentColor id to CSS HSL variables
    const accentMap: Record<string, string> = {
      'orange': '24.6 95% 53.1%', // Tailwind orange-500
      'red': '348 83% 54%',      // var(--q1)
      'yellow': '43 96% 56%',    // var(--q2)
      'green': '152 69% 31%',    // var(--q4)
      'blue': '217 91% 60%',     // var(--q3)
      'purple': '285 83% 60%',   // Tailwind purple-500
    };
    if (accentMap[accentColor]) {
      root.style.setProperty('--theme-accent', accentMap[accentColor]);
    }
  }, [accentColor]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
