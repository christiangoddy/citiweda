import { fireEvent, waitFor, render } from '@testing-library/react';

import { searchCity } from '@/services/weather-service';

import { SearchBar } from '@/components';

import { useMainStore } from '@/stores';

jest.mock('@/stores/main-store', () => ({
  useMainStore: jest.fn()
}));

jest.mock('@/services/weather-service', () => ({
  searchCity: jest.fn()
}));

describe('SearchBar', () => {
  const mockUpdateWeatherData = jest.fn();
  const mockAddCity = jest.fn();

  beforeEach(() => {
    (useMainStore as unknown as jest.Mock).mockReturnValue({
      updateWeatherData: mockUpdateWeatherData,
      addCity: mockAddCity
    });
  });

  it('renders the search input and button', () => {
    const { getByPlaceholderText, getByTestId } = render(<SearchBar />);
    expect(getByPlaceholderText('Search for a city...')).toBeInTheDocument();
    expect(getByTestId('search-button')).toBeInTheDocument();
  });

  it('updates the input value when the user types', () => {
    const { getByPlaceholderText } = render(<SearchBar />);

    const input = getByPlaceholderText('Search for a city...');
    fireEvent.change(input, { target: { value: 'London' } });

    expect((input as HTMLInputElement).value).toBe('London');
  });

  it('calls the search function and adds a city when the form is submitted', async () => {
    (searchCity as jest.Mock).mockResolvedValue([
      {
        id: 'london-uk',
        name: 'London',
        country: 'UK',
        isFavorite: false,
        population: 8900000,
        weather: {
          icon: 'icon-url',
          lastUpdated: new Date().toISOString(),
          description: 'Cloudy',
          temperature: 15,
          visibility: 10,
          windSpeed: 5,
          feelsLike: 14,
          humidity: 75,
          pressure: 1012
        }
      }
    ]);

    const { getByPlaceholderText, getByTestId } = render(<SearchBar />);

    const input = getByPlaceholderText('Search for a city...');

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(getByTestId('search-button'));

    await waitFor(() => {
      expect(searchCity).toHaveBeenCalledWith('London');

      expect(mockUpdateWeatherData).toHaveBeenCalledWith('london-uk', {
        icon: 'icon-url',
        lastUpdated: expect.any(String),
        description: 'Cloudy',
        temperature: 15,
        visibility: 10,
        windSpeed: 5,
        feelsLike: 14,
        humidity: 75,
        pressure: 1012
      });

      expect(mockAddCity).toHaveBeenCalledWith({
        id: 'london-uk',
        name: 'London',
        country: 'UK',
        isFavorite: false,
        population: 8900000
      });
    });
  });

  it('displays an error message when no city is found', async () => {
    (searchCity as jest.Mock).mockResolvedValue([]);

    const { getByPlaceholderText, getByTestId, getByText } = render(
      <SearchBar />
    );

    const input = getByPlaceholderText('Search for a city...');

    fireEvent.change(input, { target: { value: 'Unknown City' } });
    fireEvent.click(getByTestId('search-button'));

    await waitFor(() => {
      expect(
        getByText("No city found with name 'Unknown City'")
      ).toBeInTheDocument();
    });
  });

  it('displays an error message when there is no internet connection', async () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false
    });

    const { getByPlaceholderText, getByTestId, getByText } = render(
      <SearchBar />
    );

    const input = getByPlaceholderText('Search for a city...');

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(getByTestId('search-button'));

    await waitFor(() => {
      expect(getByText('No internet connection')).toBeInTheDocument();
    });
  });

  it('displays a loading spinner when searching', async () => {
    (searchCity as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 1000))
    );

    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => true
    });

    const { getByPlaceholderText, getByTestId } = render(<SearchBar />);

    const input = getByPlaceholderText('Search for a city...');

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(getByTestId('search-button'));

    await waitFor(() => {
      expect(getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });
});
