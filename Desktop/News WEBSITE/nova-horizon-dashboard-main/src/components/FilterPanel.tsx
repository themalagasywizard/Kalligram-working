
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface FilterPanelProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ selectedFilter, onFilterChange }) => {
  const categories = [
    { id: 'all', label: 'All News', color: 'bg-slate-600' },
    { id: 'technology', label: 'Technology', color: 'bg-blue-600' },
    { id: 'finance', label: 'Finance', color: 'bg-green-600' },
    { id: 'environment', label: 'Environment', color: 'bg-emerald-600' },
    { id: 'healthcare', label: 'Healthcare', color: 'bg-purple-600' },
    { id: 'politics', label: 'Politics', color: 'bg-red-600' }
  ];

  const sentiments = [
    { id: 'positive', label: 'Positive', color: 'text-green-400' },
    { id: 'negative', label: 'Negative', color: 'text-red-400' },
    { id: 'neutral', label: 'Neutral', color: 'text-yellow-400' }
  ];

  const timeframes = [
    { id: 'hour', label: 'Last Hour' },
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories */}
          <div>
            <h4 className="text-white font-medium mb-3">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedFilter === category.id ? "default" : "secondary"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedFilter === category.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  onClick={() => onFilterChange(category.id)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sentiment */}
          <div>
            <h4 className="text-white font-medium mb-3">Sentiment</h4>
            <div className="flex flex-wrap gap-2">
              {sentiments.map((sentiment) => (
                <Badge
                  key={sentiment.id}
                  variant="secondary"
                  className={`cursor-pointer transition-all hover:scale-105 bg-slate-700 hover:bg-slate-600 ${sentiment.color}`}
                >
                  {sentiment.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Time */}
          <div>
            <h4 className="text-white font-medium mb-3">Timeframe</h4>
            <div className="flex flex-wrap gap-2">
              {timeframes.map((timeframe) => (
                <Badge
                  key={timeframe.id}
                  variant="secondary"
                  className="cursor-pointer transition-all hover:scale-105 bg-slate-700 text-slate-300 hover:bg-slate-600"
                >
                  {timeframe.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FilterPanel;
