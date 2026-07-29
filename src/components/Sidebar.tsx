import { Settings } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';

export function Sidebar() {
  const { toggleAppLauncher, apps } = useStore();

  // 动态获取使用频率最高的 4 个应用
  const topApps = [...apps].sort((a, b) => {
    if (b.usageCount !== a.usageCount) return b.usageCount - a.usageCount;
    return new Date(b.lastUsedAt || 0).getTime() - new Date(a.lastUsedAt || 0).getTime();
  }).slice(0, 4);

  return (
    <aside className="tool-rail" aria-label="软件工具区">
      <div className="zone-eyebrow mb-3 [writing-mode:vertical-rl] rotate-180">TOOLS</div>
      <button 
        onClick={() => {
          toggleAppLauncher();
        }}
        className="tool-button mb-5"
        aria-label="打开全部应用"
      >
        <Icons.LayoutGrid className="w-6 h-6" />
        <span className="absolute left-14 bg-foreground/10 px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md pointer-events-none z-50">所有应用</span>
      </button>
      
      {/* 按照使用频率从高到低放置4个常用软件 */}
      <nav className="flex-1 flex flex-col gap-2" aria-label="常用软件">
        {topApps.map(app => {
          const IconComponent = (Icons as any)[app.iconName] || Icons.HelpCircle;
          return (
            <button 
              key={app.id} 
              onClick={() => {
                useStore.getState().incrementAppUsage(app.id);
                if (window.ipcRenderer) {
                  window.ipcRenderer.invoke('launch-app', app.iconName).catch(console.error);
                }
              }}
              className="tool-button"
              aria-label={`打开${app.name}`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="absolute left-14 bg-foreground/10 px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md z-50 pointer-events-none">
                {app.name}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <button 
          onClick={() => {
            if (window.ipcRenderer) {
              window.ipcRenderer.invoke('launch-app', 'Settings').catch(console.error);
            } else {
              alert('在桌面端运行此软件时，将直接唤起 Windows 系统设置。');
            }
          }}
          className="tool-button"
          aria-label="打开系统设置"
        >
          <Settings className="w-5 h-5" />
          <span className="absolute left-14 bg-foreground/10 px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md pointer-events-none z-50">系统设置</span>
        </button>
      </div>
    </aside>
  );
}
