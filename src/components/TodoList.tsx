import { useState, useRef, useEffect } from 'react';
import { useStore, TodoItem } from '../store/useStore';
import { cn } from '../lib/utils';
import { Check, Trash2, Calendar as CalendarIcon, GripVertical, ArrowDownAZ, Clock as ClockIcon, Bell, ChevronLeft, ChevronRight, ArrowLeft, Share, Link as LinkIcon, QrCode, CloudSun, Wind, Droplets, Plus, Clock } from 'lucide-react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { CustomTimePicker } from './CustomTimePicker';
import { PriorityKnob } from './PriorityKnob';

const priorities = [
  { id: 1 as const, label: '极高', color: 'text-q1', bg: 'bg-q1', border: 'border-q1', dot: 'bg-q1' },
  { id: 2 as const, label: '高', color: 'text-q2', bg: 'bg-q2', border: 'border-q2', dot: 'bg-q2' },
  { id: 3 as const, label: '中', color: 'text-q3', bg: 'bg-q3', border: 'border-q3', dot: 'bg-q3' },
  { id: 4 as const, label: '低', color: 'text-q4', bg: 'bg-q4', border: 'border-q4', dot: 'bg-q4' },
];

const AutoResizeTextarea = ({ value, onChange, onBlur, onKeyDown, autoFocus, placeholder, className }: any) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      autoFocus={autoFocus}
      placeholder={placeholder}
      rows={1}
      className={cn("w-full bg-transparent resize-none outline-none overflow-hidden py-0.5 placeholder:text-foreground/20", className)}
    />
  );
};

export function TodoList() {
  const { todos, toggleTodo, deleteTodo, selectedDate, setSelectedDate, reorderTodos, updateTodoReminder, updateTodoDetails, toggleClock, updateTodoQuadrant } = useStore();
  const [hoveredTodoId, setHoveredTodoId] = useState<string | null>(null);
  
  // Sort Toggle State
  const [sortMode, setSortMode] = useState<'manual' | 'priority' | 'time'>('manual');
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);

  useEffect(() => {
    setSortMode('manual');
  }, [selectedDate]);

  // Calendar Dropdown State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || new Date()));

  // Time & Weather State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Big Editor State
  const [openedTodoId, setOpenedTodoId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const currentTodos = todos.filter(t => t.date === selectedDate);

  // Handlers

  const handleSortToggle = () => {
    if (sortMode === 'manual') {
      // 切换到按优先级排序
      setOriginalOrder(currentTodos.map(t => t.id));
      const sorted = [...currentTodos].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.quadrant - b.quadrant;
      });
      reorderTodos(sorted);
      setSortMode('priority');
    } else if (sortMode === 'priority') {
      // 切换到按创建时间排序 (最新的在前)
      const sorted = [...currentTodos].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      reorderTodos(sorted);
      setSortMode('time');
    } else {
      // 恢复手动原始顺序，且让完成的沉在底部
      const restored = [...currentTodos].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const idxA = originalOrder.indexOf(a.id);
        const idxB = originalOrder.indexOf(b.id);
        return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
      });
      reorderTodos(restored);
      setSortMode('manual');
    }
  };

  const handleCreateNew = () => {
    const newId = Date.now().toString();
    const newTodo: TodoItem = {
      id: newId,
      title: '',
      content: '',
      quadrant: 2, // 默认优先级 2
      completed: false,
      createdAt: new Date().toISOString(),
      date: selectedDate
    };
    
    // 如果已经有未填写的空白便签，先清理掉它们，防止产生大量垃圾数据
    const filteredTodos = todos.filter(t => t.title.trim() !== '' || t.content.trim() !== '');
    
    useStore.setState({
      todos: [newTodo, ...filteredTodos] // 新建的放到最上面
    });
    
    setOpenedTodoId(newId);
    setEditTitle('');
    setEditContent('');
  };

  const openEditor = (todo: TodoItem) => {
    setOpenedTodoId(todo.id);
    setEditTitle(todo.title);
    setEditContent(todo.content || '');
  };

  const closeEditor = () => {
    if (openedTodoId) {
      updateTodoDetails(openedTodoId, editTitle || '无标题', editContent);
    }
    setOpenedTodoId(null);
    setIsShareMenuOpen(false);
  };

  const handleShare = () => {
    setShareLink(`https://dashboard.app/note/${openedTodoId}`);
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    // 这里可以加一个简单的toast提示，暂时直接关闭菜单
    setIsShareMenuOpen(false);
    alert('链接已复制到剪贴板！');
  };

  // 监听大编辑界面的失去焦点（仅保留保存逻辑，不关闭界面，防止误触）
  const handleEditorBlur = (e: React.FocusEvent) => {
    if (openedTodoId) {
      updateTodoDetails(openedTodoId, editTitle || '无标题', editContent);
    }
  };

  // 移除 onMouseLeave 的自动关闭，因为用户在打字时鼠标很容易不小心移出面板范围
  // 改为提供一个明确的“点击外部遮罩层”或“按下 Esc 键”来关闭

  const closeAndSaveEditor = () => {
    if (openedTodoId) {
      updateTodoDetails(openedTodoId, editTitle || '', editContent);
      
      // 如果关闭时标题和内容都为空，则自动删除该便签
      if (!editTitle.trim() && !editContent.trim()) {
        deleteTodo(openedTodoId);
      }
      
      setOpenedTodoId(null);
      setIsShareMenuOpen(false);
    }
  };

  const isMouseOutsideRef = useRef(false);
  const closeTimerRef = useRef<NodeJS.Timeout>();

  const startCloseTimer = (delay = 400) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      closeAndSaveEditor();
    }, delay);
  };

  const handleEditorMouseLeave = () => {
    isMouseOutsideRef.current = true;
    startCloseTimer(400); // 鼠标移出后 400ms 自动关闭，给予手滑缓冲
  };

  const handleEditorMouseEnter = () => {
    isMouseOutsideRef.current = false;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  // Calendar Logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div id="todo-list-container" className="glass-card flex flex-col h-full overflow-hidden bg-card/90 backdrop-blur-2xl border-foreground/10 shadow-2xl relative group/notepad">
      {/* 锤子便签风格的装订线 */}
      <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-foreground/10 z-0 pointer-events-none" />
      <div className="absolute left-11 top-0 bottom-0 w-[1px] bg-foreground/10 z-0 pointer-events-none" />

      {/* 头部：包含日历弹窗、时间天气和排序 */}
      <div className="px-5 py-4 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <button 
              onClick={() => { setIsCalendarOpen(!isCalendarOpen); setIsWeatherOpen(false); }}
              className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors px-2 py-1 -ml-2 rounded hover:bg-foreground/10"
            >
              <CalendarIcon className="w-4 h-4" />
              <h2 className="font-display text-xs tracking-wider">{selectedDate}</h2>
            </button>

            <div className="w-[1px] h-3 bg-foreground/10 mx-2"></div>

            <button
              onClick={() => { toggleClock(); setIsCalendarOpen(false); setIsWeatherOpen(false); }}
              className="font-display text-xs tracking-wider text-foreground/50 mr-2 hover:text-foreground transition-colors px-1.5 py-1 -ml-1.5 rounded hover:bg-foreground/10"
            >
              {format(currentTime, 'HH:mm')}
            </button>

            <div 
              className="relative" 
              onMouseEnter={() => { setIsWeatherOpen(true); setIsCalendarOpen(false); }}
              onMouseLeave={() => setIsWeatherOpen(false)}
            >
              <button
                className={cn(
                  "flex items-center gap-1.5 transition-colors px-1.5 py-1 rounded hover:bg-foreground/10",
                  isWeatherOpen ? "text-foreground bg-foreground/10" : "text-foreground/50 hover:text-foreground"
                )}
              >
                <CloudSun className="w-4 h-4" />
              </button>

              {/* 天气弹窗 */}
              <AnimatePresence>
                {isWeatherOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-card border border-foreground/10 rounded-xl shadow-2xl p-5 z-50 flex flex-col gap-4 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-foreground/50 text-xs mb-1">当前位置</div>
                        <div className="text-foreground font-medium">深圳市, 南山区</div>
                      </div>
                      <CloudSun className="w-8 h-8 text-q2" />
                    </div>
                    
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-display font-light text-foreground">28</span>
                      <span className="text-foreground/50 text-sm">°C</span>
                    </div>
                    <div className="text-sm text-foreground/80 font-medium">多云转晴</div>

                    <div className="grid grid-cols-2 gap-3 mt-2 pt-4 border-t border-foreground/10">
                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                        <Droplets className="w-3.5 h-3.5 text-theme-accent" /> 湿度 65%
                      </div>
                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                        <Wind className="w-3.5 h-3.5 text-foreground/40" /> 东南风 3级
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 日历弹窗 */}
            <AnimatePresence>
            {isCalendarOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-72 bg-card border border-foreground/10 rounded-xl shadow-2xl p-4 z-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-display font-semibold text-foreground">{format(currentMonth, 'yyyy年 MM月')}</h2>
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); prevMonth(); }} className="p-1.5 hover:bg-foreground/10 rounded-md transition-colors text-foreground">
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextMonth(); }} className="p-1.5 hover:bg-foreground/10 rounded-md transition-colors text-foreground">
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] text-foreground/40 font-medium uppercase tracking-wider">
                  {['日', '一', '二', '三', '四', '五', '六'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: monthStart.getDay() }).map((_, i) => <div key={`empty-${i}`} className="p-1.5" />)}
                  {days.map((day, i) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isSelected = dateStr === selectedDate;
                    const hasTodos = todos.some(t => t.date === dateStr && !t.completed);
                    return (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(dateStr);
                          setIsCalendarOpen(false);
                        }}
                        className={cn(
                          "relative flex items-center justify-center text-xs rounded-lg transition-all cursor-pointer aspect-square hover:bg-foreground/10 text-foreground",
                          !isSameMonth(day, monthStart) && "text-foreground/20",
                          isToday(day) && !isSelected && "text-theme-accent font-bold",
                          isSelected && "bg-foreground/10 font-bold shadow-sm border border-foreground/10"
                        )}
                      >
                        {format(day, 'd')}
                        {hasTodos && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-q1" />}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSortToggle}
            className={cn(
              "p-1.5 rounded transition-all flex items-center gap-1",
              sortMode !== 'manual' ? "bg-foreground/10 text-foreground shadow-sm" : "hover:bg-foreground/10 text-foreground/40 hover:text-foreground"
            )}
            title={
              sortMode === 'manual' ? "按优先级排序" : 
              sortMode === 'priority' ? "按时间排序" : "恢复默认排序"
            }
          >
            <ArrowDownAZ className="w-4 h-4" />
          </button>

          <button
            onClick={handleCreateNew}
            className="w-8 h-8 rounded-full bg-theme-accent text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-theme-accent/20"
            title="新增便签"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 列表区域 */}
      <div className="flex-1 overflow-y-auto px-5 pb-20 pt-2 scrollbar-thin relative z-10">
        <Reorder.Group 
          axis="y" 
          values={currentTodos} 
          onReorder={(newTodos) => {
            setSortMode('manual');
            reorderTodos(newTodos);
          }} 
          className="flex flex-col"
        >
          {currentTodos.map(todo => {
            const pInfo = priorities.find(p => p.id === todo.quadrant) || priorities[3];
            return (
              <Reorder.Item
                value={todo}
                key={todo.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onMouseEnter={() => setHoveredTodoId(todo.id)}
                  onMouseLeave={() => setHoveredTodoId(null)}
                  className="group flex items-start gap-4 py-3 border-b border-foreground/10 relative"
                >
                  <div className="mt-1 cursor-grab active:cursor-grabbing text-foreground/10 hover:text-foreground/30 transition-colors -ml-2">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col items-center gap-2 mt-0.5 relative">
                    <PriorityKnob 
                      quadrant={todo.quadrant} 
                      completed={todo.completed}
                      onToggleComplete={() => toggleTodo(todo.id)}
                      onChangePriority={(q) => updateTodoQuadrant(todo.id, q)}
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col min-w-0">
                    {/* 只显示标题 */}
                    <div 
                      onClick={() => openEditor(todo)}
                      className={cn(
                        "cursor-pointer whitespace-pre-wrap leading-relaxed text-[15px] py-0.5 transition-all duration-300 select-none",
                        todo.completed ? "text-foreground/30 line-through" : "text-[#e5e0d8]"
                      )}
                      title="点击编辑详细内容"
                    >
                      {todo.title || '空白便签 (点击编辑)'}
                    </div>
                    
                    {/* 悬停展示的详情内容 */}
                    <AnimatePresence>
                      {hoveredTodoId === todo.id && todo.content && !todo.completed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="text-xs text-foreground/50 mt-1.5 whitespace-pre-wrap leading-relaxed line-clamp-4">
                            {todo.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {todo.reminderTime && !todo.completed && (
                      <span className="text-[11px] text-foreground/40 flex items-center gap-1 mt-1 font-medium tracking-wide">
                        <Bell className="w-3 h-3 text-q2" /> {todo.reminderTime} 提醒
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                    <CustomTimePicker 
                      value={todo.reminderTime || ''}
                      onChange={(time) => updateTodoReminder(todo.id, time)}
                    />
                    <button onClick={() => deleteTodo(todo.id)} className="p-1.5 hover:bg-foreground/10 rounded-md text-foreground/30 hover:text-q1 transition-all" title="删除便签">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Reorder.Item>
              );
            })}
        </Reorder.Group>
      </div>

      {/* 沉浸式编辑全屏浮层 (类似锤子便签编辑界面) */}
      <AnimatePresence>
        {openedTodoId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 z-50 bg-card flex flex-col shadow-2xl outline-none"
            tabIndex={-1} // 允许整个 div 捕获焦点，从而触发键盘事件
            onBlur={handleEditorBlur}
            onMouseLeave={handleEditorMouseLeave}
            onMouseEnter={handleEditorMouseEnter}
            onKeyDown={(e) => {
              // 按下 Esc 键也可以快速关闭
              if (e.key === 'Escape') {
                closeAndSaveEditor();
                return;
              }
              // 如果鼠标在外部，且用户正在打字，则重置并延长关闭定时器，确保打字不被打断
              if (isMouseOutsideRef.current) {
                startCloseTimer(1500); // 等待1.5秒没有输入才折叠
              }
            }}
          >
            {/* 顶栏 */}
            <div className="flex items-center justify-end p-4 border-b border-foreground/10 bg-card/80 backdrop-blur-xl min-h-[64px]">
              <div className="flex items-center gap-4 pr-2">
                <span className="text-xs text-foreground/30 hidden sm:inline-block">
                  自动保存于 {format(new Date(), 'HH:mm')}
                </span>
                <div className="relative">
                  <button 
                    onClick={handleShare}
                    className="p-2 hover:bg-foreground/10 rounded-full text-foreground/70 hover:text-foreground transition-all"
                    title="分享便签"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                  
                  {/* 分享菜单 */}
                  <AnimatePresence>
                    {isShareMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-card border border-foreground/10 rounded-xl shadow-2xl p-4 z-50 flex flex-col gap-4"
                      >
                        <h3 className="text-sm font-medium text-foreground">分享便签</h3>
                        
                        <div className="bg-foreground/10 rounded-lg p-3 flex flex-col items-center justify-center gap-2">
                          <div className="w-24 h-24 bg-white rounded flex items-center justify-center">
                            <QrCode className="w-16 h-16 text-background" />
                          </div>
                          <span className="text-[10px] text-foreground/50">微信扫码分享</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-background/10 border border-foreground/10 rounded-lg px-2 py-1.5 text-xs text-foreground/70 truncate">
                            {shareLink}
                          </div>
                          <button 
                            onClick={handleCopyLink}
                            className="p-1.5 bg-theme-accent/20 text-theme-accent hover:bg-theme-accent/40 rounded-lg transition-colors flex-shrink-0"
                            title="复制链接"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* 编辑区域 */}
            <div 
              className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-4 scrollbar-thin"
              onClick={() => {
                // 点击空白区域也视为触发失焦/关闭的辅助逻辑，或者直接让外层的 onBlur 处理
              }}
            >
              <AutoResizeTextarea
                value={editTitle}
                onChange={(e: any) => {
                  setEditTitle(e.target.value);
                  updateTodoDetails(openedTodoId!, e.target.value || '无标题', editContent);
                }}
                placeholder="标题"
                className="text-2xl font-bold text-foreground placeholder:text-foreground/20"
              />
              <textarea
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value);
                  updateTodoDetails(openedTodoId!, editTitle || '无标题', e.target.value);
                }}
                placeholder="添加详细内容..."
                className="flex-1 w-full bg-transparent resize-none outline-none text-foreground/70 leading-relaxed text-[15px] placeholder:text-foreground/20"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
