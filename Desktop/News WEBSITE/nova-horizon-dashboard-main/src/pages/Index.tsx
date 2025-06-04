import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Filter, Bell, Globe, DollarSign, Bitcoin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EnhancedNewsCard from '@/components/EnhancedNewsCard';
import EnhancedMarketWidget from '@/components/EnhancedMarketWidget';
import AIInsightsDashboard from '@/components/AIInsightsDashboard';
import FilterPanel from '@/components/FilterPanel';

const Index = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([]);

  // Enhanced mock data with new fields for enhanced components
  const mockNews = [
    {
      id: 1,
      title: "AI Revolution in Healthcare Reaches New Milestone",
      summary: "Revolutionary AI diagnostic tool achieves 95% accuracy in early cancer detection, potentially saving millions of lives globally.",
      fullContent: "A groundbreaking AI diagnostic system developed by researchers at Stanford University has achieved an unprecedented 95% accuracy rate in early cancer detection. The system, trained on over 1 million medical images, can identify cancerous cells up to 6 months earlier than traditional methods. This breakthrough could revolutionize cancer treatment and save millions of lives worldwide. The technology is currently undergoing clinical trials at major hospitals across the United States and Europe.",
      category: "Technology",
      sentiment: "positive" as const,
      source: "TechCrunch",
      timestamp: "2 minutes ago",
      aiScore: 92,
      tags: ["AI", "Healthcare", "Innovation"],
      readTime: 3,
      views: 15420,
      isBookmarked: bookmarkedArticles.includes(1),
      relatedCount: 12
    },
    {
      id: 2,
      title: "Global Markets Rally on Fed Rate Decision",
      summary: "Major indices surge as Federal Reserve maintains current interest rates, boosting investor confidence across sectors.",
      fullContent: "The Federal Reserve's decision to maintain current interest rates has sparked a significant rally across global markets. The Dow Jones gained 2.3%, S&P 500 rose 1.8%, and NASDAQ climbed 2.1% in today's trading session. Investor confidence has been bolstered by the Fed's commitment to maintaining economic stability while monitoring inflation trends. Analysts predict continued market optimism in the coming weeks.",
      category: "Finance",
      sentiment: "positive" as const,
      source: "Bloomberg",
      timestamp: "5 minutes ago",
      aiScore: 88,
      tags: ["Fed", "Markets", "Economy"],
      readTime: 4,
      views: 23150,
      isBookmarked: bookmarkedArticles.includes(2),
      relatedCount: 18
    },
    {
      id: 3,
      title: "Climate Tech Startup Raises $500M for Carbon Capture",
      summary: "Breakthrough carbon capture technology promises to remove gigatons of CO2 from atmosphere, attracting major investment.",
      fullContent: "ClimateCore Technologies has successfully raised $500 million in Series C funding to scale their revolutionary carbon capture technology. The company's innovative direct air capture systems can remove up to 1,000 tons of CO2 per day at 50% lower cost than existing solutions. Major investors include Microsoft Climate Innovation Fund, Amazon's Climate Pledge Fund, and several leading venture capital firms. The funding will accelerate deployment of 100 new facilities by 2026.",
      category: "Environment",
      sentiment: "positive" as const,
      source: "Reuters",
      timestamp: "12 minutes ago",
      aiScore: 85,
      tags: ["Climate", "Investment", "Technology"],
      readTime: 5,
      views: 8730,
      isBookmarked: bookmarkedArticles.includes(3),
      relatedCount: 9
    }
  ];

  const mockMarketData = {
    stocks: [
      { 
        symbol: "AAPL", 
        price: 185.92, 
        change: +2.34, 
        changePercent: +1.28,
        volume: 52340000,
        marketCap: 2890000000000,
        high24h: 187.25,
        low24h: 183.15,
        alertSet: false
      },
      { 
        symbol: "TSLA", 
        price: 242.68, 
        change: -3.21, 
        changePercent: -1.31,
        volume: 45120000,
        marketCap: 771000000000,
        high24h: 248.90,
        low24h: 241.80,
        alertSet: true
      },
      { 
        symbol: "NVDA", 
        price: 721.34, 
        change: +15.67, 
        changePercent: +2.22,
        volume: 38950000,
        marketCap: 1780000000000,
        high24h: 725.50,
        low24h: 705.20,
        alertSet: false
      },
      { 
        symbol: "MSFT", 
        price: 378.85, 
        change: +4.12, 
        changePercent: +1.10,
        volume: 28760000,
        marketCap: 2810000000000,
        high24h: 380.90,
        low24h: 374.60,
        alertSet: false
      }
    ],
    crypto: [
      { 
        symbol: "BTC", 
        price: 43250.00, 
        change: +1250.00, 
        changePercent: +2.98,
        volume: 28500000000,
        marketCap: 850000000000,
        high24h: 43890.50,
        low24h: 41980.20,
        alertSet: true
      },
      { 
        symbol: "ETH", 
        price: 2580.45, 
        change: -45.67, 
        changePercent: -1.74,
        volume: 15200000000,
        marketCap: 310000000000,
        high24h: 2635.80,
        low24h: 2545.30,
        alertSet: false
      },
      { 
        symbol: "SOL", 
        price: 98.32, 
        change: +5.23, 
        changePercent: +5.62,
        volume: 2890000000,
        marketCap: 43500000000,
        high24h: 99.75,
        low24h: 92.80,
        alertSet: false
      }
    ]
  };

  // Mock AI insights data
  const mockAIInsights = {
    marketSentiment: {
      sentiment: 'bullish' as const,
      confidence: 85,
      positiveSignals: 124,
      negativeSignals: 28,
      neutralSignals: 43
    },
    trendingTopics: [
      {
        topic: "AI Healthcare",
        mentions: 1247,
        sentiment: 'positive' as const,
        change: 15.2
      },
      {
        topic: "Fed Policy",
        mentions: 892,
        sentiment: 'positive' as const,
        change: 8.7
      },
      {
        topic: "Climate Tech",
        mentions: 634,
        sentiment: 'positive' as const,
        change: 12.4
      },
      {
        topic: "Crypto Regulation",
        mentions: 445,
        sentiment: 'neutral' as const,
        change: -2.1
      }
    ],
    recommendations: [
      {
        type: 'opportunity' as const,
        title: "Healthcare AI Sector Momentum",
        description: "Strong positive sentiment and breakthrough announcements suggest continued growth in healthcare AI investments.",
        confidence: 89,
        timeframe: "2-4 weeks"
      },
      {
        type: 'watch' as const,
        title: "Federal Reserve Communications",
        description: "Monitor upcoming Fed speeches for any hints about future rate changes that could impact market direction.",
        confidence: 76,
        timeframe: "1-2 weeks"
      },
      {
        type: 'alert' as const,
        title: "Climate Investment Surge",
        description: "Large-scale climate tech funding rounds indicate potential market shifts in clean energy valuations.",
        confidence: 82,
        timeframe: "3-6 weeks"
      }
    ],
    totalArticlesAnalyzed: 3847
  };

  // Enhanced handlers for new functionality
  const handleBookmark = (articleId: number) => {
    setBookmarkedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleShare = (article: any) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      const shareText = `${article.title}\n\n${article.summary}\n\nRead more: ${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      // You could add a toast notification here
    }
  };

  const handleReadMore = (articleId: number) => {
    // This would typically navigate to a full article page
    console.log(`Opening full article ${articleId}`);
  };

  const handleSetAlert = (symbol: string) => {
    console.log(`Setting price alert for ${symbol}`);
    // This would typically open a price alert modal
  };

  const handleViewDetails = (symbol: string) => {
    console.log(`Viewing details for ${symbol}`);
    // This would typically navigate to a detailed asset page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                AI News Hub
              </h1>
              <p className="text-slate-400">Real-time intelligence for informed decisions</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-400"
                />
              </div>
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                variant="outline"
                className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mb-6 animate-fade-in">
            <FilterPanel 
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main News Feed */}
          <div className="xl:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Globe className="h-6 w-6 text-cyan-400" />
                Latest Intelligence
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live Feed
              </div>
            </div>
            
            <div className="space-y-4">
              {mockNews.map((article, index) => (
                <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <EnhancedNewsCard 
                    article={article}
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                    onReadMore={handleReadMore}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Market Data Sidebar */}
          <div className="space-y-6">
            {/* Stock Market */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Stock Market
                </h3>
                <div className="space-y-3">
                  {mockMarketData.stocks.map((stock) => (
                    <EnhancedMarketWidget 
                      key={stock.symbol} 
                      data={stock} 
                      type="stock"
                      onSetAlert={handleSetAlert}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Cryptocurrency */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Bitcoin className="h-5 w-5 text-orange-400" />
                  Cryptocurrency
                </h3>
                <div className="space-y-3">
                  {mockMarketData.crypto.map((crypto) => (
                    <EnhancedMarketWidget 
                      key={crypto.symbol} 
                      data={crypto} 
                      type="crypto"
                      onSetAlert={handleSetAlert}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Enhanced AI Insights Dashboard */}
            <AIInsightsDashboard
              marketSentiment={mockAIInsights.marketSentiment}
              trendingTopics={mockAIInsights.trendingTopics}
              recommendations={mockAIInsights.recommendations}
              totalArticlesAnalyzed={mockAIInsights.totalArticlesAnalyzed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
