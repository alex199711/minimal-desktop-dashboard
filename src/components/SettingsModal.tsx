import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { X, Monitor, MonitorUp, Wifi, Bluetooth, Battery, Shield, Volume2 } from 'lucide-react';

export function SettingsModal() {
  const { toggleSettings } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-background/10 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={toggleSettings}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl h-[600px] bg-card border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden flex"
      >
        {/* Left Sidebar */}
        <div className="w-64 border-r border-foreground/10 bg-foreground/10 p-4 flex flex-col gap-2">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4 px-2">电脑设置</h2>
          
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-foreground/10 text-foreground transition-colors">
            <Monitor className="w-4 h-4" /> <span>系统</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors">
            <Wifi className="w-4 h-4" /> <span>网络和互联网</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors">
            <Bluetooth className="w-4 h-4" /> <span>蓝牙和其他设备</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors">
            <Battery className="w-4 h-4" /> <span>电源和电池</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors">
            <Shield className="w-4 h-4" /> <span>隐私和安全性</span>
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-foreground/10 flex justify-end">
            <button onClick={toggleSettings} className="p-1.5 text-foreground/40 hover:text-foreground hover:bg-foreground/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto scrollbar-thin flex flex-col gap-8">
            <div>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-6">系统</h3>
              
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-foreground/10 border border-foreground/10 flex items-center justify-between hover:bg-foreground/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-theme-accent/20 flex items-center justify-center text-theme-accent">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-foreground font-medium">显示器</div>
                      <div className="text-xs text-foreground/50">分辨率、缩放、多显示器</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-foreground/10 border border-foreground/10 flex items-center justify-between hover:bg-foreground/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-q2/20 flex items-center justify-center text-q2">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-foreground font-medium">声音</div>
                      <div className="text-xs text-foreground/50">音量级别、输出、输入</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-8 border-t border-foreground/10 text-center text-xs text-foreground/30">
              这里是电脑设置的占位界面。在打包为 Tauri/Electron 后，这里可以接入真实的系统 API 或直接呼出系统设置。
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}