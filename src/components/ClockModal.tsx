import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Timer, Plus, Trash2, Play, Square, Globe, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export function ClockModal() {
  const { toggleClock, alarms, timers, addAlarm, toggleAlarm, deleteAlarm, addTimer, deleteTimer } = useStore();
  const [activeTab, setActiveTab] = useState<'alarm' | 'timer' | 'world' | 'stopwatch'>('alarm');
  
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');
  const [newAlarmLabel, setNewAlarmLabel] = useState('响一次');
  const [isAddingAlarm, setIsAddingAlarm] = useState(false);

  // Common Timers Mock
  const commonTimers = [
    { label: '番茄🍅', duration: 25 * 60 },
    { label: '冥想🧘‍♂️', duration: 10 * 60 },
    { label: '计时', duration: 10 * 60 },
    { label: '计时', duration: 20 * 60 },
  ];

  const handleAddAlarm = () => {
    addAlarm({ time: newAlarmTime, label: newAlarmLabel, enabled: true });
    setIsAddingAlarm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-background/10 backdrop-blur-md flex items-center justify-center p-6"
      onClick={toggleClock}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] h-[750px] bg-[#f7f8fa] dark:bg-card/80 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Close Button */}
        <button 
          onClick={toggleClock} 
          className="absolute top-6 right-6 p-2 text-background/40 hover:text-background dark:text-foreground/40 dark:hover:text-foreground rounded-full hover:bg-background/10 dark:hover:bg-foreground/10 transition-colors z-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
          <AnimatePresence mode="wait">
            {activeTab === 'alarm' && (
              <motion.div key="alarm" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-8">
                <div className="mb-8">
                  <h1 className="text-4xl font-display font-medium text-background dark:text-foreground tracking-widest">闹钟</h1>
                  <p className="text-sm text-background/50 dark:text-foreground/50 mt-2 font-medium">距离下次响铃还有 22 分钟</p>
                </div>

                <div className="flex flex-col gap-4">
                  {alarms.map(alarm => (
                    <div key={alarm.id} className="bg-white dark:bg-card rounded-3xl p-6 flex items-center justify-between shadow-sm border border-black/5 dark:border-foreground/10">
                      <div className="flex flex-col">
                        <span className={cn("text-5xl font-display font-light tracking-tight", alarm.enabled ? "text-background dark:text-foreground" : "text-background/30 dark:text-foreground/30")}>
                          {alarm.time}
                        </span>
                        <span className={cn("text-sm mt-2 font-medium", alarm.enabled ? "text-background/50 dark:text-foreground/50" : "text-background/20 dark:text-foreground/20")}>
                          {alarm.label}
                        </span>
                      </div>
                      
                      {/* Custom Toggle Switch */}
                      <button 
                        onClick={() => toggleAlarm(alarm.id)}
                        className={cn("w-[52px] h-8 rounded-full transition-colors relative flex items-center px-1", alarm.enabled ? "bg-[#0066ff]" : "bg-background/10 dark:bg-foreground/10")}
                      >
                        <motion.div 
                          layout
                          className="w-6 h-6 rounded-full bg-white shadow-sm"
                          animate={{ x: alarm.enabled ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  ))}

                  {isAddingAlarm && (
                    <div className="bg-white dark:bg-card rounded-3xl p-6 flex flex-col gap-4 shadow-sm border border-black/5 dark:border-foreground/10">
                      <input type="time" value={newAlarmTime} onChange={(e) => setNewAlarmTime(e.target.value)} className="bg-background/10 dark:bg-foreground/10 border-none text-background dark:text-foreground rounded-xl px-4 py-3 outline-none text-2xl font-display" />
                      <input type="text" placeholder="标签 (如: 法定工作日)" value={newAlarmLabel} onChange={(e) => setNewAlarmLabel(e.target.value)} className="bg-background/10 dark:bg-foreground/10 border-none text-background dark:text-foreground rounded-xl px-4 py-3 outline-none text-sm" />
                      <div className="flex gap-2">
                        <button onClick={() => setIsAddingAlarm(false)} className="flex-1 py-3 text-sm font-medium text-background/50 dark:text-foreground/50 bg-background/10 dark:bg-foreground/10 rounded-xl">取消</button>
                        <button onClick={handleAddAlarm} className="flex-1 py-3 text-sm font-medium text-foreground bg-[#0066ff] rounded-xl">保存</button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'timer' && (
              <motion.div key="timer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
                {/* Timer Dial Mockup */}
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="flex items-center gap-4 text-background/20 dark:text-foreground/20 font-display text-4xl font-light">
                    <span>23</span><span>04</span><span>59</span>
                  </div>
                  <div className="flex items-center gap-4 text-background dark:text-foreground font-display text-6xl font-light my-6">
                    <span>00</span><span className="text-background/30 dark:text-foreground/30 pb-2">:</span><span>05</span><span className="text-background/30 dark:text-foreground/30 pb-2">:</span><span>00</span>
                  </div>
                  <div className="flex items-center gap-4 text-background/20 dark:text-foreground/20 font-display text-4xl font-light">
                    <span>01</span><span>06</span><span>01</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-sm font-medium text-background/80 dark:text-foreground/80 tracking-widest">常用计时器</h3>
                  <button className="text-sm font-medium text-[#0066ff]">添加</button>
                </div>

                <div className="flex flex-col gap-3">
                  {commonTimers.map((timer, i) => (
                    <div key={i} className="bg-white dark:bg-card rounded-2xl p-5 flex items-center justify-between shadow-sm border border-black/5 dark:border-foreground/10 cursor-pointer hover:scale-[1.02] transition-transform">
                      <span className="text-base font-medium text-background/80 dark:text-foreground/80">{timer.label}</span>
                      <span className="text-lg font-display font-light text-background/80 dark:text-foreground/80">
                        {Math.floor(timer.duration / 60).toString().padStart(2, '0')}:{(timer.duration % 60).toString().padStart(2, '0')}:00
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {(activeTab === 'world' || activeTab === 'stopwatch') && (
              <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-full text-background/30 dark:text-foreground/30">
                开发中...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Action Button */}
        <div className="absolute bottom-28 left-0 right-0 flex justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {activeTab === 'alarm' && !isAddingAlarm && (
              <motion.button 
                key="add-alarm"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                onClick={() => setIsAddingAlarm(true)}
                className="w-16 h-16 bg-[#0066ff] rounded-full shadow-[0_8px_30px_rgba(0,102,255,0.4)] flex items-center justify-center text-foreground pointer-events-auto hover:scale-110 transition-transform"
              >
                <Plus className="w-8 h-8" />
              </motion.button>
            )}
            {activeTab === 'timer' && (
              <motion.button 
                key="play-timer"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="w-20 h-20 bg-[#0066ff] rounded-full shadow-[0_8px_30px_rgba(0,102,255,0.4)] flex items-center justify-center text-foreground pointer-events-auto hover:scale-110 transition-transform"
              >
                <Play className="w-10 h-10 ml-1" fill="currentColor" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-foreground/10 dark:bg-card/80 backdrop-blur-xl border-t border-black/5 dark:border-foreground/10 flex items-center justify-around px-6 pb-4">
          <button onClick={() => setActiveTab('alarm')} className={cn("flex flex-col items-center gap-1.5 transition-colors", activeTab === 'alarm' ? "text-background dark:text-foreground" : "text-background/30 dark:text-foreground/30")}>
            <Bell className="w-6 h-6" />
            <span className="text-[10px] font-medium tracking-widest">闹钟</span>
          </button>
          <button onClick={() => setActiveTab('world')} className={cn("flex flex-col items-center gap-1.5 transition-colors", activeTab === 'world' ? "text-background dark:text-foreground" : "text-background/30 dark:text-foreground/30")}>
            <Globe className="w-6 h-6" />
            <span className="text-[10px] font-medium tracking-widest">世界时钟</span>
          </button>
          <button onClick={() => setActiveTab('stopwatch')} className={cn("flex flex-col items-center gap-1.5 transition-colors", activeTab === 'stopwatch' ? "text-background dark:text-foreground" : "text-background/30 dark:text-foreground/30")}>
            <Clock className="w-6 h-6" />
            <span className="text-[10px] font-medium tracking-widest">秒表</span>
          </button>
          <button onClick={() => setActiveTab('timer')} className={cn("flex flex-col items-center gap-1.5 transition-colors", activeTab === 'timer' ? "text-background dark:text-foreground" : "text-background/30 dark:text-foreground/30")}>
            <Timer className="w-6 h-6" />
            <span className="text-[10px] font-medium tracking-widest">计时器</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
