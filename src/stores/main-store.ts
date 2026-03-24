import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getWeatherInfo, getLocationName } from '@/services/weather-service';
import { WeatherInfo, City, Note } from '@/types';
import { largestCities } from '@/constants';

interface StoreState {
  weatherData: Record<string, WeatherInfo>;
  isPermissionDenied: boolean;
  currentCityId: string;
  favorites: City[];
  cities: City[];
  notes: Note[];
}

interface StoreAction {
  updateWeatherData: (cityId: string, data: WeatherInfo) => void;
  removeFromFavorites: (cityId: string) => void;
  fetchCurrentCity: () => Promise<void>;
  fetchWeatherData: () => Promise<void>;
  addToFavorites: (data: City) => void;
  removeCity: (cityId: string) => void;
  deleteNote: (cityId: string) => void;
  saveNote: (data: Note) => void;
  addCity: (data: City) => void;
}

const storeDefaults: StoreState = {
  cities: largestCities.map((city) => ({ ...city, isFavorite: false })),
  isPermissionDenied: false,
  currentCityId: '',
  weatherData: {},
  favorites: [],
  notes: []
};

export const useMainStore = create<StoreState & StoreAction>()(
  persist(
    (setState, getState) => ({
     fetchCurrentCity: async () => {
  const { updateWeatherData, currentCityId, addCity, removeCity, cities } = getState();

  setState({ isPermissionDenied: false });

  if (navigator.geolocation === undefined) {
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async ({ coords: { latitude, longitude } }) => {
      try {
        const weather = await getWeatherInfo(latitude, longitude);
        const location = await getLocationName(latitude, longitude);

        const id = `current-location-${latitude}-${longitude}`;
        const name = location.city;
        const country = location.country;

        const oldCurrentLocationCity = cities.find((city) =>
          city.id.startsWith('current-location-')
        );

        if (oldCurrentLocationCity && oldCurrentLocationCity.id !== id) {
          removeCity(oldCurrentLocationCity.id);
        }

        addCity({
          id,
          name,
          country,
          population: 0,
          isFavorite: false,
          latitude,
          longitude
        });

        setState({
          currentCityId: id,
          isPermissionDenied: false
        });

        updateWeatherData(id, weather);
      } catch (error) {
        console.error('Failed to fetch current location weather:', error);
      }
    },
    (error) => {
      console.error('Geolocation error:', error);

      if (error.code === 1) {
        setState({ isPermissionDenied: true });
      } else {
        setState({ isPermissionDenied: false });
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
},
      fetchWeatherData: async () => {
        const { updateWeatherData, weatherData, favorites, cities } =
          getState();

        const allCities = [...favorites, ...cities];

        const uniqueCities = allCities.filter(
          (city, index, arr) =>
            arr.findIndex((item) => item.id === city.id) === index
        );

        const dueCities = uniqueCities.filter((city) => {
          const weather = weatherData[city.id];

          if (weather === undefined) return true;

          const minutesSinceLastUpdate =
            (new Date().getTime() - new Date(weather.lastUpdated).getTime()) /
            (60 * 1000);

          return minutesSinceLastUpdate >= 30;
        });

        for (const city of dueCities) {
          if (city.latitude !== undefined && city.longitude !== undefined) {
            try {
              const info = await getWeatherInfo(city.latitude, city.longitude);
              updateWeatherData(city.id, info);
            } catch (error) {
              console.error(`Failed to fetch weather for ${city.name}`, error);
            }
          }
        }
      },

      updateWeatherData: (cityId, data) => {
        setState(({ weatherData }) => ({
          weatherData: { ...weatherData, [cityId]: data }
        }));
      },

      removeFromFavorites: (cityId) => {
        setState(({ favorites, cities }) => {
          const updatedFavorites = favorites.filter(
            (item) => item.id !== cityId
          );

          const updatedCities = cities.map((item) =>
            item.id === cityId ? { ...item, isFavorite: false } : item
          );

          return { favorites: updatedFavorites, cities: updatedCities };
        });
      },

      addToFavorites: (data) => {
        setState(({ favorites, cities }) => {
          const alreadyFavorite = favorites.some((item) => item.id === data.id);

          const updatedFavorites = alreadyFavorite
            ? favorites
            : [...favorites, { ...data, isFavorite: true }];

          const updatedCities = cities.map((item) =>
            item.id === data.id ? { ...item, isFavorite: true } : item
          );

          return { favorites: updatedFavorites, cities: updatedCities };
        });
      },

      removeCity: (cityId) => {
        setState(({ weatherData, favorites, cities }) => ({
          cities: cities.filter((item) => item.id !== cityId),
          favorites: favorites.filter((item) => item.id !== cityId),
          weatherData: Object.fromEntries(
            Object.entries(weatherData).filter(([key]) => key !== cityId)
          )
        }));
      },

      deleteNote: (cityId) => {
        setState(({ notes }) => ({
          notes: notes.filter((note) => note.cityId !== cityId)
        }));
      },

      saveNote: (data) => {
        setState(({ notes }) => {
          const noteIndex = notes.findIndex(
            (item) => item.cityId === data.cityId
          );

          const updatedNotes = [...notes];

          if (noteIndex !== -1) {
            updatedNotes[noteIndex] = data;
          } else {
            updatedNotes.push(data);
          }

          return { notes: updatedNotes };
        });
      },

      addCity: (data) => {
        setState(({ cities, favorites }) => {
          const cityExists =
            cities.some(({ id }) => id === data.id) ||
            favorites.some(({ id }) => id === data.id);

          if (cityExists) return {};

          return { cities: [...cities, data] };
        });
      },

      ...storeDefaults
    }),
    {
      name: 'main-store',
      merge: (persistedState, currentState) => {
        const typedPersistedState =
          persistedState as Partial<StoreState & StoreAction>;

        const persistedCities = typedPersistedState?.cities ?? [];
        const persistedFavorites = typedPersistedState?.favorites ?? [];

        const mergedCities = persistedCities.map((city) => {
          const matchedDefaultCity = largestCities.find(
            (defaultCity) => defaultCity.id === city.id
          );

          return matchedDefaultCity
            ? {
                ...matchedDefaultCity,
                ...city,
                latitude: city.latitude ?? matchedDefaultCity.latitude,
                longitude: city.longitude ?? matchedDefaultCity.longitude
              }
            : city;
        });

        const mergedFavorites = persistedFavorites.map((city) => {
          const matchedDefaultCity = largestCities.find(
            (defaultCity) => defaultCity.id === city.id
          );

          return matchedDefaultCity
            ? {
                ...matchedDefaultCity,
                ...city,
                latitude: city.latitude ?? matchedDefaultCity.latitude,
                longitude: city.longitude ?? matchedDefaultCity.longitude
              }
            : city;
        });

        return {
          ...currentState,
          ...typedPersistedState,
          cities: mergedCities,
          favorites: mergedFavorites
        };
      }
    }
  )
);