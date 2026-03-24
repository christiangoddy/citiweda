import { render } from '@testing-library/react';

import { CitiesSection } from '@/components';

import { useMainStore } from '@/stores';

jest.mock('@/stores/main-store', () => ({
  useMainStore: jest.fn()
}));

describe('CitiesSection', () => {
  const mockWeatherData = {
    'tokyo-japan': {
      icon: 'tokyo-icon-url',
      lastUpdated: new Date().toISOString(),
      description: 'Partly cloudy',
      temperature: 22,
      visibility: 10,
      windSpeed: 8,
      feelsLike: 23,
      humidity: 65,
      pressure: 1012
    },
    'delhi-india': {
      icon: 'delhi-icon-url',
      lastUpdated: new Date().toISOString(),
      description: 'Sunny',
      temperature: 32,
      visibility: 8,
      windSpeed: 5,
      feelsLike: 34,
      humidity: 45,
      pressure: 1008
    },
    'london-uk': {
      icon: 'london-icon-url',
      lastUpdated: new Date().toISOString(),
      description: 'Rainy',
      temperature: 15,
      visibility: 6,
      windSpeed: 12,
      feelsLike: 12,
      humidity: 80,
      pressure: 998
    }
  };

  const mockFavorites = [
    {
      id: 'london-uk',
      name: 'London',
      country: 'UK',
      population: 9304016,
      isFavorite: true
    }
  ];

  const mockCities = [
    {
      id: 'tokyo-japan',
      name: 'Tokyo',
      country: 'Japan',
      population: 37400068,
      isFavorite: false
    },
    {
      id: 'delhi-india',
      name: 'Delhi',
      country: 'India',
      population: 29399141,
      isFavorite: false
    }
  ];

  beforeEach(() => {
    (useMainStore as unknown as jest.Mock).mockReturnValue({
      weatherData: mockWeatherData,
      favorites: mockFavorites,
      cities: mockCities
    });
  });

  it('should render both favorites and cities sections when both exist', () => {
    const { getByText } = render(<CitiesSection />);

    expect(getByText('All Cities')).toBeInTheDocument();
    expect(getByText('Favorites')).toBeInTheDocument();

    expect(getByText('London')).toBeInTheDocument();
    expect(getByText('Tokyo')).toBeInTheDocument();
    expect(getByText('Delhi')).toBeInTheDocument();
  });

  it('should render cities alphabetically', () => {
    const mockCitiesPlus = [
      {
        id: 'tokyo-japan',
        name: 'Tokyo',
        country: 'Japan',
        population: 37400068,
        isFavorite: false
      },
      {
        id: 'delhi-india',
        name: 'Delhi',
        country: 'India',
        population: 29399141,
        isFavorite: false
      },
      {
        id: 'beijing-china',
        name: 'Beijing',
        country: 'China',
        population: 21540000,
        isFavorite: false
      }
    ];

    (useMainStore as unknown as jest.Mock).mockReturnValue({
      weatherData: mockWeatherData,
      favorites: mockFavorites,
      cities: mockCitiesPlus
    });

    const { getAllByText } = render(<CitiesSection />);

    const data = getAllByText(/Beijing|Delhi|Tokyo/).map((e) => e.textContent);

    expect(data.indexOf('Beijing')).toBeLessThan(data.indexOf('Delhi'));
    expect(data.indexOf('Delhi')).toBeLessThan(data.indexOf('Tokyo'));
  });

  it('should render favorites alphabetically', () => {
    const mockFavoritesPlus = [
      {
        id: 'london-uk',
        name: 'London',
        country: 'UK',
        population: 9304016,
        isFavorite: true
      },
      {
        id: 'paris-france',
        name: 'Paris',
        country: 'France',
        population: 2148271,
        isFavorite: true
      },
      {
        id: 'amsterdam-netherlands',
        name: 'Amsterdam',
        country: 'Netherlands',
        population: 1149000,
        isFavorite: true
      }
    ];

    (useMainStore as unknown as jest.Mock).mockReturnValue({
      weatherData: mockWeatherData,
      favorites: mockFavoritesPlus,
      cities: mockCities
    });

    const { getAllByText } = render(<CitiesSection />);

    const data = getAllByText(/Amsterdam|London|Paris/).map(
      (e) => e.textContent
    );

    expect(data.indexOf('Amsterdam')).toBeLessThan(data.indexOf('London'));
    expect(data.indexOf('London')).toBeLessThan(data.indexOf('Paris'));
  });

  it('should display message when no cities or favorites exist', () => {
    (useMainStore as unknown as jest.Mock).mockReturnValue({
      weatherData: {},
      favorites: [],
      cities: []
    });

    const { queryByText, getByText } = render(<CitiesSection />);

    expect(queryByText('All Cities')).not.toBeInTheDocument();
    expect(queryByText('Favorites')).not.toBeInTheDocument();

    expect(
      getByText('No cities found. Try searching for a city.')
    ).toBeInTheDocument();
  });

  it('should render only cities section when no favorites exist', () => {
    (useMainStore as unknown as jest.Mock).mockReturnValue({
      weatherData: mockWeatherData,
      cities: mockCities,
      favorites: []
    });

    const { queryByText, getByText } = render(<CitiesSection />);

    expect(queryByText('Favorites')).not.toBeInTheDocument();
    expect(getByText('All Cities')).toBeInTheDocument();

    expect(getByText('Tokyo')).toBeInTheDocument();
    expect(getByText('Delhi')).toBeInTheDocument();
  });

  it('should render only favorites section when no cities exist', () => {
    (useMainStore as unknown as jest.Mock).mockReturnValue({
      weatherData: mockWeatherData,
      favorites: mockFavorites,
      cities: []
    });

    const { queryByText, getByText } = render(<CitiesSection />);

    expect(queryByText('All Cities')).not.toBeInTheDocument();

    expect(getByText('Favorites')).toBeInTheDocument();
    expect(getByText('London')).toBeInTheDocument();
  });
});
