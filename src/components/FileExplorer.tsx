import { useMemo, useState } from 'react';
import {
  Archive,
  ChevronRight,
  File,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Presentation,
  Search,
  Star,
} from 'lucide-react';
import { useStore, WorkspaceItem } from '../store/useStore';
import { cn } from '../lib/utils';

const iconFor = (item: WorkspaceItem) => {
  if (item.type === 'folder') return <Folder className="size-4 text-amber-400" fill="currentColor" />;
  if (item.type === 'excel') return <FileSpreadsheet className="size-4 text-emerald-400" />;
  if (item.type === 'ppt') return <Presentation className="size-4 text-orange-400" />;
  if (item.type === 'word') return <FileText className="size-4 text-blue-400" />;
  return <File className="size-4 text-foreground/55" />;
};

export function FileExplorer() {
  const { workspaceItems, addWorkspaceItem, archiveItem, unarchiveItem } = useStore();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<'all' | 'temp' | 'archived'>('all');
  const [busy, setBusy] = useState(false);

  const items = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return workspaceItems
      .filter((item) => scope === 'all' || item.status === scope)
      .filter((item) => !normalized || item.name.toLocaleLowerCase().includes(normalized))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [query, scope, workspaceItems]);

  const createFolder = async () => {
    const name = `新建文件夹 ${workspaceItems.filter((item) => item.type === 'folder').length + 1}`;
    setBusy(true);
    try {
      let createdPath: string | undefined;
      if (window.ipcRenderer) {
        const result = await window.ipcRenderer.invoke('create-file', { type: 'folder', name });
        if (!result?.success) throw new Error(result?.error || '创建失败');
        createdPath = result.path;
      }
      addWorkspaceItem({ name, type: 'folder', status: 'temp', path: createdPath });
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '无法创建文件夹');
    } finally {
      setBusy(false);
    }
  };

  const openItem = async (item: WorkspaceItem) => {
    if (!window.ipcRenderer || !item.path) return;
    const result = await window.ipcRenderer.invoke('open-path', item.path);
    if (!result?.success) window.alert(result?.error || '无法打开该项目');
  };

  return (
    <section className="zone-panel flex h-full min-w-0 flex-col" aria-label="文件区">
      <div className="zone-heading">
        <div>
          <div className="zone-eyebrow">FILES</div>
          <h2 className="zone-title">文件区</h2>
        </div>
        <button className="icon-button" onClick={createFolder} disabled={busy} aria-label="新建文件夹" title="新建文件夹">
          <Plus className="size-4" />
        </button>
      </div>

      <div className="px-3 pb-3">
        <label className="search-box">
          <Search className="size-4 text-foreground/35" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索文件"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/30"
          />
          <kbd>⌘K</kbd>
        </label>
      </div>

      <nav className="space-y-1 px-2" aria-label="文件筛选">
        {([
          ['all', FolderOpen, '全部文件', workspaceItems.length],
          ['temp', Star, '工作文件', workspaceItems.filter((item) => item.status === 'temp').length],
          ['archived', Archive, '归档', workspaceItems.filter((item) => item.status === 'archived').length],
        ] as const).map(([value, Icon, label, count]) => (
          <button
            key={value}
            onClick={() => setScope(value)}
            className={cn('file-nav-item', scope === value && 'file-nav-item-active')}
          >
            <Icon className="size-4" />
            <span className="flex-1 text-left">{label}</span>
            <span className="text-[11px] tabular-nums text-foreground/35">{count}</span>
          </button>
        ))}
      </nav>

      <div className="mx-3 my-3 h-px bg-foreground/8" />
      <div className="flex items-center justify-between px-4 pb-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/35">最近更新</span>
        <button className="text-foreground/35 hover:text-foreground" aria-label="文件区更多操作">
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="file-row group"
            role="button"
            tabIndex={0}
            onDoubleClick={() => openItem(item)}
            onKeyDown={(event) => event.key === 'Enter' && openItem(item)}
          >
            {iconFor(item)}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-foreground/80">{item.name}</div>
              <div className="mt-0.5 text-[10px] text-foreground/30">
                {item.status === 'temp' ? '工作区' : '已归档'} · {new Date(item.updatedAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
            <button
              onClick={() => item.status === 'temp' ? archiveItem(item.id) : unarchiveItem(item.id)}
              className="opacity-0 transition-opacity group-hover:opacity-100"
              title={item.status === 'temp' ? '归档' : '移回工作区'}
              aria-label={item.status === 'temp' ? '归档' : '移回工作区'}
            >
              <ChevronRight className="size-4 text-foreground/35" />
            </button>
          </div>
        ))}
        {!items.length && (
          <div className="px-3 py-10 text-center text-xs text-foreground/35">
            没有匹配的文件
          </div>
        )}
      </div>
    </section>
  );
}
