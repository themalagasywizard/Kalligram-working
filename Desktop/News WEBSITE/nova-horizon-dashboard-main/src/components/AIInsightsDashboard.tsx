import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Zap,
  Target,
  Activity,
  Eye,
  Lightbulb
} from 'lucide-react';

interface MarketSentiment {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  positiveSignals: number;
  negativeSignals: number;
  neutralSignals: number;
}

interface TrendingTopic {
  topic: string;
  mentions: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  change: number;
}

interface AIRecommendation {
  type: 'watch' | 'alert' | 'opportunity' | 'risk';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
}

interface AIInsightsDashboardProps {
  marketSentiment: MarketSentiment;
  trendingTopics: TrendingTopic[];
  recommendations: AIRecommendation[];
  totalArticlesAnalyzed: number;
}

const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({
  marketSentiment,
  trendingTopics,
  recommendations,
  totalArticlesAnalyzed
}) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
      case 'positive':
        return 'text-green-400';
      case 'bearish':
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
      case 'positive':
        return <TrendingUp className="h-4 w-4" />;
      case 'bearish':
      case 'negative':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'watch':
        return <Eye className="h-4 w-4 text-blue-400" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'opportunity':
        return <Target className="h-4 w-4 text-green-400" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Lightbulb className="h-4 w-4 text-purple-400" />;
    }
  };

  const totalSignals = marketSentiment.positiveSignals + marketSentiment.negativeSignals + marketSentiment.neutralSignals;

  return (
    <div className="space-y-6">
      {/* Market Sentiment Overview */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">AI Market Sentiment</h3>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {totalArticlesAnalyzed} articles analyzed
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={getSentimentColor(marketSentiment.sentiment)}>
                  {getSentimentIcon(marketSentiment.sentiment)}
                </div>
                <span className={`font-semibold text-lg capitalize ${getSentimentColor(marketSentiment.sentiment)}`}>
                  {marketSentiment.sentiment}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{marketSentiment.confidence}%</div>
                <div className="text-xs text-slate-400">Confidence</div>
              </div>
            </div>

            {/* Sentiment Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-400">Positive Signals</span>
                <span className="text-white">{marketSentiment.positiveSignals}</span>
              </div>
              <Progress 
                value={(marketSentiment.positiveSignals / totalSignals) * 100} 
                className="h-2 bg-slate-800"
              />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-400">Neutral Signals</span>
                <span className="text-white">{marketSentiment.neutralSignals}</span>
              </div>
              <Progress 
                value={(marketSentiment.neutralSignals / totalSignals) * 100} 
                className="h-2 bg-slate-800"
              />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-400">Negative Signals</span>
                <span className="text-white">{marketSentiment.negativeSignals}</span>
              </div>
              <Progress 
                value={(marketSentiment.negativeSignals / totalSignals) * 100} 
                className="h-2 bg-slate-800"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Trending Topics */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Trending Topics</h3>
          </div>
          
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className={getSentimentColor(topic.sentiment)}>
                      {getSentimentIcon(topic.sentiment)}
                    </span>
                    <span className="font-medium text-white">#{topic.topic}</span>
                  </div>
                  <Badge className="bg-slate-700/50 text-slate-300 border-slate-600">
                    {topic.mentions} mentions
                  </Badge>
                </div>
                
                <div className={`flex items-center gap-1 text-sm font-medium ${topic.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {topic.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {topic.change >= 0 ? '+' : ''}{topic.change}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
          </div>
          
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-slate-900/30 rounded-lg border-l-4 border-cyan-500/50">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getRecommendationIcon(rec.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{rec.title}</h4>
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{rec.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Timeframe: {rec.timeframe}</span>
                      <span>•</span>
                      <span className="capitalize">{rec.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIInsightsDashboard; 