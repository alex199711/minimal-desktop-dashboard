import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, Globe, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { AnimatePresence, motion } from 'framer-motion';

// Mock Data
const mockIndices = [
  { symbol: 'S&P 500', price: '5,088.80', change: 1.2, data: [4900, 4950, 4920, 5010, 5088] },
  { symbol: 'NASDAQ', price: '15,990.66', change: 1.5, data: [15200, 15400, 15350, 15800, 15990] },
  { symbol: 'SSE', price: '3,021.55', change: -0.4, data: [3100, 3080, 3050, 3030, 3021] },
];

const mockNews = [
  { id: 1, title: 'AI models show significant improvement in logical reasoning benchmarks', time: '10 mins ago', source: 'Tech Daily' },
  { id: 2, title: 'Global markets rally as inflation cools down further', time: '1 hour ago', source: 'Financial Times' },
  { id: 3, title: 'New breakthroughs in solid-state battery technology announced', time: '3 hours ago', source: 'Science Weekly' },
];

export function NewsMarket() {
  const { isNewsFolded, toggleNewsFolded } = useStore();

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden w-full">
      <div 
        className="p-4 border-b border-foreground/10 bg-background/10 flex items-center justify-between cursor-pointer hover:bg-background/10 transition-colors"
        onClick={toggleNewsFolded}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-theme-accent" />
          <h2 className="font-display font-medium text-sm text-foreground whitespace-nowrap">宏观资讯与市场</h2>
        </div>
        
        {isNewsFolded ? (
          <div className="flex-1 overflow-hidden ml-4 relative h-5">
            <div className="absolute inset-0 flex animate-marquee whitespace-nowrap items-center gap-8 text-xs text-foreground/70">
              {mockNews.map(news => (
                <span key={news.id}>• {news.title}</span>
              ))}
              {mockNews.map(news => (
                <span key={`clone-${news.id}`}>• {news.title}</span>
              ))}
            </div>
          </div>
        ) : (
          <ChevronUp className="w-4 h-4 text-foreground/50" />
        )}
        
        {isNewsFolded && <ChevronDown className="w-4 h-4 text-foreground/50 ml-2" />}
      </div>

      <AnimatePresence initial={false}>
        {!isNewsFolded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6 overflow-y-auto flex-1 min-h-0"
          >
            <div className="p-4 flex flex-col gap-6">
              {/* Market Indices */}
        <div className="grid grid-cols-3 gap-3">
          {mockIndices.map((idx) => {
            const isPositive = idx.change >= 0;
            return (
              <div key={idx.symbol} className="bg-foreground/10 rounded-xl p-3 border border-foreground/10 hover:bg-foreground/10 transition-colors">
                <div className="text-xs text-foreground/50 mb-1">{idx.symbol}</div>
                <div className="text-sm font-display font-semibold mb-2">{idx.price}</div>
                <div className="h-8 mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={idx.data.map(v => ({ value: v }))}>
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={isPositive ? 'hsl(var(--q4))' : 'hsl(var(--q1))'} 
                        strokeWidth={2} 
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className={cn(
                  "text-xs flex items-center gap-1 font-medium",
                  isPositive ? "text-q4" : "text-q1"
                )}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(idx.change)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* News Feed */}
        <div className="flex flex-col gap-3">
          <div className="text-xs text-foreground/40 font-medium uppercase tracking-wider mb-1">实时新闻</div>
          {mockNews.map((news) => (
            <div key={news.id} className="group cursor-pointer">
              <h4 className="text-sm text-foreground/80 leading-snug group-hover:text-theme-accent transition-colors line-clamp-2 mb-1">
                {news.title}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-foreground/40">
                <span>{news.source}</span>
                <span className="w-1 h-1 rounded-full bg-foreground/10"></span>
                <span>{news.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
