
import { useState } from "react";
import Header from "@/components/Header";
import PlantImageWidget from "@/components/PlantImageWidget";
import WeatherWidget from "@/components/WeatherWidget";
import AnalysisRecap from "@/components/AnalysisRecap";
import CalendarWidget from "@/components/CalendarWidget";
import GrowingTips from "@/components/GrowingTips";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Plant Image */}
          <div className="lg:col-span-2">
            <PlantImageWidget />
          </div>
          
          {/* Right Column - Weather & Analysis */}
          <div className="space-y-6">
            <WeatherWidget />
            <AnalysisRecap />
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CalendarWidget />
          <GrowingTips />
        </div>
      </main>
    </div>
  );
};

export default Index;
