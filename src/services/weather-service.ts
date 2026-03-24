import { WeatherInfo, WeatherCity } from '@/types';

type OpenMeteoGeocodeResult = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  population?: number;
};

type OpenMeteoGeocodeResponse = {
  results?: OpenMeteoGeocodeResult[];
};

type OpenMeteoWeatherResponse = {
  current?: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    pressure_msl: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
  hourly?: {
    visibility?: number[];
  };
};

const getWeatherDescription = (code?: number) => {
  const map: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };

  return map[code ?? -1] ?? 'Unknown';
};

const getWeatherIcon = (code?: number, isDay?: number) => {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if ([1, 2].includes(code ?? -1)) return '⛅';
  if (code === 3) return '☁️';
  if ([45, 48].includes(code ?? -1)) return '🌫️';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code ?? -1)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) return '❄️';
  if ([95, 96, 99].includes(code ?? -1)) return '⛈️';

  return '🌤️';
};

const parseWeatherData = (data: OpenMeteoWeatherResponse): WeatherInfo => {
  const current = data.current;

  return {
    temperature: current?.temperature_2m ?? 0,
    description: getWeatherDescription(current?.weather_code),
    lastUpdated: new Date().toISOString(),
    visibility: data.hourly?.visibility?.[0]
      ? Math.round(data.hourly.visibility[0] / 1000)
      : 0,
    windSpeed: current?.wind_speed_10m ?? 0,
    feelsLike: current?.apparent_temperature ?? 0,
    pressure: current?.pressure_msl ?? 0,
    humidity: current?.relative_humidity_2m ?? 0,
    icon: getWeatherIcon(current?.weather_code, current?.is_day)
  };
};

export const getWeatherInfo = async (
  latitude: number,
  longitude: number
): Promise<WeatherInfo> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,pressure_msl,wind_speed_10m,weather_code,is_day&hourly=visibility&timezone=auto`
    );

    if (!response.ok) {
      throw new Error(`Weather request failed with status ${response.status}`);
    }

    const data: OpenMeteoWeatherResponse = await response.json();

    if (!data.current) {
      throw new Error('Weather data unavailable');
    }

    return parseWeatherData(data);
  } catch (error) {
    console.error('Open-Meteo fetch error:', error);
    throw new Error(
      'Unable to fetch weather info. Check your internet or API access.'
    );
  }
};

export const searchCity = async (query: string): Promise<WeatherCity[]> => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) return [];

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmedQuery
    )}&count=10&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error('Unable to search city');
  }

  const data: OpenMeteoGeocodeResponse = await response.json();

  if (!data.results || data.results.length === 0) {
    return [];
  }

  const cities = await Promise.all(
    data.results.map(async (location) => {
      const weather = await getWeatherInfo(location.latitude, location.longitude);

      return {
        id: `${location.name}-${location.country}`
          .replace(/\s+/g, '-')
          .toLowerCase(),
        name: location.name,
        country: location.country,
        population: location.population ?? 0,
        isFavorite: false,
        latitude: location.latitude,
        longitude: location.longitude,
        weather
      };
    })
  );

  return cities;
};

export const getLocationName = async (
  latitude: number,
  longitude: number
): Promise<{ city: string; country: string }> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error('Unable to reverse geocode location');
    }

    const data = await response.json();
    const address = data?.address ?? {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.county ||
      'Current Location';

    const country = address.country || 'Your Area';

    return { city, country };
  } catch (error) {
    console.error('Reverse geocoding failed:', error);

    return {
      city: 'Current Location',
      country: 'Your Area'
    };
  }
};