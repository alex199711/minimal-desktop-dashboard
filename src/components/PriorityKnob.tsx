import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface PriorityKnobProps {
  quadrant: 1 | 2 | 3 | 4;
  completed: boolean;
  onToggleComplete: () => void;
  onChangePriority: (quadrant: 1 | 2 | 3 | 4) => void;
}

const priorities = [
  { id: 1 as const, dot: 'bg-q1', angle: -45, title: '重要且紧急' }, // Top Right
  { id: 2 as const, dot: 'bg-q2', angle: 45, title: '重要不紧急' },  // Bottom Right
  { id: 3 as const, dot: 'bg-q3', angle: 135, title: '紧急不重要' }, // Bottom Left
  { id: 4 as const, dot: 'bg-q4', angle: -135, title: '不重要不紧急' } // Top Left
];

export function PriorityKnob({ quadrant, completed, onToggleComplete, onChangePriority }: PriorityKnobProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pInfo = priorities.find(p => p.id === quadrant) || priorities[3];

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: 36, height: 36 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 中心的可点击完成区域 */}
      <div
        className={cn(
          "relative w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center transition-colors cursor-pointer bg-card z-20",
          completed ? "border-foreground/10 bg-foreground/10" : "border-foreground/10 hover:border-foreground/10"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete();
        }}
        title="标记完成"
      >
        {completed && <Check className="w-2.5 h-2.5 text-foreground/50" strokeWidth={3} />}
        {!completed && !isHovered && (
          <div className={cn("absolute -right-[6px] -top-[6px] w-[6px] h-[6px] rounded-full shadow-md", pInfo.dot)} />
        )}
      </div>

      {/* 悬停时展开的四个优先级色点 */}
      <AnimatePresence>
        {!completed && isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            {priorities.map((p) => {
              // 计算基于中心的偏移量
              const rad = (p.angle - 90) * (Math.PI / 180);
              const radius = 14; // 距离中心的半径
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              const isSelected = p.id === quadrant;

              return (
                <div
                  key={p.id}
                  className="absolute pointer-events-auto cursor-pointer flex items-center justify-center group"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: x - 8, // 8 是容器一半宽度
                    marginTop: y - 8,
                    width: 16,
                    height: 16,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangePriority(p.id);
                    setIsHovered(false);
                  }}
                  title={p.title}
                >
                  <div 
                    className={cn(
                      "rounded-full transition-all shadow-md group-hover:scale-125",
                      p.dot,
                      isSelected ? "w-2.5 h-2.5" : "w-[6px] h-[6px] opacity-60 group-hover:opacity-100"
                    )}
                  />
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}