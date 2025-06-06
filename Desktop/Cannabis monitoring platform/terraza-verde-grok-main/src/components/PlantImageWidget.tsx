import { useState } from "react";
import { Camera, ZoomIn, Calendar, TrendingUp, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PlantImageWidget = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="glass-card cannabis-glow animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Camera className="h-5 w-5 text-cannabis-500" />
            <span>Gorilla Amnesia - Latest Image</span>
          </CardTitle>
          <Badge className="bg-cannabis-600 text-white">
            Week 4-5 | Vegetative
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plant Image Container */}
        <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-cannabis-900/20 to-cannabis-700/20">
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-cannabis-500/20 rounded-full flex items-center justify-center">
                  <Leaf className="h-12 w-12 text-cannabis-500 animate-pulse-green" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Plant Image Placeholder</p>
                  <p className="text-sm text-slate-400">Latest capture: 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Overlay Controls */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button size="sm" variant="secondary" className="bg-black/50 hover:bg-black/70 text-white border-none">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Plant Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Height</p>
            <p className="text-lg font-bold text-cannabis-500">8-10 inches</p>
          </div>
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Age</p>
            <p className="text-lg font-bold text-white">30 days</p>
          </div>
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Health</p>
            <p className="text-lg font-bold text-green-500">Excellent</p>
          </div>
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Next Action</p>
            <p className="text-sm font-semibold text-yellow-500">Water in 2 days</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="bg-cannabis-600 hover:bg-cannabis-700 text-white">
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
          <Button size="sm" variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
            <Calendar className="h-4 w-4 mr-2" />
            View History
          </Button>
          <Button size="sm" variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
            <TrendingUp className="h-4 w-4 mr-2" />
            Growth Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantImageWidget;
