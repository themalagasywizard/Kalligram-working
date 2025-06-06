import { Cloud, Droplets, Thermometer, Wind, Sun, CloudRain, CloudLightning, Snowflake, Moon, CloudSun, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeatherData, getGrowingConditions, getWeatherIcon } from "@/hooks/useWeatherData";

const WeatherWidget = () => {
  const { data: weather, isLoading, error } = useWeatherData();

  // Icon mapping
  const getIconComponent = (iconType: string) => {
    const iconProps = { className: "h-8 w-8" };
    
    switch (iconType) {
      case 'sun': return <Sun {...iconProps} className="h-8 w-8 text-yellow-500" />;
      case 'moon': return <Moon {...iconProps} className="h-8 w-8 text-blue-300" />;
      case 'cloud-sun': return <CloudSun {...iconProps} className="h-8 w-8 text-yellow-400" />;
      case 'cloud': return <Cloud {...iconProps} className="h-8 w-8 text-gray-400" />;
      case 'cloud-rain': return <CloudRain {...iconProps} className="h-8 w-8 text-blue-500" />;
      case 'cloud-lightning': return <CloudLightning {...iconProps} className="h-8 w-8 text-purple-500" />;
      case 'snowflake': return <Snowflake {...iconProps} className="h-8 w-8 text-blue-200" />;
      default: return <Cloud {...iconProps} className="h-8 w-8 text-gray-400" />;
    }
  };

  // Get condition colors
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Optimal': return 'text-green-500';
      case 'Good': return 'text-yellow-500';
      case 'Moderate': return 'text-yellow-500';
      case 'Poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Cloud className="h-5 w-5 text-blue-400" />
            <span>Weather</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Cloud className="h-5 w-5 text-blue-400" />
            <span>Weather</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-400 text-sm">Unable to load weather data</p>
          <p className="text-slate-500 text-xs mt-1">Please check your API key</p>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  const conditions = getGrowingConditions(weather);
  const weatherIcon = getWeatherIcon(weather.icon);

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Cloud className="h-5 w-5 text-blue-400" />
          <span>{weather.city} Weather</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            {getIconComponent(weatherIcon)}
            <span className="text-3xl font-bold text-white">{weather.temperature}°C</span>
          </div>
          <p className="text-slate-400 capitalize">{weather.description}</p>
        </div>
        
        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 p-2 bg-slate-800/50 rounded">
            <Droplets className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-xs text-slate-400">Humidity</p>
              <p className="text-sm font-semibold text-white">{weather.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-2 bg-slate-800/50 rounded">
            <Wind className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-slate-400">Wind</p>
              <p className="text-sm font-semibold text-white">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
        
        {/* Growth Conditions */}
        <div className="border-t border-slate-700 pt-3">
          <p className="text-sm font-semibold text-white mb-2">Growing Conditions</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Light Exposure</span>
              <span className={`font-semibold ${getConditionColor(conditions.lightExposure)}`}>
                {conditions.lightExposure}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Outdoor Temp</span>
              <span className={`font-semibold ${getConditionColor(conditions.tempCondition)}`}>
                {conditions.tempCondition}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Humidity</span>
              <span className={`font-semibold ${getConditionColor(conditions.humidityCondition)}`}>
                {conditions.humidityCondition}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
