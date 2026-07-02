import { LayoutDashboard, Settings, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const { toggleAppLauncher, deleteWorkspaceItem, apps } = useStore();
  const [isDragOverTrash, setIsDragOverTrash] = useState(false);

  // 动态获取使用频率最高的 4 个应用
  const topApps = [...apps].sort((a, b) => b.usageCount - a.usageCount).slice(0, 4);

  return (
    <aside className="w-20 h-full shrink-0 flex flex-col items-center py-8 glass-panel border-x border-foreground/10 z-10 relative">
      <button 
        onClick={() => {
          if (window.ipcRenderer) {
            window.ipcRenderer.invoke('launch-app', 'LayoutGrid').catch(console.error);
          }
        }}
        className="p-3 rounded-xl text-foreground hover:bg-foreground/10 transition-all group relative mb-12"
      >
        <Icons.LayoutGrid className="w-6 h-6" />
        <span className="absolute left-14 bg-foreground/10 px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md pointer-events-none z-50">所有应用</span>
      </button>
      
      {/* 按照使用频率从高到低放置4个常用软件 */}
      <nav className="flex-1 flex flex-col gap-8">
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
              className="p-3 rounded-xl text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-all group relative"
            >
              <IconComponent className="w-5 h-5" />
              <span className="absolute left-14 bg-foreground/10 px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md z-50 pointer-events-none">
                {app.name}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <div
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes('application/workspace-item')) {
              e.preventDefault();
              setIsDragOverTrash(true);
            }
          }}
          onDragLeave={() => setIsDragOverTrash(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOverTrash(false);
            const id = e.dataTransfer.getData('application/workspace-item');
            if (id) deleteWorkspaceItem(id);
          }}
        >
          <button className={cn("p-3 rounded-xl transition-all group relative", isDragOverTrash ? "bg-q1/20 text-q1 scale-110" : "text-foreground/50 hover:text-foreground hover:bg-foreground/10")}>
            <Trash2 className="w-5 h-5" />
            <span className="absolute left-14 bg-foreground/10 px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md pointer-events-none z-50">垃圾桶</span>
          </button>
        </div>

        <button 
          onClick={() => {
            if (window.ipcRenderer) {
              window.ipcRenderer.invoke('launch-app', 'Settings').catch(console.error);
            }
          }}
          className="p-3 rounded-xl text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-all group relative"
        >
          <Settings className="w-5 h-5" />
          <span className="absolute left-14 bg-foreground/10 px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md pointer-events-none z-50">系统设置</span>
        </button>
      </div>
    </aside>
  );
}
