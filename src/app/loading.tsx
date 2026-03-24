'use client';

import { ClockLoader } from 'react-spinners';

export default function Loading() {
  return (
    <main className="flex h-screen w-screen bg-gradient-to-b from-dark-purple to-vampire-black">
      <ClockLoader className="m-auto" color="#FFFFFF" size={64} />
    </main>
  );
}
