import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlarmClock } from 'lucide-react';
import { cn } from '../lib/utils';
import { createPortal } from 'react-dom';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
}

const format2 = (n: number) => n.toString().padStart(2, '0');

export function CustomTimePicker({ value, onChange, className }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'h' | 'm'>('h');
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleOpen = () => {
    // 改为获取整个待办事项容器的坐标，而不是闹钟按钮的坐标
    const container = document.getElementById('todo-list-container');
    if (container) {
      setButtonRect(container.getBoundingClientRect());
    } else if (buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
    setIsOpen(true);
    setMode('h');
  };

  // Initialize state when opened
  useEffect(() => {
    if (isOpen) {
      const h = value ? parseInt(value.split(':')[0], 10) : 12;
      const m = value ? parseInt(value.split(':')[1], 10) : 0;
      setHour(isNaN(h) ? 12 : h);
      setMinute(isNaN(m) ? 0 : m);
      setMode('h');
    }
  }, [isOpen, value]);

  const handleCancel = () => {
    onChange(''); // 传入空字符串，触发上层清空提醒时间
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onChange(`${format2(hour)}:${format2(minute)}`);
    setIsOpen(false);
  };

  const handlePointerEvent = (e: React.PointerEvent | PointerEvent) => {
    if (!dialRef.current) return;
    // 假设 dial 的宽高固定为 180 (reduced from 260)
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const distance = Math.sqrt(x * x + y * y);

    // 外圈设置小时 (> 60)，内圈设置分钟 (< 60)
    if (distance > 60) {
      let h = Math.round(angle / 30);
      if (h === 0) h = 12;
      
      // 当设置外圈时，假设为 0-23 的外圈展示逻辑
      // 此处简化：外圈点击始终映射为 0-23，具体根据当前是否为下午（>11）或简单的 1-12
      // 为了符合单圈操作：外环固定为 1-12
      if (h === 12) h = 0; // 为了符合 24 小时制的顶部 00
      setHour(h);
      setMode('h');
    } else {
      let m = Math.round(angle / 6);
      if (m === 60) m = 0;
      setMinute(m);
      setMode('m');
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handlePointerEvent(e);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging) handlePointerEvent(e);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      handlePointerEvent(e);
      setIsDragging(false);
    }
  };

  // Handle global mouse up to stop dragging if cursor leaves the dial area
  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener('pointerup', handleGlobalUp, { passive: true });
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, []);

  const dialRef = useRef<HTMLDivElement>(null);

  // Calculate pointer position
  const cx = 100; // dial center X
  const cy = 100; // dial center Y
  let pointerAngle = 0;
  let pointerRadius = 75; // outer ring radius

  if (mode === 'h') {
    pointerAngle = (hour % 12) * 30;
    pointerRadius = 75; // 现在小时只在外圈
  } else {
    pointerAngle = minute * 6;
    pointerRadius = 45; // 分钟在内圈
  }

  const pointerX = cx + pointerRadius * Math.cos((pointerAngle - 90) * (Math.PI / 180));
  const pointerY = cy + pointerRadius * Math.sin((pointerAngle - 90) * (Math.PI / 180));

  const renderHours = () => {
    // 外圈显示 12 个小时： 1-12
    const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    
    return hours.map((h, i) => {
      const ang = i * 30;
      const rad = 75;
      const x = cx + rad * Math.cos((ang - 90) * (Math.PI / 180));
      const y = cy + rad * Math.sin((ang - 90) * (Math.PI / 180));
      // 注意：我们虽然显示 1-12，但在 state 中 12 表示 0 点。
      // 所以我们判断是否选中时：当内部 state hour===0 时，匹配外圈的 12
      let displayH = h;
      let isSelected = false;
      if (hour === 0 && h === 12) isSelected = true;
      else if (hour === h) isSelected = true;

      return (
        <div 
          key={`h-${h}`} 
          className={cn("absolute flex items-center justify-center w-8 h-8 -ml-4 -mt-4 rounded-full text-[14px] transition-colors z-10", isSelected ? "text-white" : "text-white/80")} 
          style={{ left: x, top: y }}
        >
          {displayH}
        </div>
      );
    });
  };

  const renderMinutes = () => {
    const mins = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    return mins.map((m) => {
      const ang = m * 6;
      const rad = 45; // 放在内圈
      const x = cx + rad * Math.cos((ang - 90) * (Math.PI / 180));
      const y = cy + rad * Math.sin((ang - 90) * (Math.PI / 180));
      const isSelected = mode === 'm' && minute === m;
      return (
        <div 
          key={`m-${m}`} 
          className={cn("absolute flex items-center justify-center w-6 h-6 -ml-3 -mt-3 rounded-full text-[12px] transition-colors z-10", isSelected ? "text-white" : "text-white/60")} 
          style={{ left: x, top: y }}
        >
          {format2(m)}
        </div>
      );
    });
  };

  const [mountedNode, setMountedNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMountedNode(document.getElementById('todo-list-container') || document.body);
  }, []);

  return (
    <div 
      className={cn("relative", className)}
      ref={containerRef}
    >
      <button 
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          handleOpen();
        }}
        className="flex items-center bg-[#0a84ff]/10 hover:bg-[#0a84ff]/20 border border-[#0a84ff]/20 text-[#0a84ff] rounded-full px-2.5 py-1 transition-colors cursor-pointer"
        title="设置提醒时间"
      >
        <AlarmClock className="w-3.5 h-3.5 mr-1.5" />
        <span className="text-xs font-medium tracking-wider">
          {value || '无提醒'}
        </span>
      </button>

      {/* 悬停时的透明桥接层不再需要，因为我们改为居中显示了 */}

      {mountedNode && createPortal(
        <AnimatePresence>
          {isOpen && buttonRect && (
            <>
              {/* Invisible overlay to close on outside click */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998]"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-45%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-45%" }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              className="fixed bg-[#1c1c1e] rounded-[24px] shadow-2xl pb-5 w-[240px] select-none overflow-hidden z-[9999] border border-white/5"
              style={{
                top: `${buttonRect.top + buttonRect.height / 2}px`,
                left: `${buttonRect.left + buttonRect.width / 2}px`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Display */}
              <div className="bg-black/20 p-4 pt-5 flex justify-center items-baseline gap-2 mb-4">
                <div 
                  className={cn("text-4xl font-light cursor-pointer transition-colors px-3 py-1.5 rounded-xl", mode === 'h' ? "text-white bg-white/10" : "text-white/40 hover:text-white/70")}
                  onClick={() => setMode('h')}
                >
                  {format2(hour)}
                </div>
                <span className="text-3xl font-light text-white/30 mb-1">:</span>
                <div 
                  className={cn("text-4xl font-light cursor-pointer transition-colors px-3 py-1.5 rounded-xl", mode === 'm' ? "text-white bg-white/10" : "text-white/40 hover:text-white/70")}
                  onClick={() => setMode('m')}
                >
                  {format2(minute)}
                </div>
              </div>

              {/* Dial Container */}
              <div 
                ref={dialRef}
                className="relative w-[200px] h-[200px] mx-auto rounded-full bg-black/20 touch-none cursor-pointer"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              >
                {/* SVG Pointer Line & Center Dot & Ring */}
                <svg className="absolute inset-0 pointer-events-none" width="200" height="200">
                  <circle cx="100" cy="100" r="60" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.8" />
                  <line x1="100" y1="100" x2={pointerX} y2={pointerY} stroke="#ef4444" strokeWidth="2" />
                  <circle cx="100" cy="100" r="3" fill="#ef4444" />
                </svg>
                
                {/* Selected Circle Background */}
                <div 
                  className="absolute w-[24px] h-[24px] -ml-[12px] -mt-[12px] bg-[#ef4444] rounded-full pointer-events-none transition-all duration-200 ease-out"
                  style={{ left: pointerX, top: pointerY }}
                />
                
                {/* If minute is not a multiple of 5, add a tiny dot inside the selected circle */}
                {mode === 'm' && minute % 5 !== 0 && (
                  <div 
                    className="absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-white rounded-full pointer-events-none transition-all duration-200"
                    style={{ left: pointerX, top: pointerY }}
                  />
                )}

                {/* Numbers */}
                {renderHours()}
                {renderMinutes()}
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end items-center mt-6 px-5 gap-2">
                <button 
                  className="text-[#ef4444] hover:bg-[#ef4444]/10 px-5 py-2.5 rounded-lg font-medium transition-colors text-sm tracking-widest"
                  onClick={handleCancel}
                >
                  取消
                </button>
                <button 
                  className="text-[#ef4444] hover:bg-[#ef4444]/10 px-5 py-2.5 rounded-lg font-medium transition-colors text-sm tracking-widest"
                  onClick={handleConfirm}
                >
                  确定
                </button>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>,
        mountedNode
      )}
    </div>
  );
}