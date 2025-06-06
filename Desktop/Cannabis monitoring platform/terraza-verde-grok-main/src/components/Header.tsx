
import { Bell, Settings, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cannabis-gradient rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Cannabis Monitor</h1>
              <p className="text-sm text-slate-400">Professional Growing Dashboard</p>
            </div>
          </div>
          
          {/* Status & Time */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-slate-400">Barcelona, ES</p>
              <p className="text-lg font-semibold text-cannabis-500">June 02, 2025 - 08:18 PM CEST</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Button variant="outline" size="icon" className="border-slate-700 hover:bg-slate-800">
                <Bell className="h-5 w-5" />
              </Button>
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                3
              </Badge>
            </div>
            
            <Button variant="outline" size="icon" className="border-slate-700 hover:bg-slate-800">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
