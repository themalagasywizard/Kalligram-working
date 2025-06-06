
import { Brain, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AnalysisRecap = () => {
  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Brain className="h-5 w-5 text-purple-400" />
          <span>AI Analysis (Grok)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Health Score */}
        <div className="text-center p-4 bg-gradient-to-r from-green-600/20 to-cannabis-600/20 rounded-lg border border-green-500/30">
          <p className="text-sm text-slate-400 mb-1">Overall Health Score</p>
          <p className="text-2xl font-bold text-green-500">92/100</p>
          <p className="text-xs text-green-400">Excellent condition</p>
        </div>
        
        {/* Analysis Points */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Pest Status</p>
              <p className="text-xs text-slate-400">No signs of pests detected. Leaves appear healthy with good coloration.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Mold Assessment</p>
              <p className="text-xs text-slate-400">No mold detected. Good air circulation around plant structure.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg">
            <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Growth Recommendation</p>
              <p className="text-xs text-slate-400">Consider LST (Low Stress Training) in the next week to maximize yield.</p>
            </div>
          </div>
        </div>
        
        {/* Last Analysis */}
        <div className="border-t border-slate-700 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Last Analysis</span>
            <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
              2 hours ago
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisRecap;
