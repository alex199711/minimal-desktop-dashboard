import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import * as Icons from 'lucide-react';

export function AppLauncher() {
  const { isAppLauncherOpen, toggleAppLauncher, apps, incrementAppUsage } = useStore();

  const handleAppClick = (id: string, iconName: string) => {
    incrementAppUsage(id);
    toggleAppLauncher();
    // 真实应用启动逻辑 (Electron端)
    if (window.ipcRenderer) {
      window.ipcRenderer.invoke('launch-app', iconName).catch(console.error);
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
          >
            <Icons.X className="w-6 h-6" />
          </button>
          
          <div className="max-w-4xl w-full p-8">
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-display font-medium text-foreground mb-16 text-center tracking-widest opacity-80"
            >
              全部应用
            </motion.h2>
            
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-x-8 gap-y-12">
              {apps.map((app, index) => {
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
