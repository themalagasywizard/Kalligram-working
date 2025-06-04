
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Brain, Clock, ExternalLink } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
  timestamp: string;
  aiScore: number;
  tags: string[];
}

interface NewsCardProps {
  article: Article;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const getSentimentIcon = () => {
    switch (article.sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <TrendingUp className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getSentimentColor = () => {
    switch (article.sentiment) {
      case 'positive':
        return 'border-l-green-400';
      case 'negative':
        return 'border-l-red-400';
      default:
        return 'border-l-yellow-400';
    }
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 border-l-4 ${getSentimentColor()} group cursor-pointer`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="font-medium text-cyan-400">{article.source}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.timestamp}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-full">
              <Brain className="h-3 w-3 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium">{article.aiScore}</span>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-slate-300 mb-4 leading-relaxed">
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 hover:bg-slate-600/50">
              {article.category}
            </Badge>
            <div className="flex items-center gap-1">
              {getSentimentIcon()}
              <span className="text-xs text-slate-400 capitalize">{article.sentiment}</span>
            </div>
          </div>
          
          <div className="flex gap-1">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-cyan-500/10 text-cyan-300 rounded-full border border-cyan-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
