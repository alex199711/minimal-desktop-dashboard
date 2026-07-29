import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Focus, PanelRightClose, PanelRightOpen, Search } from 'lucide-react';
import { AppLauncher } from '../components/AppLauncher';
import { ClockModal } from '../components/ClockModal';
import { DesktopTitlebar } from '../components/DesktopTitlebar';
import { FileExplorer } from '../components/FileExplorer';
import { NewsMarket } from '../components/NewsMarket';
import { PersonalizationModal } from '../components/PersonalizationModal';
import { SettingsModal } from '../components/SettingsModal';
import { Sidebar } from '../components/Sidebar';
import { TodoList } from '../components/TodoList';
import { Workspace } from '../components/Workspace';
import { useStore } from '../store/useStore';

export function Home() {
  const {
    isClockOpen,
    isSettingsOpen,
    isPersonalizationOpen,
    isAppLauncherOpen,
    toggleAppLauncher,
    wallpaper,
    layoutDensity,
  } = useStore();
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (!isAppLauncherOpen) toggleAppLauncher();
      }
      if (event.key === 'Escape') {
        setNewsOpen(false);
        if (focusMode) setFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [focusMode, isAppLauncherOpen, toggleAppLauncher]);

  const wallpaperClass = wallpaper === 'abstract'
    ? 'bg-gradient-to-br from-blue-500/15 to-purple-500/10'
    : wallpaper === 'morning'
      ? 'bg-gradient-to-tr from-orange-500/15 to-red-500/10'
      : wallpaper === 'nature'
        ? 'bg-gradient-to-bl from-green-500/15 to-teal-500/10'
        : 'bg-background';

  return (
    <div className={`h-screen overflow-hidden ${wallpaperClass}`}>
      <DesktopTitlebar />
      <AppLauncher />
      {isClockOpen && <ClockModal />}
      {isSettingsOpen && <SettingsModal />}
      {isPersonalizationOpen && <PersonalizationModal />}

      <main className={`desktop-shell ${layoutDensity === 'compact' ? 'desktop-shell-compact' : ''}`}>
        {!focusMode && <Sidebar />}
        {!focusMode && <FileExplorer />}

        <section className="workspace-canvas" aria-label="工作区">
          <header className="workspace-toolbar">
            <div className="min-w-0">
              <div className="zone-eyebrow">WORKSPACE / TODAY</div>
              <h1 className="truncate text-lg font-semibold tracking-tight">今日工作台</h1>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="command-trigger" onClick={toggleAppLauncher}>
                <Search className="size-3.5" />
                <span>快速打开</span>
                <kbd>Ctrl K</kbd>
              </button>
              <button className="icon-button" onClick={() => setNewsOpen(true)} aria-label="查看资讯" title="查看资讯">
                <Bell className="size-4" />
              </button>
              <button className="icon-button" onClick={() => setFocusMode(!focusMode)} aria-label="切换专注模式" title="专注模式">
                <Focus className="size-4" />
              </button>
              <button
                className="icon-button efficiency-toggle"
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                aria-label={rightPanelOpen ? '收起效率面板' : '展开效率面板'}
                title={rightPanelOpen ? '收起效率面板' : '展开效率面板'}
              >
                {rightPanelOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 p-3">
            <Workspace mode="temp" />
          </div>
        </section>

        {!focusMode && rightPanelOpen && (
          <aside className="efficiency-panel" aria-label="效率区">
            <div className="zone-heading">
              <div>
                <div className="zone-eyebrow">FOCUS</div>
                <h2 className="zone-title">今日待办</h2>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <TodoList />
            </div>
          </aside>
        )}
      </main>

      <AnimatePresence>
        {newsOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm"
              onClick={() => setNewsOpen(false)}
              aria-label="关闭资讯"
            />
            <motion.aside
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="fixed bottom-3 right-3 top-11 z-50 w-[min(420px,calc(100vw-24px))]"
            >
              <NewsMarket />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
