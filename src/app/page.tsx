// app/page.tsx
'use client';

import { useEffect, useState } from 'react';

import { ClockLoader } from 'react-spinners';

import { Space_Grotesk } from 'next/font/google';

import { CitiesSection, SearchBar, Header } from '@/components';

import { useMainStore } from '@/stores';

import { cls } from '@/utils';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function LandingPage() {
  const { isPermissionDenied, fetchCurrentCity, fetchWeatherData } =
    useMainStore();

  const [isLoadingPage, setIsLoadingPage] = useState(true);

useEffect(() => {
  fetchCurrentCity();
  fetchWeatherData();
  setIsLoadingPage(false);
}, [fetchCurrentCity, fetchWeatherData]);

  return (
    <main
      className={cls(
        'relative mx-auto flex w-full max-w-best flex-col gap-6 pb-14 pt-32',
        'transition-opacity duration-500 ease-in-out',
        isLoadingPage && 'opacity-0',
        spaceGrotesk.className
      )}
    >
      <Header />
      <h1 className="text-center font-trap text-3xl text-white">
        Weather Info At Your Fingertips!
      </h1>
      {isPermissionDenied && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/20 p-4 text-white">
          Location access was denied. Grant location permission for the best
          experience.
        </p>
      )}
      <SearchBar />
      <CitiesSection />
      <section
        className={cls(
          'absolute inset-0 flex h-screen w-full',
          'transition-opacity duration-500 ease-in-out',
          !isLoadingPage && '-z-10 opacity-0'
        )}
      >
        <ClockLoader className="m-auto" color="#FFFFFF" size={64} />
      </section>
    </main>
  );
}
