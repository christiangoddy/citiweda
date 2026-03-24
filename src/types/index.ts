export interface WeatherCity extends City {
  weather: WeatherInfo;
}

export interface WeatherInfo {
  temperature: number;
  description: string;
  lastUpdated: string;
  visibility: number;
  windSpeed: number;
  feelsLike: number;
  pressure: number;
  humidity: number;
  icon: string;
}

export interface City {
  isFavorite: boolean;
  population: number;
  country: string;
  name: string;
  id: string;
  latitude?: number;
  longitude?: number;
}

export interface Note {
  lastEdited: string;
  content: string;
  cityId: string;
}