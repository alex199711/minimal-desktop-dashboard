import { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, Globe, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { AnimatePresence, motion } from 'framer-motion';

// API Configuration
// We use api.rss2json.com to parse public RSS feeds without needing API keys
const NEWS_API_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml';

// For market data, since free APIs without auth (like Yahoo Finance) often have strict CORS blocking in browsers,
// we will fetch crypto indices from Binance's public API as a real-data fallback to demonstrate the chart functionality.
const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","BNBUSDT"]';

interface MarketData {
  symbol: string;
  price: string;
  change: number;
  data: number[];
}

interface NewsData {
  id: string;
  title: string;
  time: string;
  source: string;
  link: string;
}

export function NewsMarket() {
  const { isNewsFolded, toggleNewsFolded } = useStore();
  const [marketIndices, setMarketIndices] = useState<MarketData[]>([]);
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRealData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Real News from WSJ Business RSS via rss2json
      const newsRes = await fetch(NEWS_API_URL);
      const newsData = await newsRes.json();
      if (newsData.status === 'ok') {
        const formattedNews = newsData.items.slice(0, 5).map((item: any, index: number) => {
          // Calculate relative time
          const pubDate = new Date(item.pubDate);
          const now = new Date();
          const diffHours = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60));
          const timeStr = diffHours > 0 ? `${diffHours}小时前` : '刚刚';

          return {
            id: `news-${index}`,
            title: item.title,
            time: timeStr,
            source: 'WSJ Business',
            link: item.link
          };
        });
        setNewsList(formattedNews);
      }

      // 2. Fetch Real Market Data (Using Binance Public API as a reliable, CORS-free source for demonstration)
      const marketRes = await fetch(BINANCE_API_URL);
      const marketData = await marketRes.json();

      const formattedMarket = marketData.map((item: any) => {
        const symbolMap: Record<string, string> = { 'BTCUSDT': 'BTC/USDT', 'ETHUSDT': 'ETH/USDT', 'BNBUSDT': 'BNB/USDT' };
        const basePrice = parseFloat(item.lastPrice);
        const change = parseFloat(item.priceChangePercent);

        // Generate a simple sparkline trend based on 24h change
        const trendData = [
          basePrice * (1 - change / 100),
          basePrice * (1 - (change / 100) * 0.75),
          basePrice * (1 - (change / 100) * 0.5),
          basePrice * (1 - (change / 100) * 0.25),
          basePrice
        ];

        return {
          symbol: symbolMap[item.symbol] || item.symbol,
          price: parseFloat(item.lastPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          change: parseFloat(change.toFixed(2)),
          data: trendData
        };
      });
      setMarketIndices(formattedMarket);

    } catch (error) {
      console.error('Failed to fetch real data:', error);
      // Fallback to mock data if network fails
      setMarketIndices([
        { symbol: 'S&P 500', price: '5,088.80', change: 1.2, data: [4900, 4950, 4920, 5010, 5088] },
        { symbol: 'NASDAQ', price: '15,990.66', change: 1.5, data: [15200, 15400, 15350, 15800, 15990] },
        { symbol: 'SSE', price: '3,021.55', change: -0.4, data: [3100, 3080, 3050, 3030, 3021] },
      ]);
      setNewsList([
        { id: '1', title: '网络连接失败，请检查您的网络设置', time: '刚刚', source: '系统提示', link: '#' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    // Auto refresh every 5 minutes
    const timer = setInterval(fetchRealData, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

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
              {newsList.map(news => (
                <span key={news.id}>• {news.title}</span>
              ))}
              {newsList.map(news => (
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
          {marketIndices.map((idx) => {
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
        <div className="flex flex-col gap-3 relative">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-foreground/40 font-medium uppercase tracking-wider">实时新闻</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                fetchRealData();
              }}
              className={cn("p-1 rounded hover:bg-foreground/10 text-foreground/40 hover:text-foreground transition-colors", isLoading && "animate-spin opacity-50")}
              title="刷新数据"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {newsList.map((news) => (
            <a
              key={news.id}
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer block"
            >
              <h4 className="text-sm text-foreground/80 leading-snug group-hover:text-theme-accent transition-colors line-clamp-2 mb-1">
                {news.title}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-foreground/40">
                <span>{news.source}</span>
                <span className="w-1 h-1 rounded-full bg-foreground/10"></span>
                <span>{news.time}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
