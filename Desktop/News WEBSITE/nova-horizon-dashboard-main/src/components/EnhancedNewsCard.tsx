import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Clock, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck,
  Share2,
  Eye,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';

interface Article {
  id: number;
  title: string;
  summary: string;
  fullContent?: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
  timestamp: string;
  aiScore: number;
  tags: string[];
  readTime: number; // in minutes
  views: number;
  isBookmarked?: boolean;
  relatedCount?: number;
}

interface EnhancedNewsCardProps {
  article: Article;
  onBookmark?: (id: number) => void;
  onShare?: (article: Article) => void;
  onReadMore?: (id: number) => void;
}

const EnhancedNewsCard: React.FC<EnhancedNewsCardProps> = ({ 
  article, 
  onBookmark, 
  onShare, 
  onReadMore 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
        return 'border-l-green-400 shadow-green-400/20';
      case 'negative':
        return 'border-l-red-400 shadow-red-400/20';
      default:
        return 'border-l-yellow-400 shadow-yellow-400/20';
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <Card 
      className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl border-l-4 ${getSentimentColor()} group cursor-pointer relative overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="font-medium text-cyan-400">{article.source}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.timestamp}
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(article.views)}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-full">
              <Brain className="h-3 w-3 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium">{article.aiScore}</span>
            </div>
            <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
              {article.readTime}min read
            </Badge>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors leading-tight">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-slate-300 mb-4 leading-relaxed">
          {article.summary}
        </p>

        {/* Expanded Content */}
        {isExpanded && article.fullContent && (
          <div className="mb-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <p className="text-slate-300 leading-relaxed text-sm">
              {article.fullContent}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Preview
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReadMore?.(article.id)}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Read Full
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBookmark?.(article.id)}
              className={`hover:bg-yellow-400/10 ${article.isBookmarked ? 'text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}
            >
              {article.isBookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(article)}
              className="text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
            {article.relatedCount && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <MessageSquare className="h-3 w-3" />
                {article.relatedCount} related
              </div>
            )}
          </div>
          
          <div className="flex gap-1">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-cyan-500/10 text-cyan-300 rounded-full border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-slate-600/30 text-slate-400 rounded-full">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedNewsCard; 