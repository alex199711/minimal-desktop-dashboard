import { Sidebar } from '../components/Sidebar';
import { TodoList } from '../components/TodoList';
import { Workspace } from '../components/Workspace';
import { NewsMarket } from '../components/NewsMarket';
import { AppLauncher } from '../components/AppLauncher';
import { useStore } from '../store/useStore';
import { ClockModal } from '../components/ClockModal';
import { SettingsModal } from '../components/SettingsModal';
import { PersonalizationModal } from '../components/PersonalizationModal';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Palette, LogOut } from 'lucide-react';
import { Group, Panel, Separator, PanelImperativeHandle } from 'react-resizable-panels';

export function Home() {
  const { isNewsFolded, isClockOpen, isSettingsOpen, isPersonalizationOpen, togglePersonalization, themeMode, accentColor, glassOpacity } = useStore();
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const newsPanelRef = useRef<PanelImperativeHandle>(null);

  useEffect(() => {
    if (newsPanelRef.current) {
      if (isNewsFolded) {
        newsPanelRef.current.resize("8%"); // 折叠时给一个极小的尺寸
      } else {
        newsPanelRef.current.resize("40%"); // 展开时恢复正常比例
      }
    }
  }, [isNewsFolded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setIsAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <AppLauncher />
      {isClockOpen && <ClockModal />}
      {isSettingsOpen && <SettingsModal />}
      {isPersonalizationOpen && <PersonalizationModal />}
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-theme-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-q1/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* 整体可调节布局 */}
      <Group orientation="horizontal" className="z-10 w-full h-full p-6">
        {/* 1. 最左侧：待办事项模块 */}
        <Panel defaultSize="22%" minSize="15%" maxSize="40%" className="flex flex-col h-full relative pr-2">
          <TodoList />
        </Panel>

        <Separator className="w-2 flex items-center justify-center group cursor-col-resize rounded-full hover:bg-foreground/10 active:bg-foreground/10 transition-colors">
          <div className="w-0.5 h-8 bg-foreground/10 group-hover:bg-foreground/10 rounded-full" />
        </Separator>

        {/* 2. 工具栏 */}
        <Panel defaultSize="5%" minSize="4%" maxSize="10%" className="flex flex-col h-full px-2">
          <Sidebar />
        </Panel>

        <Separator className="w-2 flex items-center justify-center group cursor-col-resize rounded-full hover:bg-foreground/10 active:bg-foreground/10 transition-colors">
          <div className="w-0.5 h-8 bg-foreground/10 group-hover:bg-foreground/10 rounded-full" />
        </Separator>

        {/* 3. 剩余空间：中心区域和右侧信息 */}
        <Panel defaultSize="73%" minSize="40%" className="flex flex-col overflow-hidden h-full pl-2">
          <div className="h-full flex flex-col gap-6 pl-3">
            {/* Header Area */}
            <header className="flex-none flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">概览</h1>
                <p className="text-sm text-foreground/50">欢迎回到您的工作台，今天也是充满效率的一天。</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative" ref={avatarMenuRef}>
                  <button 
                    onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-q2 to-q1 border border-foreground/10 p-0.5 hover:scale-105 transition-transform"
                    title="账户菜单"
                  >
                    <div className="w-full h-full rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center text-sm font-bold text-foreground">
                      A
                    </div>
                  </button>
                  <AnimatePresence>
                    {isAvatarMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-40 bg-card border border-foreground/10 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1"
                      >
                        <button 
                          onClick={() => {
                            togglePersonalization();
                            setIsAvatarMenuOpen(false);
                          }} 
                          className="flex items-center gap-3 px-3 py-2 hover:bg-foreground/10 rounded-lg text-sm text-foreground/80 hover:text-foreground transition-colors"
                        >
                          <Palette className="w-4 h-4 text-theme-accent" /> 个性化设置
                        </button>
                        <button 
                          onClick={() => {
                            setIsAvatarMenuOpen(false);
                            alert('已退出登录，这里可以接入实际的清理 Token 或跳转逻辑。');
                          }} 
                          className="flex items-center gap-3 px-3 py-2 hover:bg-q1/20 rounded-lg text-sm text-foreground/80 hover:text-q1 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-q1" /> 退出登录
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </header>

            <div className="flex-1 min-h-0">
              <Group orientation="horizontal" className="">
                {/* Center Column: Workspace */}
                <Panel defaultSize="70%" minSize="30%" className="flex flex-col h-full min-h-0 pr-2">
                  <Workspace mode="temp" />
                </Panel>

                <Separator className="w-2 flex items-center justify-center group cursor-col-resize rounded-full hover:bg-foreground/10 active:bg-foreground/10 transition-colors">
                  <div className="w-0.5 h-8 bg-foreground/10 group-hover:bg-foreground/10 rounded-full" />
                </Separator>

                {/* Right Column: News & Archive */}
                <Panel defaultSize="30%" minSize="15%" className="flex flex-col h-full pl-2">
                  <Group orientation="vertical" className="">
                    <Panel panelRef={newsPanelRef} defaultSize={isNewsFolded ? "8%" : "40%"} minSize="8%" className="flex flex-col h-full w-full pb-2">
                      <NewsMarket />
                    </Panel>
                    
                    <Separator className="h-2 flex items-center justify-center group cursor-row-resize rounded-full hover:bg-foreground/10 active:bg-foreground/10 transition-colors">
                      <div className="w-8 h-0.5 bg-foreground/10 group-hover:bg-foreground/10 rounded-full" />
                    </Separator>
                    
                    <Panel defaultSize={isNewsFolded ? "92%" : "60%"} minSize="20%" className="flex flex-col h-full w-full pt-2">
                      <Workspace mode="archived" />
                    </Panel>
                  </Group>
                </Panel>
              </Group>
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  );
}
