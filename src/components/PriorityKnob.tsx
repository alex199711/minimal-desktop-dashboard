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
  { id: 1 as const, dot: 'bg-q1', x: 16, y: -16, corner: '-right-[5px] -top-[5px]', title: '重要且紧急' }, // 右上
  { id: 2 as const, dot: 'bg-q2', x: -16, y: -16, corner: '-left-[5px] -top-[5px]', title: '重要不紧急' },  // 左上
  { id: 3 as const, dot: 'bg-q3', x: 16, y: 16, corner: '-right-[5px] -bottom-[5px]', title: '不重要紧急' }, // 右下
  { id: 4 as const, dot: 'bg-q4', x: -16, y: 16, corner: '-left-[5px] -bottom-[5px]', title: '不紧急不重要' } // 左下
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
          "relative w-[20px] h-[20px] rounded-full border-[1.5px] flex items-center justify-center transition-colors cursor-pointer bg-card z-20",
          completed ? "border-foreground/10 bg-foreground/10" : "border-foreground/10 hover:border-foreground/10"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete();
        }}
        title="标记完成"
      >
        {completed && <Check className="w-3 h-3 text-foreground/50" strokeWidth={3} />}
        {!completed && !isHovered && (
          <div className={cn("absolute w-[7px] h-[7px] rounded-full shadow-md transition-all duration-300", pInfo.corner, pInfo.dot)} />
        )}
      </div>

      {/* 悬停时展开的四个优先级色点 */}
      <AnimatePresence>
        {!completed && isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            {priorities.map((p) => {
              const isSelected = p.id === quadrant;

              return (
                <div
                  key={p.id}
                  className="absolute pointer-events-auto cursor-pointer flex items-center justify-center group"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: p.x - 12, // 12 是宽高的中心点 (24/2)
                    marginTop: p.y - 12,
                    width: 24,
                    height: 24,
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
                      "rounded-full transition-all duration-200 shadow-md group-hover:scale-125",
                      p.dot,
                      isSelected ? "w-4 h-4 shadow-lg scale-110" : "w-3 h-3 opacity-70 group-hover:opacity-100"
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