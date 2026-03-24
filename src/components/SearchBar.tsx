'use client';

import { useState } from 'react';
import { searchCity } from '@/services/weather-service';
import { useMainStore } from '@/stores';

export const SearchBar = () => {
  const { updateWeatherData, addCity } = useMainStore();

  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError('Please enter a city name');
      return;
    }

    if (!navigator.onLine) {
      setError('No internet connection');
      return;
    }

    try {
      setIsSearching(true);
      setError('');

      const matches = await searchCity(trimmedQuery);

      if (matches.length === 0) {
        setError(`No city found with name "${trimmedQuery}"`);
        return;
      }

      const city = matches[0];

      updateWeatherData(city.id, city.weather);

      addCity({
        id: city.id,
        name: city.name,
        country: city.country,
        population: city.population,
        isFavorite: city.isFavorite,
        latitude: city.latitude,
        longitude: city.longitude
      });

      setQuery('');
    } catch {
      setError('Unable to perform search right now');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <article className="flex flex-col gap-4">
      <form onSubmit={handleSearch} className="relative flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full rounded-lg border border-rich-lavender/30 bg-dark-purple/60 py-3 pl-4 pr-4 text-white backdrop-blur-sm placeholder:text-rich-lavender/50 focus:outline-none focus:ring-2 focus:ring-rich-lavender/50"
        />

        <button
          type="submit"
          disabled={isSearching}
          data-testid="search-button"
          className="rounded-lg bg-rich-lavender px-4 py-3 font-medium text-white transition-opacity disabled:cursor-default disabled:opacity-50"
        >
          {isSearching ? 'Adding...' : 'Add City'}
        </button>
      </form>

      <footer className="min-h-5">
        {error !== '' && <p className="text-sm text-red-400">{error}</p>}
      </footer>
    </article>
  );
};