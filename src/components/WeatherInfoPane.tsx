'use client';

import { WeatherCity } from '@/types';

interface PaneProps {
  data: WeatherCity;
}

export const WeatherInfoPane = ({
  data: { country, weather, name: city }
}: PaneProps) => {
  return (
    <section className="w-full rounded-lg border border-rich-lavender/30 bg-dark-purple/60 p-4 backdrop-blur-sm">
      <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <section>
          <h2 className="mb-1 font-trap text-2xl text-white">
            Current Weather in {city}, {country}
          </h2>
          <p className="text-rich-lavender/80">
            <span>Last updated on</span>&nbsp;
            {new Date(weather.lastUpdated).toLocaleString('en-US', {
              minute: '2-digit',
              weekday: 'long',
              hour: '2-digit',
              day: 'numeric',
              month: 'long'
            })}
          </p>
        </section>

        <section className="flex items-center rounded-lg bg-ocean-blue/30 p-3">
          {weather.icon && (
            <article className="mr-3 flex h-12 w-12 items-center justify-center rounded-md bg-black/20 text-3xl">
              <span>{weather.icon}</span>
            </article>
          )}

          <article>
            <p className="font-tactic-sans-ext text-3xl font-bold text-white">
              {weather.temperature}°C
            </p>
            <p className="text-rich-lavender/80">{weather.description}</p>
          </article>
        </section>
      </section>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <li className="rounded-lg bg-vampire-black/40 p-4">
          <h3 className="mb-3 font-trap text-lg text-rich-lavender">
            Temperature
          </h3>
          <section className="grid grid-cols-2 gap-4">
            <article>
              <p className="text-sm text-rich-lavender/70">Actual</p>
              <p className="text-xl font-bold text-white">
                {weather.temperature}°C
              </p>
            </article>
            <article>
              <p className="text-sm text-rich-lavender/70">Feels Like</p>
              <p className="text-xl font-bold text-white">
                {weather.feelsLike}°C
              </p>
            </article>
          </section>
        </li>

        <li className="rounded-lg bg-vampire-black/40 p-4">
          <h3 className="mb-3 font-trap text-lg text-rich-lavender">Wind</h3>
          <section className="grid grid-cols-1 gap-4">
            <article>
              <p className="text-sm text-rich-lavender/70">Speed</p>
              <p className="text-xl font-bold text-white">
                {weather.windSpeed} km/h
              </p>
            </article>
          </section>
        </li>

        <li className="rounded-lg bg-vampire-black/40 p-4">
          <h3 className="mb-3 font-trap text-lg text-rich-lavender">
            Humidity & Pressure
          </h3>
          <section className="grid grid-cols-2 gap-4">
            <article>
              <p className="text-sm text-rich-lavender/70">Humidity</p>
              <p className="text-xl font-bold text-white">
                {weather.humidity}%
              </p>
            </article>
            <article>
              <p className="text-sm text-rich-lavender/70">Pressure</p>
              <p className="text-xl font-bold text-white">
                {weather.pressure} hPa
              </p>
            </article>
          </section>
        </li>

        <li className="rounded-lg bg-vampire-black/40 p-4">
          <h3 className="mb-3 font-trap text-lg text-rich-lavender">
            Visibility
          </h3>
          <section className="grid grid-cols-1 gap-4">
            <article>
              <p className="text-sm text-rich-lavender/70">Distance</p>
              <p className="text-xl font-bold text-white">
                {weather.visibility} km
              </p>
            </article>
          </section>
        </li>
      </ul>
    </section>
  );
};