'use client';

import Link from 'next/link';

import { WeatherInfo, City } from '@/types';
import { useMainStore } from '@/stores';
import { cls } from '@/utils';

interface TileProps {
  weather?: WeatherInfo;
  isFave: boolean;
  city: City;
}

export const CityTile = ({ weather, isFave, city }: TileProps) => {
  const { removeFromFavorites, addToFavorites, removeCity, currentCityId } =
    useMainStore();

  const isCurrentLocation = currentCityId === city.id;

  const handleFavoriteToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (city.isFavorite) {
      removeFromFavorites(city.id);
    } else {
      addToFavorites(city);
    }
  };

  const handleCityRemoval = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (isFave) {
      removeFromFavorites(city.id);
    } else if (
      window.confirm(`Are you sure you want to remove ${city.name}?`)
    ) {
      removeCity(city.id);
    }
  };

  const isWeatherAvailable = weather !== undefined;

  return (
    <Link
      href={`/city/${city.id}`}
      className={cls(
        'group relative flex max-w-full flex-col gap-4 rounded-lg border bg-dark-purple/60 p-4 pr-12 shadow backdrop-blur-sm transition-all hover:shadow-md',
        isCurrentLocation
          ? 'border-blue-400/70 ring-1 ring-blue-400/40'
          : 'border-rich-lavender/30'
      )}
    >
      <button
        title={isFave ? 'Remove from favorites' : 'Remove city'}
        onClick={handleCityRemoval}
        data-testid="remove-button"
        className="absolute right-2 top-4 rounded-full bg-[#261C30] p-1.5 text-white transition-all hover:bg-[#221C30] group-hover:opacity-100 xl:opacity-0"
      >
        <svg
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          className="h-5 w-5"
        >
          <path
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <section className="flex items-start justify-between gap-4">
        <section className="flex flex-col">
          <article className="flex flex-wrap items-center gap-2">
            <h3 className="font-trap text-xl text-white">{city.name}</h3>

            {isCurrentLocation && (
              <span className="rounded-md bg-blue-500 px-2 py-1 text-[10px] font-medium text-white sm:text-xs">
                📍 My Location
              </span>
            )}

            {!isFave && (
              <button
                onClick={handleFavoriteToggle}
                data-testid="favorite-button"
                className={cls(
                  'rounded-full bg-dark-purple/10 p-1.5',
                  'transition-colors hover:bg-dark-purple',
                  city.isFavorite ? 'text-yellow-400' : 'text-white'
                )}
                title={
                  city.isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <svg
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  className="h-5 w-5"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            )}
          </article>

          <p className="text-sm text-rich-lavender/80">{city.country}</p>
        </section>

        <section className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            {isWeatherAvailable && (
              <span className="text-xl">{weather.icon}</span>
            )}

            <p className="min-h-8 font-tactic-sans-ext text-2xl font-bold text-white">
              {isWeatherAvailable ? <span>{weather.temperature}°C</span> : <span></span>}
            </p>
          </div>

          <p className="text-right text-sm text-rich-lavender/80">
            {!isWeatherAvailable ? (
              <span data-testid="loading-message">Loading...</span>
            ) : (
              <span>{weather.description}</span>
            )}
          </p>
        </section>
      </section>

      {isWeatherAvailable && (
        <section className="grid grid-cols-2 gap-2 text-xs text-rich-lavender/90 sm:grid-cols-3">
          <div className="rounded-md bg-black/20 px-2 py-2">
            <span className="block text-rich-lavender/60">Feels like</span>
            <span>{weather.feelsLike}°C</span>
          </div>

          <div className="rounded-md bg-black/20 px-2 py-2">
            <span className="block text-rich-lavender/60">Humidity</span>
            <span>{weather.humidity}%</span>
          </div>

          <div className="rounded-md bg-black/20 px-2 py-2">
            <span className="block text-rich-lavender/60">Wind</span>
            <span>{weather.windSpeed} km/h</span>
          </div>

          <div className="rounded-md bg-black/20 px-2 py-2">
            <span className="block text-rich-lavender/60">Pressure</span>
            <span>{weather.pressure} hPa</span>
          </div>

          <div className="rounded-md bg-black/20 px-2 py-2">
            <span className="block text-rich-lavender/60">Visibility</span>
            <span>{weather.visibility} km</span>
          </div>

          <div className="rounded-md bg-black/20 px-2 py-2">
  <span className="block text-rich-lavender/60">Updated</span>
  <span>
    {new Date(weather.lastUpdated).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}
  </span>
</div>
        </section>
      )}
    </Link>
  );
};