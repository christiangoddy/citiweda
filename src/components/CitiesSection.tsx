'use client';

import { useMainStore } from '@/stores';
import { CityTile } from '@/components';

export const CitiesSection = () => {
  const { weatherData, favorites, cities } = useMainStore();

  const sortedFavorites = [...favorites].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const nonFavoriteCities = cities.filter(
    (city) => !favorites.some((fav) => fav.id === city.id)
  );

  const sortedCities = [...nonFavoriteCities].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  if (sortedFavorites.length > 0 || sortedCities.length > 0) {
    return (
      <section className="flex w-full flex-col gap-6">
        {sortedFavorites.length > 0 && (
          <section className="flex w-full flex-col gap-3">
            <h2 className="font-trap text-xl text-rich-lavender">Favorites</h2>
            <article className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedFavorites.map((city) => (
                <CityTile
                  key={city.id}
                  weather={weatherData[city.id]}
                  city={city}
                  isFave
                />
              ))}
            </article>
          </section>
        )}

        {sortedCities.length > 0 && (
          <section className="flex w-full flex-col gap-3">
            <h2 className="font-trap text-xl text-rich-lavender">All Cities</h2>
            <article className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedCities.map((city) => (
                <CityTile
                  key={city.id}
                  weather={weatherData[city.id]}
                  city={city}
                  isFave={false}
                />
              ))}
            </article>
          </section>
        )}
      </section>
    );
  }

  return (
    <p className="w-full py-20 text-center text-rich-lavender">
      No cities found. Try searching for a city.
    </p>
  );
};