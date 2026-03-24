import { type Metadata } from 'next';

import localFont from 'next/font/local';

import { appName } from '@/constants';

import { cls } from '@/utils';

import './globals.css';

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

const TacticSansExt = localFont({
  src: [{ path: '../../public/fonts/TacticSansExt.otf' }],
  variable: '--font-tactic-sans-ext'
});

const TacticSansReg = localFont({
  src: [{ path: '../../public/fonts/TacticSansReg.ttf' }],
  variable: '--font-tactic-sans-reg'
});

const Trap = localFont({
  src: [{ path: '../../public/fonts/Trap.otf' }],
  variable: '--font-trap'
});

export default async function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={cls(
          'min-h-screen bg-gradient-to-b from-dark-purple to-vampire-black',
          TacticSansExt.variable,
          TacticSansReg.variable,
          Trap.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  description: 'Monitor The Weather In Your Favorite Cities',
  title: appName
};
