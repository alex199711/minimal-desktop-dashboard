# 极简桌面看板 (Minimal Desktop Dashboard)

基于 Electron + React 构建的极简拟物化桌面数据看板，追求高级且沉浸的交互体验。

## ✨ 核心特性

- **锤子便签级交互**：沉浸式的全屏编辑模式，支持无感化交互（鼠标移出自动折叠/保存）。
- **极简时间轮盘**：独创的单表盘双环交互（外环小时，内环分钟），丝滑的阻尼动画体验。
- **全自由布局系统**：基于 `react-resizable-panels` 的全量自由调整能力，完美适配多种屏幕。
- **动态毛玻璃主题**：支持 Windows 11 Mica 材质与深浅色模式，并支持通过自定义色彩变量改变全局 Accent Color。
- **系统级深度集成**：
  - `Alt + Space` 全局快捷键呼出/隐藏。
  - 直接挂载电脑系统设置与底层常用应用程序（如系统资源管理器、系统时钟等）。
  - 支持系统托盘驻留。

## 🛠️ 技术栈

- **桌面框架**: Electron, Vite
- **前端框架**: React 18, Zustand
- **样式与动画**: Tailwind CSS, Framer Motion
- **图标与组件**: Lucide React

## 🚀 本地运行与开发

确保您的电脑上已安装了 [Node.js](https://nodejs.org/)。

```bash
# 1. 克隆仓库
git clone https://github.com/您的用户名/minimal-desktop-dashboard.git
cd minimal-desktop-dashboard

# 2. 安装依赖
npm install

# 3. 启动本地开发服务 (支持热更新)
npm run dev
```

## 📦 打包与构建

如果您希望将程序打包为可执行文件 (`.exe`)：

```bash
# 打包出免安装的可运行文件夹 (位于 release/win-unpacked)
npm run pack

# 构建 Windows 安装程序包 (位于 release 目录)
npm run dist
```

## 📄 许可证 (License)

本项目基于 [MIT License](./LICENSE) 开源。欢迎大家使用、修改和提出宝贵建议！