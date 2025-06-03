import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  BellRing,
  MoreHorizontal,
  LineChart,
  DollarSign,
  Percent
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, ResponsiveContainer } from 'recharts';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  priceHistory?: Array<{ time: string; price: number }>;
  alertSet?: boolean;
  high24h?: number;
  low24h?: number;
}

interface EnhancedMarketWidgetProps {
  data: MarketData;
  type: 'stock' | 'crypto';
  onSetAlert?: (symbol: string) => void;
  onViewDetails?: (symbol: string) => void;
}

const EnhancedMarketWidget: React.FC<EnhancedMarketWidgetProps> = ({ 
  data, 
  type, 
  onSetAlert, 
  onViewDetails 
}) => {
  const [showChart, setShowChart] = useState(false);
  
  const isPositive = data.change >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const bgColor = isPositive ? 'bg-green-400/10' : 'bg-red-400/10';
  const borderColor = isPositive ? 'border-green-400/30' : 'border-red-400/30';

  // Generate mock price history if not provided
  const mockPriceHistory = data.priceHistory || Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: data.price + (Math.random() - 0.5) * data.price * 0.05
  }));

  const formatPrice = (price: number) => {
    if (type === 'crypto' && price < 1) {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatVolume = (volume?: number) => {
    if (!volume) return 'N/A';
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toString();
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group cursor-pointer ${borderColor}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
              <span className="text-sm font-bold text-white">{data.symbol.slice(0, 2)}</span>
            </div>
            <div>
              <div className="font-semibold text-white">{data.symbol}</div>
              <div className="text-xs text-slate-400">
                {type === 'crypto' ? 'Cryptocurrency' : 'Stock'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSetAlert?.(data.symbol)}
              className={`p-1 h-6 w-6 ${data.alertSet ? 'text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}
            >
              {data.alertSet ? <BellRing className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChart(!showChart)}
              className="p-1 h-6 w-6 text-slate-400 hover:text-cyan-400"
            >
              <LineChart className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(data.symbol)}
              className="p-1 h-6 w-6 text-slate-400 hover:text-white"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Price Info */}
        <div className="mb-3">
          <div className="text-2xl font-bold text-white mb-1">
            {formatPrice(data.price)}
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 ${changeColor}`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="text-sm font-medium">
                {formatChange(data.change)}
              </span>
            </div>
            <Badge className={`text-xs ${changeColor} ${bgColor} border-0`}>
              {formatChange(data.changePercent)}%
            </Badge>
          </div>
        </div>

        {/* Chart */}
        {showChart && (
          <div className="mb-3 h-16 bg-slate-900/50 rounded-lg p-2">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={mockPriceHistory}>
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPositive ? "#4ade80" : "#f87171"} 
                  strokeWidth={2}
                  dot={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {data.high24h && (
            <div className="flex items-center justify-between p-2 bg-slate-900/30 rounded">
              <span className="text-slate-400">24h High</span>
              <span className="text-green-400 font-medium">{formatPrice(data.high24h)}</span>
            </div>
          )}
          {data.low24h && (
            <div className="flex items-center justify-between p-2 bg-slate-900/30 rounded">
              <span className="text-slate-400">24h Low</span>
              <span className="text-red-400 font-medium">{formatPrice(data.low24h)}</span>
            </div>
          )}
          {data.volume && (
            <div className="flex items-center justify-between p-2 bg-slate-900/30 rounded">
              <span className="text-slate-400">Volume</span>
              <span className="text-white font-medium">{formatVolume(data.volume)}</span>
            </div>
          )}
          {data.marketCap && (
            <div className="flex items-center justify-between p-2 bg-slate-900/30 rounded">
              <span className="text-slate-400">Market Cap</span>
              <span className="text-white font-medium">{formatVolume(data.marketCap)}</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50 text-xs"
          >
            <DollarSign className="h-3 w-3 mr-1" />
            Buy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50 text-xs"
          >
            <Percent className="h-3 w-3 mr-1" />
            Track
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedMarketWidget; 