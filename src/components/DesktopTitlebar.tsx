import { Maximize2, Minus, X } from 'lucide-react';

export function DesktopTitlebar() {
  const control = (action: 'minimize' | 'maximize' | 'close') => {
    window.ipcRenderer?.send('window-control', action);
  };

  return (
    <header className="desktop-titlebar">
      <div className="flex items-center gap-2 px-3">
        <div className="size-2 rounded-full bg-theme-accent shadow-[0_0_12px_hsl(var(--theme-accent))]" />
        <span className="text-[11px] font-semibold tracking-[0.12em] text-foreground/60">FOCUS DESK</span>
      </div>
      <div className="titlebar-controls">
        <button onClick={() => control('minimize')} aria-label="最小化窗口"><Minus className="size-3.5" /></button>
        <button onClick={() => control('maximize')} aria-label="最大化或还原窗口"><Maximize2 className="size-3" /></button>
        <button onClick={() => control('close')} aria-label="关闭窗口" className="titlebar-close"><X className="size-3.5" /></button>
      </div>
    </header>
  );
}
