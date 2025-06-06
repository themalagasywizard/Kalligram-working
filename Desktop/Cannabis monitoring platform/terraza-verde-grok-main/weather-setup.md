# Weather Widget API Setup

## Overview
The weather widget has been successfully integrated with the OpenWeatherMap API to display real-time weather data.

## Setup Instructions

### 1. Get Your Free API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to the API Keys section
4. Copy your API key

### 2. Configure Environment Variable
Create a `.env` file in the root directory of your project and add:

```
VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
```

**Note:** Replace `your_actual_api_key_here` with your actual OpenWeatherMap API key.

### 3. Features Implemented

#### Real-time Weather Data
- Current temperature in Celsius
- Weather description
- Humidity percentage
- Wind speed in km/h
- Dynamic weather icons based on conditions

#### Smart Growing Conditions
The widget now provides intelligent growing condition analysis:
- **Light Exposure**: Based on temperature (Excellent > 15°C, Good > 10°C)
- **Outdoor Temperature**: Optimal (18-26°C), Good (12-30°C), Poor (outside range)
- **Humidity**: Optimal (40-70%), Moderate (30-80%), Poor (outside range)

#### Error Handling
- Loading states with spinner
- Error messages for API failures
- Graceful fallbacks

### 4. API Limitations
- Free tier allows 1,000 API calls per day
- Data updates every 10 minutes to conserve API calls
- Default city is set to Barcelona (can be modified in the hook)

### 5. Customization Options

#### Change Default City
Edit `src/hooks/useWeatherData.ts` and modify:
```typescript
const DEFAULT_CITY = 'YourCity';
```

#### Adjust Update Frequency
Modify the `refetchInterval` in the useQuery options:
```typescript
refetchInterval: 10 * 60 * 1000, // 10 minutes in milliseconds
```

### 6. Files Modified
- `src/components/WeatherWidget.tsx` - Updated to use real API data
- `src/hooks/useWeatherData.ts` - New custom hook for weather API
- `src/main.tsx` - Added React Query provider
- `src/vite-env.d.ts` - Added environment variable types

## Troubleshooting

### API Key Issues
- Ensure your API key is valid and active
- Check that the environment variable name matches exactly: `VITE_OPENWEATHER_API_KEY`
- Restart your development server after adding the environment variable

### Rate Limiting
- Free tier has daily limits
- The widget caches data for 10 minutes to reduce API calls
- Consider upgrading your OpenWeatherMap plan for higher limits

### CORS Issues
- OpenWeatherMap API supports CORS for web applications
- If you encounter CORS issues, ensure you're using the correct API endpoint 