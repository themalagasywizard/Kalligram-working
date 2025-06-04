
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketWidgetProps {
  data: MarketData;
  type: 'stock' | 'crypto';
}

const MarketWidget: React.FC<MarketWidgetProps> = ({ data, type }) => {
  const isPositive = data.change > 0;
  const formatPrice = (price: number) => {
    if (type === 'crypto') {
      return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group">
      <div>
        <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
          {data.symbol}
        </div>
        <div className="text-sm text-slate-400">
          {formatPrice(data.price)}
        </div>
      </div>
      
      <div className="text-right">
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
        </div>
        <div className={`text-xs ${
          isPositive ? 'text-green-300' : 'text-red-300'
        }`}>
          {data.change > 0 ? '+' : ''}${data.change.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default MarketWidget;
