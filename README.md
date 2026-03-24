# CitiWeda

A modern weather application that provides real-time weather information for cities around the world, with favorites management, detailed weather views, and offline capabilities.

This project was enhanced as part of the Remote Hustle Developers Challenge (RHDC) – Improvement & Optimization Round, where the original codebase was analyzed, optimized, and upgraded with new improvements to make the application more scalable, maintainable, and production-ready.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Jest-29.7-C21325?style=flat-square&logo=jest)](https://jestjs.io/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-000000?style=flat-square)](https://github.com/pmndrs/zustand)

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Demo](#demo)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Core Functionality](#core-functionality)
- [Testing](#testing)
- [Performance Optimizations](#performance-optimizations)
- [Browser Compatibility](#browser-compatibility)
- [Future Improvements](#future-improvements)

## Features

Features
City Listings: Display weather information for the world's largest cities
City Search System: Search and add new cities dynamically
Favorites Management: Add/remove cities to a favorites list for quick access
Detailed Weather Views: Comprehensive weather information including temperature, wind, humidity, pressure, and visibility
Notes System: Add, edit, and save personal notes for each city
Offline Support: Cache weather data and user preferences in local storage for offline access
Geolocation Detection: Automatically detect and display the user's city weather
Responsive Design: Clean UI optimized for desktop, tablet, and mobile
Persistent State: Favorites, notes, and weather data stored in local storage
Weather Data Refreshing: Weather data automatically refreshes every 30 minutes

## Demo

A live demo of the application is available at [citiweda.vercel.app](https://citiweda-6s5c.vercel.app/).

## Technical Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) (No UI frameworks)
- **State Management**: [Zustand 5.0](https://github.com/pmndrs/zustand) with persist middleware
- **API**: [Open-Meteo](https:Open-Meteo.com/) for weather data
- **Testing**: [Jest 29.7](https://jestjs.io/) & [React Testing Library 16.2](https://testing-library.com/docs/react-testing-library/intro/)
- **Browser APIs**: Geolocation API, Local Storage

## Project Structure

```
src/
├── __tests__/                  # Test files
│   └── components/             # Component tests
├── app/                        # Next.js app directory
│   ├── city/[id]/              # Weather info page fo           # Landing page
├── components/                 # React components
│   ├── CitiesSection.tsx       # Cities list component
│   ├── CityTile.tsx            # Individual city card
│   ├── Header.tsx              # Navigation header
│   ├── NotesSection.tsx        # Notes management component
│   ├── SearchBar.tsx           # Search functionality component
│   └── WeatherInfoPane.tsx     # Weather details component
├── constants/                  # Application constants
│   └── index.ts                # App name, default cities
├── services/                   # API services
│   └── weather-service.ts      # Weatherstack API integration
├── stores/                     # State management
│   └── main-store.ts           # Zustand store with persistence
├── types/                      # TypeScript type definitions
│   └── index.ts                # Shared types
└── utils/                      # Utility functions
    └── index.ts                # Logger, CSS utilities
```

## Setup and Installation

### Prerequisites

- Node.js 24 or higher
- npm or yarn

### Installation Steps

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```


3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:4096](http://localhost:4096) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

     |

## Core Functionality

### 

RHDC Improvements (Stage 2 Enhancements)

As part of the Remote Hustle Developers Challenge, the assigned project was carefully reviewed and improved to enhance performance, usability, and scalability.

Code Review & Analysis

The following issues were identified in the original project:

Potential duplicate city entries when adding cities
Weather API retry logic could cause unnecessary repeated calls
UI structure lacked clarity in some components
Some components contained redundant logic
Limited weather information displayed on city cards
Lack of documentation explaining architecture improvements

### 
Improvements Implemented
1. Performance & Structure Improvements
Improved Weather Data Refresh Logic

Weather updates now only occur when data becomes stale (older than 30 minutes), reducing unnecessary API calls.

Duplicate City Prevention

Improved store logic to prevent adding the same city multiple times.

Zustand Store Optimization

The global store structure was reviewed and optimized to improve state handling for:

favorites
weather data
cities
notes


### Geolocation

The app requests permission to access the user's location and automatically fetches weather for their current city:



### Offline Support

Data is persisted in local storage to provide functionality when offline:

## Feature Enhancements

Improved City Search & Add System

Users can now easily search and add cities dynamically through the search bar.

Enhanced Weather Information

The weather details page now includes structured sections for:

Actual temperature
Feels-like temperature
Wind speed
Humidity
Atmospheric pressure
Visibility

This provides richer weather insights to users.

## UI / UX Refinements

Several UI improvements were implemented:

Improved weather card readability
Clearer favorite icon behavior
Better spacing and layout on weather cards
Improved weather detail display
Better visual structure for weather information

## Product Readiness Improvements

The project was prepared for real-world usage by ensuring:

All routes work correctly
No broken components
Weather data loads properly
Favorites and notes persist across reloads
API requests are properly handled
Responsive layout works across screen sizes

## Testing

Run the test suite with:

```bash
npm test
# or
yarn test
```

The test suite includes:

- Component tests using React Testing Library
- Mock implementations for external dependencies
- Unit tests for core functionality

## Performance Optimizations

- **Data Caching**: Weather data is cached to minimize API calls
- **Component Memoization**: React's useMemo and useCallback for performance
- **CSS Optimization**: Tailwind with purge for minimal CSS
- **Lazy Loading**: Dynamic imports for code splitting

## Browser Compatibility

- Chrome
- Firefox
- Safari
- Edge

## Future Improvements

- PWA capabilities for full offline experience
- Additional weather data visualization
- Weather forecast for upcoming days
- Weather alerts and notifications
- Dark/light theme toggle
- City comparison feature

---

## License

This project is for educational purposes. All rights reserved.

## Acknowledgements

- [open-meteo API](https://Open-Meteo.com/) for weather data
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for framework
