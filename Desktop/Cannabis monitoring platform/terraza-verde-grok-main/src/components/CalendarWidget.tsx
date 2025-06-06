
import { useState } from "react";
import { Calendar, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

const CalendarWidget = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data for report days
  const reportDays = [
    new Date(2025, 5, 1),
    new Date(2025, 5, 5),
    new Date(2025, 5, 10),
    new Date(2025, 5, 15),
    new Date(2025, 5, 20),
    new Date(2025, 5, 25),
  ];

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Calendar className="h-5 w-5 text-blue-400" />
          <span>Historical Reports</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border border-slate-700 bg-slate-800/30 p-3 pointer-events-auto"
          modifiers={{
            hasReport: reportDays,
          }}
          modifiersStyles={{
            hasReport: {
              backgroundColor: 'rgb(16 185 129 / 0.3)',
              color: 'white',
              fontWeight: 'bold',
            },
          }}
        />
        
        {/* Recent Reports */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Recent Reports</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-cannabis-500" />
                <span className="text-sm text-white">May 30, 2025</span>
              </div>
              <Badge variant="outline" className="text-xs border-green-600 text-green-400">
                Health: 89
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-cannabis-500" />
                <span className="text-sm text-white">May 25, 2025</span>
              </div>
              <Badge variant="outline" className="text-xs border-green-600 text-green-400">
                Health: 91
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white">Growth Report</span>
              </div>
              <Badge variant="outline" className="text-xs border-blue-600 text-blue-400">
                Weekly
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
