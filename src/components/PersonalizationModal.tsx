import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { X, Palette, Layout, Type, Image as ImageIcon, Sparkles, Sliders } from 'lucide-react';
import { cn } from '../lib/utils';

type TabType = 'theme' | 'wallpaper' | 'layout' | 'font' | 'animation';

export function PersonalizationModal() {
  const { togglePersonalization, themeMode, setThemeMode, accentColor, setAccentColor, glassOpacity, setGlassOpacity, wallpaper, setWallpaper, layoutDensity, setLayoutDensity, panelRadius, setPanelRadius, fontFamily, setFontFamily, enableAnimations, setEnableAnimations } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('theme');

  const ACCENT_COLORS = [
    { id: 'orange', name: '活力橙', class: 'bg-orange-500' },
    { id: 'red', name: '重要红', class: 'bg-q1' },
    { id: 'yellow', name: '提示黄', class: 'bg-q2' },
    { id: 'green', name: '成功绿', class: 'bg-q4' },
    { id: 'blue', name: '科技蓝', class: 'bg-q3' },
    { id: 'purple', name: '优雅紫', class: 'bg-purple-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-background/10 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={togglePersonalization}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[650px] bg-card border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden flex"
      >
        {/* Left Sidebar */}
        <div className="w-64 border-r border-foreground/10 bg-foreground/10 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-q2 to-q1 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-foreground" />
            </div>
            <h2 className="text-lg font-display font-semibold text-foreground">个性化设置</h2>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider px-3 mb-2">外观</div>
            <button
              onClick={() => setActiveTab('theme')}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors", activeTab === 'theme' ? "bg-foreground/10 text-foreground" : "text-foreground/50 hover:bg-foreground/10 hover:text-foreground")}
            >
              <Palette className={cn("w-4 h-4", activeTab === 'theme' ? "text-theme-accent" : "")} /> <span className="font-medium text-sm">主题与颜色</span>
            </button>
            <button
              onClick={() => setActiveTab('wallpaper')}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors", activeTab === 'wallpaper' ? "bg-foreground/10 text-foreground" : "text-foreground/50 hover:bg-foreground/10 hover:text-foreground")}
            >
              <ImageIcon className={cn("w-4 h-4", activeTab === 'wallpaper' ? "text-theme-accent" : "")} /> <span className="font-medium text-sm">背景壁纸</span>
            </button>

            <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider px-3 mb-2 mt-4">界面</div>
            <button
              onClick={() => setActiveTab('layout')}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors", activeTab === 'layout' ? "bg-foreground/10 text-foreground" : "text-foreground/50 hover:bg-foreground/10 hover:text-foreground")}
            >
              <Layout className={cn("w-4 h-4", activeTab === 'layout' ? "text-theme-accent" : "")} /> <span className="font-medium text-sm">布局和网格</span>
            </button>
            <button
              onClick={() => setActiveTab('font')}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors", activeTab === 'font' ? "bg-foreground/10 text-foreground" : "text-foreground/50 hover:bg-foreground/10 hover:text-foreground")}
            >
              <Type className={cn("w-4 h-4", activeTab === 'font' ? "text-theme-accent" : "")} /> <span className="font-medium text-sm">字体设置</span>
            </button>
            <button
              onClick={() => setActiveTab('animation')}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors", activeTab === 'animation' ? "bg-foreground/10 text-foreground" : "text-foreground/50 hover:bg-foreground/10 hover:text-foreground")}
            >
              <Sliders className={cn("w-4 h-4", activeTab === 'animation' ? "text-theme-accent" : "")} /> <span className="font-medium text-sm">动画效果</span>
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col bg-card">
          <div className="p-4 border-b border-foreground/10 flex justify-end bg-background/10">
            <button onClick={togglePersonalization} className="p-1.5 text-foreground/40 hover:text-foreground hover:bg-foreground/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-8 overflow-y-auto scrollbar-thin flex flex-col gap-10">

            {activeTab === 'theme' && (
              <>
                {/* Section 1: 主题模式 */}
                <section>
                  <div className="mb-6">
                    <h3 className="text-xl font-display font-semibold text-foreground">主题模式</h3>
                    <p className="text-sm text-foreground/40 mt-1">选择最适合您工作环境的整体色调</p>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="group cursor-pointer" onClick={() => setThemeMode('dark')}>
                      <div className={cn("aspect-video rounded-xl bg-card/80 border-2 overflow-hidden relative mb-3 transition-all", themeMode === 'dark' ? "border-theme-accent shadow-lg shadow-theme-accent/10" : "border-transparent group-hover:border-foreground/10")}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-theme-accent/10 to-transparent" />
                        {/* Mock UI elements */}
                        <div className="absolute left-4 top-4 bottom-4 w-1/4 bg-foreground/10 rounded-lg" />
                        <div className="absolute left-[35%] top-4 right-4 h-1/4 bg-foreground/10 rounded-lg" />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full border", themeMode === 'dark' ? "bg-theme-accent border-theme-accent" : "border-foreground/10")} />
                        <span className={cn("text-sm font-medium", themeMode === 'dark' ? "text-foreground" : "text-foreground/70")}>深色模式</span>
                      </div>
                    </div>

                    <div className="group cursor-pointer" onClick={() => setThemeMode('light')}>
                      <div className={cn("aspect-video rounded-xl bg-gray-100 border-2 overflow-hidden relative mb-3 transition-all", themeMode === 'light' ? "border-theme-accent shadow-lg shadow-theme-accent/10" : "border-transparent opacity-80 group-hover:opacity-100 group-hover:border-foreground/10")}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-white" />
                        <div className="absolute left-4 top-4 bottom-4 w-1/4 bg-background/10 rounded-lg" />
                        <div className="absolute left-[35%] top-4 right-4 h-1/4 bg-background/10 rounded-lg" />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full border", themeMode === 'light' ? "bg-theme-accent border-theme-accent" : "border-foreground/10")} />
                        <span className={cn("text-sm font-medium", themeMode === 'light' ? "text-foreground" : "text-foreground/70")}>浅色模式</span>
                      </div>
                    </div>

                    <div className="group cursor-pointer" onClick={() => setThemeMode('auto')}>
                      <div className={cn("aspect-video rounded-xl bg-gradient-to-br from-gray-800 to-[#151515] border-2 overflow-hidden relative mb-3 flex items-center justify-center transition-all", themeMode === 'auto' ? "border-theme-accent shadow-lg shadow-theme-accent/10" : "border-transparent opacity-80 group-hover:opacity-100 group-hover:border-foreground/10")}>
                        <span className="text-foreground/30 text-xs font-medium">Auto</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full border", themeMode === 'auto' ? "bg-theme-accent border-theme-accent" : "border-foreground/10")} />
                        <span className={cn("text-sm font-medium", themeMode === 'auto' ? "text-foreground" : "text-foreground/70")}>跟随系统</span>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px w-full bg-foreground/10" />

                {/* Section 2: 强调色 */}
                <section>
                  <div className="mb-6">
                    <h3 className="text-xl font-display font-semibold text-foreground">强调色</h3>
                    <p className="text-sm text-foreground/40 mt-1">定制按钮、高亮状态和激活指示器的颜色</p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {ACCENT_COLORS.map((color) => {
                      const isActive = accentColor === color.id;
                      return (
                        <button
                          key={color.id}
                          className="flex flex-col items-center gap-2 group"
                          onClick={() => setAccentColor(color.id)}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-full border-4 flex items-center justify-center transition-transform group-hover:scale-110",
                            isActive ? "border-foreground/10 shadow-lg shadow-white/10" : "border-transparent",
                            color.class
                          )}>
                            {isActive && <div className="w-4 h-4 rounded-full bg-white shadow-sm" />}
                          </div>
                          <span className={cn(
                            "text-xs transition-colors",
                            isActive ? "text-foreground font-medium" : "text-foreground/40 group-hover:text-foreground/70"
                          )}>{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <div className="h-px w-full bg-foreground/10" />

                {/* Section 3: 玻璃拟物态程度 */}
                <section>
                  <div className="mb-6">
                    <h3 className="text-xl font-display font-semibold text-foreground">材质透明度</h3>
                    <p className="text-sm text-foreground/40 mt-1">调整背景模糊程度 (Glassmorphism)</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-sm text-foreground/40">清晰</span>
                    <div className="flex-1 h-2 bg-foreground/10 rounded-full relative cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
                        setGlassOpacity(percent);
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-theme-accent rounded-full transition-all"
                        style={{ width: `${glassOpacity}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-all"
                        style={{ left: `calc(${glassOpacity}% - 8px)` }}
                      />
                    </div>
                    <span className="text-sm text-foreground/40">模糊</span>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'wallpaper' && (
              <section>
                <div className="mb-6">
                  <h3 className="text-xl font-display font-semibold text-foreground">背景壁纸</h3>
                  <p className="text-sm text-foreground/40 mt-1">选择一张您喜欢的图片作为工作台背景</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setWallpaper('none')}
                      className={cn("aspect-video bg-foreground/5 rounded-xl flex items-center justify-center border-2 cursor-pointer transition-colors", wallpaper === 'none' ? "border-theme-accent shadow-lg" : "border-transparent hover:border-foreground/10")}
                    >
                      <span className="text-sm text-foreground/70">默认无背景</span>
                    </div>
                    <div
                      onClick={() => setWallpaper('abstract')}
                      className={cn("aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border-2 cursor-pointer transition-colors", wallpaper === 'abstract' ? "border-theme-accent shadow-lg" : "border-transparent hover:border-foreground/10")}
                    >
                      <span className="text-sm text-foreground/70">抽象流光</span>
                    </div>
                    <div
                      onClick={() => setWallpaper('morning')}
                      className={cn("aspect-video bg-gradient-to-tr from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border-2 cursor-pointer transition-colors", wallpaper === 'morning' ? "border-theme-accent shadow-lg" : "border-transparent hover:border-foreground/10")}
                    >
                      <span className="text-sm text-foreground/70">晨曦暖阳</span>
                    </div>
                    <div
                      onClick={() => setWallpaper('nature')}
                      className={cn("aspect-video bg-gradient-to-bl from-green-500/20 to-teal-500/20 rounded-xl flex items-center justify-center border-2 cursor-pointer transition-colors", wallpaper === 'nature' ? "border-theme-accent shadow-lg" : "border-transparent hover:border-foreground/10")}
                    >
                      <span className="text-sm text-foreground/70">自然极简</span>
                    </div>
                  </div>
                <div className="mt-6 p-4 rounded-xl bg-theme-accent/10 border border-theme-accent/20 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-theme-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    您可以稍后在此处上传自定义图片。由于本地持久化尚未完全实现，当前仅提供基础预览项。
                  </p>
                </div>
              </section>
            )}

            {activeTab === 'layout' && (
              <section>
                <div className="mb-6">
                  <h3 className="text-xl font-display font-semibold text-foreground">布局和网格</h3>
                  <p className="text-sm text-foreground/40 mt-1">定制面板之间的间距与排版风格</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">信息密度</h4>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setLayoutDensity('comfortable')}
                        className={cn("flex-1 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-colors", layoutDensity === 'comfortable' ? "border-theme-accent bg-theme-accent/10 text-theme-accent" : "border-transparent hover:border-foreground/10 bg-foreground/5 text-foreground/70 hover:text-foreground")}
                      >
                        舒适（默认）
                      </button>
                      <button
                        onClick={() => setLayoutDensity('compact')}
                        className={cn("flex-1 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-colors", layoutDensity === 'compact' ? "border-theme-accent bg-theme-accent/10 text-theme-accent" : "border-transparent hover:border-foreground/10 bg-foreground/5 text-foreground/70 hover:text-foreground")}
                      >
                        紧凑
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">面板圆角</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-foreground/40">直角</span>
                      <div className="flex-1 h-2 bg-foreground/10 rounded-full relative cursor-pointer"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
                          // map percent 0-100 to radius 0-32
                          const r = Math.round((percent / 100) * 32);
                          setPanelRadius(r);
                        }}
                      >
                        <div className="absolute left-0 top-0 bottom-0 bg-theme-accent rounded-full transition-all" style={{ width: `${(panelRadius / 32) * 100}%` }} />
                        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all" style={{ left: `calc(${(panelRadius / 32) * 100}% - 8px)` }} />
                      </div>
                      <span className="text-sm text-foreground/40">圆润</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'font' && (
              <section>
                <div className="mb-6">
                  <h3 className="text-xl font-display font-semibold text-foreground">字体设置</h3>
                  <p className="text-sm text-foreground/40 mt-1">更改全局阅读体验</p>
                </div>
                <div className="space-y-4">
                  <div
                    onClick={() => setFontFamily('system')}
                    className={cn("p-4 rounded-xl border-2 cursor-pointer transition-colors", fontFamily === 'system' ? "border-theme-accent bg-theme-accent/5" : "border-transparent hover:border-foreground/10 bg-foreground/5")}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-foreground">系统默认 (System UI)</span>
                      <div className={cn("w-4 h-4 rounded-full border-[5px]", fontFamily === 'system' ? "border-theme-accent bg-background" : "border-foreground/20 bg-transparent")} />
                    </div>
                    <p className="text-sm text-foreground/50">采用操作系统原生的最佳渲染字体。</p>
                  </div>
                  <div
                    onClick={() => setFontFamily('serif')}
                    className={cn("p-4 rounded-xl border-2 cursor-pointer transition-colors", fontFamily === 'serif' ? "border-theme-accent bg-theme-accent/5" : "border-transparent hover:border-foreground/10 bg-foreground/5")}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-foreground font-serif">衬线体 (Serif)</span>
                      <div className={cn("w-4 h-4 rounded-full border-[5px]", fontFamily === 'serif' ? "border-theme-accent bg-background" : "border-foreground/20 bg-transparent")} />
                    </div>
                    <p className="text-sm text-foreground/50 font-serif">适合沉浸式长文阅读，优雅且具人文气息。</p>
                  </div>
                  <div
                    onClick={() => setFontFamily('mono')}
                    className={cn("p-4 rounded-xl border-2 cursor-pointer transition-colors", fontFamily === 'mono' ? "border-theme-accent bg-theme-accent/5" : "border-transparent hover:border-foreground/10 bg-foreground/5")}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-foreground font-mono">等宽字体 (Monospace)</span>
                      <div className={cn("w-4 h-4 rounded-full border-[5px]", fontFamily === 'mono' ? "border-theme-accent bg-background" : "border-foreground/20 bg-transparent")} />
                    </div>
                    <p className="text-sm text-foreground/50 font-mono">代码极客的最爱，每个字符宽度一致。</p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'animation' && (
              <section>
                <div className="mb-6">
                  <h3 className="text-xl font-display font-semibold text-foreground">动画效果</h3>
                  <p className="text-sm text-foreground/40 mt-1">控制界面的动效与过渡反馈</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5">
                    <div>
                      <h4 className="font-medium text-foreground">全局微动效</h4>
                      <p className="text-sm text-foreground/50 mt-1">开启按钮悬停、面板展开等弹性过渡效果</p>
                    </div>
                    <div
                      className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", enableAnimations ? "bg-theme-accent" : "bg-foreground/20")}
                      onClick={() => setEnableAnimations(!enableAnimations)}
                    >
                      <div className={cn("absolute top-1 bottom-1 w-4 rounded-full shadow-sm transition-all", enableAnimations ? "right-1 bg-white" : "left-1 bg-foreground/40")} />
                    </div>
                  </div>
                </div>
              </section>
            )}

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
