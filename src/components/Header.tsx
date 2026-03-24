'use client';

import { usePathname } from 'next/navigation';

import { useRouter } from 'next/navigation';

import { appName } from '@/constants';

export const Header = () => {
  const isHomePage = usePathname() === '/';

  const router = useRouter();

  const handleBackPress = () => {
    if (window.history.length <= 1) {
      router.push('/');
    } else {
      router.back();
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 mx-auto flex w-full max-w-best">
      <nav className="flex w-full items-center justify-between border-b border-rich-lavender/40 px-4 py-6 backdrop-blur-xl">
        <h1 className="cursor-default font-trap text-2xl text-white">
          {appName}
        </h1>
        {!isHomePage && (
          <button
            onClick={handleBackPress}
            className="rounded-md bg-ocean-blue/50 px-4 py-2 text-sm text-white transition-colors hover:bg-ocean-blue/70"
          >
            Back to Home
          </button>
        )}
      </nav>
    </header>
  );
};
