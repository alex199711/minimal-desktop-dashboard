import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import * as Icons from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export function AppLauncher() {
  const { isAppLauncherOpen, toggleAppLauncher, apps, incrementAppUsage } = useStore();
  const [query, setQuery] = useState('');
  const filteredApps = useMemo(
    () => apps
      .filter((app) => app.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
      .sort((a, b) => {
        if (b.usageCount !== a.usageCount) return b.usageCount - a.usageCount;
        return new Date(b.lastUsedAt || 0).getTime() - new Date(a.lastUsedAt || 0).getTime();
      }),
    [apps, query]
  );

  useEffect(() => {
    if (!isAppLauncherOpen) setQuery('');
    const close = (event: KeyboardEvent) => {
      if (isAppLauncherOpen && event.key === 'Escape') toggleAppLauncher();
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [isAppLauncherOpen, toggleAppLauncher]);

  const handleAppClick = (id: string, iconName: string) => {
    incrementAppUsage(id);
    toggleAppLauncher();
    // 真实应用启动逻辑 (Electron端)
    if (window.ipcRenderer) {
      window.ipcRenderer.invoke('launch-app', iconName).catch(console.error);
    } else {
      console.log(`在桌面端将启动应用: ${iconName}`);
    }
  };

  return (
    <AnimatePresence>
      {isAppLauncherOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/10"
        >
          <button 
            onClick={toggleAppLauncher} 
            className="absolute top-8 right-8 p-4 bg-foreground/10 hover:bg-foreground/10 rounded-full text-foreground transition-all hover:scale-110"
            aria-label="关闭应用启动器"
          >
            <Icons.X className="w-6 h-6" />
          </button>
          
          <div className="max-w-4xl w-full p-8">
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-display font-medium text-foreground mb-6 text-center tracking-widest opacity-80"
            >
              全部应用
            </motion.h2>

            <label className="search-box mx-auto mb-10 max-w-md bg-background/50">
              <Icons.Search className="size-4 text-foreground/40" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索应用"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/35"
              />
              <kbd>ESC</kbd>
            </label>
            
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-x-8 gap-y-12">
              {filteredApps.map((app, index) => {
                const IconComponent = (Icons as any)[app.iconName] || Icons.HelpCircle;
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAppClick(app.id, app.iconName)}
                    className="flex flex-col items-center gap-4 cursor-pointer group"
                  >
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] ${app.color} flex items-center justify-center shadow-lg transition-shadow group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]`}>
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-foreground" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm text-foreground/70 font-medium group-hover:text-foreground transition-colors">{app.name}</span>
                  </motion.div>
                );
              })}
            </div>
            {!filteredApps.length && <div className="py-12 text-center text-sm text-foreground/40">未找到应用</div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
