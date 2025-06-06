import { useQuery } from '@tanstack/react-query';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  city: string;
}

interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key';
const DEFAULT_CITY = 'Barcelona';

const fetchWeatherData = async (city: string = DEFAULT_CITY): Promise<WeatherData> => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  const data: OpenWeatherResponse = await response.json();
  
  return {
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    icon: data.weather[0].icon,
    city: data.name,
  };
};

export const useWeatherData = (city?: string) => {
  return useQuery({
    queryKey: ['weather', city || DEFAULT_CITY],
    queryFn: () => fetchWeatherData(city),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: 3,
  });
};

// Helper function to get growing conditions based on weather
export const getGrowingConditions = (weather: WeatherData) => {
  const { temperature, humidity } = weather;
  
  const lightExposure = temperature > 15 ? 'Excellent' : temperature > 10 ? 'Good' : 'Poor';
  const tempCondition = 
    temperature >= 18 && temperature <= 26 ? 'Optimal' : 
    temperature >= 12 && temperature <= 30 ? 'Good' : 'Poor';
  const humidityCondition = 
    humidity >= 40 && humidity <= 70 ? 'Optimal' : 
    humidity >= 30 && humidity <= 80 ? 'Moderate' : 'Poor';
  
  return {
    lightExposure,
    tempCondition,
    humidityCondition,
  };
};

// Helper function to get weather icon component
export const getWeatherIcon = (iconCode: string) => {
  const iconMap: Record<string, string> = {
    '01d': 'sun', // clear sky day
    '01n': 'moon', // clear sky night
    '02d': 'cloud-sun', // few clouds day
    '02n': 'cloud-moon', // few clouds night
    '03d': 'cloud', // scattered clouds
    '03n': 'cloud',
    '04d': 'clouds', // broken clouds
    '04n': 'clouds',
    '09d': 'cloud-rain', // shower rain
    '09n': 'cloud-rain',
    '10d': 'cloud-rain', // rain day
    '10n': 'cloud-rain', // rain night
    '11d': 'cloud-lightning', // thunderstorm
    '11n': 'cloud-lightning',
    '13d': 'snowflake', // snow
    '13n': 'snowflake',
    '50d': 'cloud-fog', // mist
    '50n': 'cloud-fog',
  };
  
  return iconMap[iconCode] || 'cloud';
}; 