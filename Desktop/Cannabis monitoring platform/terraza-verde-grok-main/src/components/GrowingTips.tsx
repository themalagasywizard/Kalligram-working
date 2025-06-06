
import { Lightbulb, Droplets, Scissors, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GrowingTips = () => {
  const tips = [
    {
      icon: Droplets,
      title: "Watering Schedule",
      description: "Water every 2-3 days. Check soil moisture 1-2 inches deep. Allow slight drying between waterings.",
      priority: "high",
      color: "blue-400"
    },
    {
      icon: Sun,
      title: "Light Exposure",
      description: "Ensure 18+ hours of light daily. Move plant for optimal sun exposure on your Barcelona terrace.",
      priority: "medium",
      color: "yellow-400"
    },
    {
      icon: Scissors,
      title: "Training Opportunity",
      description: "Perfect time for LST (Low Stress Training). Gently bend branches to create an even canopy.",
      priority: "medium",
      color: "green-400"
    },
    {
      icon: Lightbulb,
      title: "Nutrient Boost",
      description: "Consider nitrogen-rich nutrients during vegetative stage. Feed every other watering.",
      priority: "low",
      color: "purple-400"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-600/20 text-red-400 border-red-500";
      case "medium": return "bg-yellow-600/20 text-yellow-400 border-yellow-500";
      default: return "bg-slate-600/20 text-slate-400 border-slate-500";
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            <span>Growing Tips</span>
          </CardTitle>
          <Badge className="bg-cannabis-600 text-white">
            Vegetative Stage
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stage Info */}
        <div className="p-3 bg-cannabis-600/20 rounded-lg border border-cannabis-500/30">
          <p className="text-sm font-semibold text-cannabis-300 mb-1">Current Stage: Vegetative (Week 4-5)</p>
          <p className="text-xs text-slate-400">Focus on healthy root development and node formation. Plant should be 6-12 inches tall.</p>
        </div>
        
        {/* Tips List */}
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors">
              <div className="flex-shrink-0">
                <tip.icon className={`h-5 w-5 text-${tip.color} mt-0.5`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-white">{tip.title}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getPriorityColor(tip.priority)}`}
                  >
                    {tip.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Stats */}
        <div className="border-t border-slate-700 pt-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-slate-400">Days in Veg</p>
              <p className="text-sm font-bold text-cannabis-500">30</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Target Height</p>
              <p className="text-sm font-bold text-white">12-18"</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Nodes</p>
              <p className="text-sm font-bold text-green-500">6-8</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowingTips;
