import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Folder, FileText, Archive, Link as LinkIcon, Plus, Trash2, ArrowUpLeft, ArrowLeft, FileSpreadsheet, Presentation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export function Workspace({ mode = 'both' }: { mode?: 'temp' | 'archived' | 'both' }) {
  const { workspaceItems, addWorkspaceItem, archiveItem, unarchiveItem, deleteWorkspaceItem, createShortcut } = useStore();
  const [activeTab, setActiveTab] = useState<'temp' | 'archived'>('temp');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentMode = mode === 'both' ? activeTab : mode;
  const filteredItems = workspaceItems.filter(item => item.status === currentMode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = async (type: 'folder' | 'word' | 'excel' | 'ppt' | 'txt') => {
    const typeNames = {
      folder: '新建文件夹',
      word: '新建 Word 文档',
      excel: '新建 Excel 文档',
      ppt: '新建 PPT',
      txt: '新建文本文档'
    };
    
    const newName = `${typeNames[type]} ${filteredItems.length + 1}`;
    
    setIsAddMenuOpen(false);

    // Call Electron API to create actual files and open applications
    if (window.ipcRenderer) {
      try {
        const result = await window.ipcRenderer.invoke('create-file', { type, name: newName });
        if (!result?.success) throw new Error(result?.error || '创建失败');
        addWorkspaceItem({ name: newName, type, status: 'temp', path: result.path });
      } catch (err) {
        console.error('Failed to create file in system:', err);
      }
    } else {
      // Browser fallback warning
      addWorkspaceItem({ name: newName, type, status: 'temp' });
    }
  };

  const handleOpen = async (path?: string) => {
    if (!path || !window.ipcRenderer) return;
    const result = await window.ipcRenderer.invoke('open-path', path);
    if (!result?.success) alert(result?.error || '无法打开该项目');
  };

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-foreground/10 flex justify-between items-center bg-background/10">
        {mode === 'both' ? (
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('temp')}
              className={cn(
                "font-display font-medium text-sm transition-all relative",
                activeTab === 'temp' ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
              )}
            >
              工作区 (加工)
              {activeTab === 'temp' && (
                <motion.div layoutId="tab-indicator" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-theme-accent" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('archived')}
              className={cn(
                "font-display font-medium text-sm transition-all relative",
                activeTab === 'archived' ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
              )}
            >
              档案区 (储存)
              {activeTab === 'archived' && (
                <motion.div layoutId="tab-indicator" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-theme-accent" />
              )}
            </button>
          </div>
        ) : (
          <div className="font-display font-medium text-sm text-foreground">
            {mode === 'temp' ? '工作区 (加工)' : '档案区 (储存)'}
          </div>
        )}
        
        {currentMode === 'temp' && (
          <div 
            className="relative" 
            ref={menuRef}
            onMouseEnter={() => setIsAddMenuOpen(true)}
            onMouseLeave={() => setIsAddMenuOpen(false)}
          >
            <button className="p-1.5 rounded-lg bg-foreground/10 hover:bg-foreground/10 text-foreground transition-all">
              <Plus className="w-4 h-4" />
            </button>
            {/* 添加一个透明的桥接区域，防止鼠标滑过间隙时菜单折叠 */}
            {isAddMenuOpen && <div className="absolute top-full right-0 w-full h-2 z-40" />}
            <AnimatePresence>
              {isAddMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-card border border-foreground/10 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1"
                >
                  <button onClick={() => handleAdd('folder')} className="flex items-center gap-3 px-3 py-2 hover:bg-foreground/10 rounded-lg text-sm text-foreground/80 hover:text-foreground transition-colors">
                    <Folder className="w-4 h-4 text-q2" /> 新建文件夹
                  </button>
                  <button onClick={() => handleAdd('word')} className="flex items-center gap-3 px-3 py-2 hover:bg-foreground/10 rounded-lg text-sm text-foreground/80 hover:text-foreground transition-colors">
                    <FileText className="w-4 h-4 text-blue-400" /> 新建 Word 文档
                  </button>
                  <button onClick={() => handleAdd('excel')} className="flex items-center gap-3 px-3 py-2 hover:bg-foreground/10 rounded-lg text-sm text-foreground/80 hover:text-foreground transition-colors">
                    <FileSpreadsheet className="w-4 h-4 text-green-500" /> 新建 Excel 文档
                  </button>
                  <button onClick={() => handleAdd('ppt')} className="flex items-center gap-3 px-3 py-2 hover:bg-foreground/10 rounded-lg text-sm text-foreground/80 hover:text-foreground transition-colors">
                    <Presentation className="w-4 h-4 text-orange-500" /> 新建 PPT
                  </button>
                  <button onClick={() => handleAdd('txt')} className="flex items-center gap-3 px-3 py-2 hover:bg-foreground/10 rounded-lg text-sm text-foreground/80 hover:text-foreground transition-colors">
                    <FileText className="w-4 h-4 text-foreground/60" /> 新建文本文档
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        <div className={cn(
          "grid gap-4",
          mode === 'temp' ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" : "grid-cols-2 sm:grid-cols-3"
        )}>
          <AnimatePresence>
            {filteredItems.map(item => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                draggable
                onDragStart={(e: any) => {
                  e.dataTransfer.setData('application/workspace-item', item.id);
                }}
                onDoubleClick={() => handleOpen(item.path)}
                onKeyDown={(event) => event.key === 'Enter' && handleOpen(item.path)}
                tabIndex={0}
                className="group p-4 rounded-2xl bg-foreground/10 border border-foreground/10 hover:bg-foreground/10 hover:border-foreground/10 transition-all flex flex-col items-center gap-3 cursor-pointer relative overflow-hidden focus-visible:border-theme-accent"
              >
                {/* Icon Rendering */}
                <div className="relative">
                  {item.type === 'folder' && <Folder className="w-10 h-10 text-q2 opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-all" fill="currentColor" />}
                  {(item.type === 'file' || item.type === 'txt') && <FileText className="w-10 h-10 text-foreground/50 group-hover:text-foreground/80 group-hover:-translate-y-1 transition-all" />}
                  {item.type === 'word' && <FileText className="w-10 h-10 text-blue-400 opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-all" />}
                  {item.type === 'excel' && <FileSpreadsheet className="w-10 h-10 text-green-500 opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-all" />}
                  {item.type === 'ppt' && <Presentation className="w-10 h-10 text-orange-500 opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-all" />}
                  {item.type === 'shortcut' && (
                    <>
                      <FileText className="w-10 h-10 text-theme-accent/60 group-hover:text-theme-accent/90 group-hover:-translate-y-1 transition-all" />
                      <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5 border border-foreground/10">
                        <LinkIcon className="w-3 h-3 text-theme-accent" />
                      </div>
                    </>
                  )}
                </div>
                
                <span className="text-xs text-center text-foreground/80 truncate w-full px-2">{item.name}</span>
                
                {/* Hover Actions */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2 gap-2">
                  {/* Temp Workspace Actions */}
                  {currentMode === 'temp' && (
                    <>
                      {item.type !== 'shortcut' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); archiveItem(item.id); }}
                          className="p-1.5 rounded bg-foreground/10 text-foreground/70 hover:text-theme-accent hover:bg-theme-accent/20 transition-all"
                          title="储存到档案区"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}

                  {/* Archive Actions */}
                  {currentMode === 'archived' && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); unarchiveItem(item.id); }}
                        className="p-1.5 rounded bg-foreground/10 text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-all"
                        title="回退到工作区"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); createShortcut(item.id); }}
                        className="p-1.5 rounded bg-foreground/10 text-foreground/70 hover:text-theme-accent hover:bg-theme-accent/20 transition-all"
                        title="在工作区建立超链接"
                      >
                        <ArrowUpLeft className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredItems.length === 0 && (
            <div className="col-span-full h-32 flex flex-col items-center justify-center text-foreground/30 text-sm gap-2">
              {currentMode === 'temp' ? <FileText className="w-8 h-8 opacity-50" /> : <Archive className="w-8 h-8 opacity-50" />}
              <span>{currentMode === 'temp' ? '工作区暂无文件' : '档案区为空'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
