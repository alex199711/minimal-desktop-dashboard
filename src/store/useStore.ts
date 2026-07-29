import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

export interface TodoItem {
  id: string;
  title: string;
  content?: string; // 详细内容
  quadrant: 1 | 2 | 3 | 4; // 1:重要紧急 2:重要不紧急 3:紧急不重要 4:不重要不紧急
  completed: boolean;
  createdAt: string;
  date: string; // 关联的日期，格式 YYYY-MM-DD
  reminderTime?: string; // 提醒时间，格式 HH:mm
  externalId?: string;
  source?: 'local' | 'todoist';
}

export interface WorkspaceItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'shortcut' | 'word' | 'excel' | 'ppt' | 'txt'; // 增加 shortcut（超链接快捷方式）及各类文档
  status: 'temp' | 'archived'; // 临时或已归档
  targetId?: string; // 如果是 shortcut，指向原档案的 ID
  updatedAt: string;
  path?: string;
}

export interface AlarmItem {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export interface TimerItem {
  id: string;
  duration: number; // 总时长(秒)
  label: string;
}

export interface AppItem {
  id: string;
  name: string;
  iconName: string; // 对应 Lucide 图标的名字，例如 'Mail'
  color: string;
  usageCount: number;
  lastUsedAt?: string;
}

interface DashboardState {
  todos: TodoItem[];
  workspaceItems: WorkspaceItem[];
  alarms: AlarmItem[];
  timers: TimerItem[];
  apps: AppItem[];
  selectedDate: string;
  isAppLauncherOpen: boolean;
  isClockOpen: boolean;
  isNewsFolded: boolean;
  isSettingsOpen: boolean;
  isPersonalizationOpen: boolean;
  themeMode: 'dark' | 'light' | 'auto';
  accentColor: string;
  glassOpacity: number;
  wallpaper: string;
  layoutDensity: 'comfortable' | 'compact';
  panelRadius: number;
  fontFamily: 'system' | 'serif' | 'mono';
  enableAnimations: boolean;
  setThemeMode: (mode: 'dark' | 'light' | 'auto') => void;
  setAccentColor: (color: string) => void;
  setGlassOpacity: (opacity: number) => void;
  setWallpaper: (wallpaper: string) => void;
  setLayoutDensity: (density: 'comfortable' | 'compact') => void;
  setPanelRadius: (radius: number) => void;
  setFontFamily: (font: 'system' | 'serif' | 'mono') => void;
  setEnableAnimations: (enable: boolean) => void;
  setSelectedDate: (date: string) => void;
  toggleAppLauncher: () => void;
  toggleClock: () => void;
  toggleNewsFolded: () => void;
  toggleSettings: () => void;
  togglePersonalization: () => void;
  addAlarm: (alarm: Omit<AlarmItem, 'id'>) => void;
  toggleAlarm: (id: string) => void;
  deleteAlarm: (id: string) => void;
  addTimer: (timer: Omit<TimerItem, 'id'>) => void;
  deleteTimer: (id: string) => void;
  incrementAppUsage: (id: string) => void;
  mergeTodoistTodos: (todos: TodoItem[]) => void;
  linkTodoToTodoist: (id: string, externalId: string) => void;
  addTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodoTitle: (id: string, title: string) => void;
  updateTodoDetails: (id: string, title: string, content: string) => void;
  updateTodoQuadrant: (id: string, quadrant: 1 | 2 | 3 | 4) => void;
  reorderTodos: (todos: TodoItem[]) => void;
  updateTodoReminder: (id: string, time: string) => void;
  addWorkspaceItem: (item: Omit<WorkspaceItem, 'id' | 'updatedAt'>) => void;
  createShortcut: (targetId: string) => void;
  archiveItem: (id: string) => void;
  unarchiveItem: (id: string) => void;
  deleteWorkspaceItem: (id: string) => void;
}

export const useStore = create<DashboardState>()(
  persist(
    (set) => ({
      selectedDate: format(new Date(), 'yyyy-MM-dd'),
      isAppLauncherOpen: false,
      isClockOpen: false,
      isNewsFolded: false,
      isSettingsOpen: false,
      isPersonalizationOpen: false,
      themeMode: 'dark',
      accentColor: 'blue',
      glassOpacity: 70,
      wallpaper: 'none',
      layoutDensity: 'comfortable',
      panelRadius: 16,
      fontFamily: 'system',
      enableAnimations: true,
      alarms: [],
      timers: [],
      apps: [
        { id: '1', name: '浏览器', iconName: 'Compass', color: 'bg-cyan-500', usageCount: 10 },
        { id: '2', name: '邮件', iconName: 'Mail', color: 'bg-blue-500', usageCount: 8 },
        { id: '3', name: '笔记', iconName: 'Book', color: 'bg-yellow-600', usageCount: 6 },
        { id: '4', name: '日历', iconName: 'Calendar', color: 'bg-orange-500', usageCount: 4 },
        { id: '5', name: '消息', iconName: 'MessageSquare', color: 'bg-green-500', usageCount: 2 },
        { id: '6', name: '相册', iconName: 'Image', color: 'bg-purple-500', usageCount: 1 },
        { id: '7', name: '视频', iconName: 'Video', color: 'bg-red-500', usageCount: 0 },
        { id: '8', name: '音乐', iconName: 'Music', color: 'bg-amber-500', usageCount: 0 },
        { id: '9', name: '地图', iconName: 'Map', color: 'bg-emerald-500', usageCount: 0 },
        { id: '10', name: '文档', iconName: 'FileText', color: 'bg-indigo-500', usageCount: 0 },
        { id: '11', name: '天气', iconName: 'Cloud', color: 'bg-sky-500', usageCount: 0 },
        { id: '12', name: '相机', iconName: 'Camera', color: 'bg-zinc-800', usageCount: 0 },
      ],
      setThemeMode: (mode) => set({ themeMode: mode }),
      setAccentColor: (color) => set({ accentColor: color }),
      setGlassOpacity: (opacity) => set({ glassOpacity: opacity }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setLayoutDensity: (density) => set({ layoutDensity: density }),
      setPanelRadius: (radius) => set({ panelRadius: radius }),
      setFontFamily: (font) => set({ fontFamily: font }),
      setEnableAnimations: (enable) => set({ enableAnimations: enable }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      toggleAppLauncher: () => set((state) => ({ isAppLauncherOpen: !state.isAppLauncherOpen })),
      toggleClock: () => set((state) => ({ isClockOpen: !state.isClockOpen })),
      toggleNewsFolded: () => set((state) => ({ isNewsFolded: !state.isNewsFolded })),
      toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
      togglePersonalization: () => set((state) => ({ isPersonalizationOpen: !state.isPersonalizationOpen })),
      addAlarm: (alarm) => set((state) => ({ alarms: [...state.alarms, { ...alarm, id: Date.now().toString() }] })),
      toggleAlarm: (id) => set((state) => ({ alarms: state.alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a) })),
      deleteAlarm: (id) => set((state) => ({ alarms: state.alarms.filter(a => a.id !== id) })),
      addTimer: (timer) => set((state) => ({ timers: [...state.timers, { ...timer, id: Date.now().toString() }] })),
      deleteTimer: (id) => set((state) => ({ timers: state.timers.filter(t => t.id !== id) })),
      incrementAppUsage: (id) => set((state) => ({
        apps: state.apps.map(a => a.id === id
          ? { ...a, usageCount: a.usageCount + 1, lastUsedAt: new Date().toISOString() }
          : a)
      })),
      mergeTodoistTodos: (incoming) => set((state) => {
        const localOnly = state.todos.filter((todo) => todo.source !== 'todoist');
        return { todos: [...incoming, ...localOnly] };
      }),
      linkTodoToTodoist: (id, externalId) => set((state) => ({
        todos: state.todos.map((todo) => todo.id === id
          ? { ...todo, externalId, source: 'todoist' as const }
          : todo)
      })),
      todos: [
        { id: '1', title: '完成项目PRD', quadrant: 1, completed: false, createdAt: new Date().toISOString(), date: format(new Date(), 'yyyy-MM-dd') },
        { id: '2', title: '团队周会', quadrant: 2, completed: false, createdAt: new Date().toISOString(), date: format(new Date(), 'yyyy-MM-dd') },
        { id: '3', title: '回复非紧急邮件', quadrant: 3, completed: false, createdAt: new Date().toISOString(), date: format(new Date(), 'yyyy-MM-dd') },
        { id: '4', title: '看一会儿新闻', quadrant: 4, completed: false, createdAt: new Date().toISOString(), date: format(new Date(), 'yyyy-MM-dd') },
      ],
      workspaceItems: [
        { id: '1', name: '设计草图', type: 'folder', status: 'temp', updatedAt: new Date().toISOString() },
        { id: '2', name: '会议记录', type: 'file', status: 'archived', updatedAt: new Date().toISOString() },
      ],
      addTodo: (todo) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { ...todo, id: Date.now().toString(), createdAt: new Date().toISOString() },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => {
          const todoIndex = state.todos.findIndex(t => t.id === id);
          if (todoIndex === -1) return state;

          const todo = state.todos[todoIndex];
          const isCompleted = !todo.completed;

          // 创建一个新的数组并更新状态
          let newTodos = [...state.todos];
          newTodos[todoIndex] = { ...todo, completed: isCompleted };

          // 自动排序：完成后移到末尾，取消完成则移到当前日期的最前面
          const [toggledTodo] = newTodos.splice(todoIndex, 1);
          if (isCompleted) {
            newTodos.push(toggledTodo);
          } else {
            // 为了保证在当前日期的最前面，我们将其插入到当前日期集合的头部
            // 如果直接 unshift 会跑到所有日期的最前面，其实也是可以的，因为渲染时会 filter
            newTodos.unshift(toggledTodo);
          }

          return {
            todos: newTodos,
            alarms: state.alarms.map((a) =>
              a.id === id ? { ...a, enabled: !isCompleted } : a
            ), // 待办完成时自动关闭对应闹钟，取消完成时开启
          };
        }),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
          alarms: state.alarms.filter((a) => a.id !== id), // 同时删除绑定的闹钟
        })),
      updateTodoTitle: (id, title) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, title } : t
          ),
          alarms: state.alarms.map((a) => 
            a.id === id ? { ...a, label: title || '待办提醒' } : a
          ), // 同步更新闹钟标签
        })),
      updateTodoDetails: (id, title, content) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, title, content } : t
          ),
          alarms: state.alarms.map((a) => 
            a.id === id ? { ...a, label: title || '待办提醒' } : a
          ), // 同步更新闹钟标签
        })),
      updateTodoQuadrant: (id, quadrant) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, quadrant } : t
          ),
        })),
      reorderTodos: (newTodos) =>
        set((state) => {
          // 合并重排后的当前日期待办和其它日期的待办
          const otherTodos = state.todos.filter(t => t.date !== state.selectedDate);
          return { todos: [...otherTodos, ...newTodos] };
        }),
      updateTodoReminder: (id, time) =>
        set((state) => {
          const todo = state.todos.find((t) => t.id === id);
          if (!todo) return state;

          let newAlarms = [...state.alarms];
          
          if (time) {
            // 如果设置了时间，查找是否已有对应的闹钟
            const existingAlarmIndex = newAlarms.findIndex((a) => a.id === id);
            if (existingAlarmIndex >= 0) {
              newAlarms[existingAlarmIndex] = { ...newAlarms[existingAlarmIndex], time, enabled: true };
            } else {
              newAlarms.push({ id, time, label: todo.title || '待办提醒', enabled: true });
            }
          } else {
            // 如果取消了提醒时间，移除对应的闹钟
            newAlarms = newAlarms.filter((a) => a.id !== id);
          }

          return {
            todos: state.todos.map((t) =>
              t.id === id ? { ...t, reminderTime: time } : t
            ),
            alarms: newAlarms,
          };
        }),
      addWorkspaceItem: (item) =>
        set((state) => ({
          workspaceItems: [
            ...state.workspaceItems,
            { ...item, id: Date.now().toString(), updatedAt: new Date().toISOString() },
          ],
        })),
      createShortcut: (targetId) =>
        set((state) => {
          const target = state.workspaceItems.find(i => i.id === targetId);
          if (!target) return state;
          // 防止重复创建快捷方式
          const exists = state.workspaceItems.some(i => i.type === 'shortcut' && i.targetId === targetId && i.status === 'temp');
          if (exists) return state;
          
          return {
            workspaceItems: [
              ...state.workspaceItems,
              { 
                id: Date.now().toString(), 
                name: `${target.name} (快捷方式)`, 
                type: 'shortcut', 
                status: 'temp', 
                targetId: target.id,
                updatedAt: new Date().toISOString() 
              },
            ],
          };
        }),
      archiveItem: (id) =>
        set((state) => ({
          workspaceItems: state.workspaceItems.map((item) =>
            item.id === id ? { ...item, status: 'archived' } : item
          ),
        })),
      unarchiveItem: (id) =>
        set((state) => ({
          workspaceItems: state.workspaceItems.map((item) =>
            item.id === id ? { ...item, status: 'temp' } : item
          ),
        })),
      deleteWorkspaceItem: (id) =>
        set((state) => ({
          workspaceItems: state.workspaceItems.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'dashboard-storage',
    }
  )
);
