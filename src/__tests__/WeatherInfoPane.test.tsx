import { render } from '@testing-library/react';
import { WeatherInfoPane } from '@/components';
import { WeatherCity } from '@/types';

describe('WeatherInfoPane', () => {
  const mockWeatherCity: WeatherCity = {
    id: 'lagos-nigeria',
    name: 'Lagos',
    country: 'Nigeria',
    isFavorite: false,
    population: 20000000,
    weather: {
      icon: 'https://example.com/weather-icon.png',
      lastUpdated: new Date('2025-03-04T12:00:00Z').toISOString(),
      description: 'Sunny',
      temperature: 32,
      visibility: 10,
      windSpeed: 5,
      feelsLike: 34,
      humidity: 60,
      pressure: 1015
    }
  };

  it('renders the city name and last updated time', () => {
    const { getByText } = render(<WeatherInfoPane data={mockWeatherCity} />);

    expect(getByText('Current Weather in Lagos, Nigeria')).toBeInTheDocument();
    expect(getByText(/Last updated on/)).toBeInTheDocument();
  });

  it('displays weather details correctly', () => {
    const { getAllByText, getByText } = render(
      <WeatherInfoPane data={mockWeatherCity} />
    );

    expect(getByText('Sunny')).toBeInTheDocument();
    expect(getByText('Feels Like')).toBeInTheDocument();
    expect(getByText('34°C')).toBeInTheDocument();
    expect(getByText('Wind')).toBeInTheDocument();
    expect(getByText('5 km/h')).toBeInTheDocument();
    expect(getByText('Humidity & Pressure')).toBeInTheDocument();
    expect(getByText('60%')).toBeInTheDocument();
    expect(getByText('1015 hPa')).toBeInTheDocument();
    expect(getByText('Visibility')).toBeInTheDocument();
    expect(getByText('10 km')).toBeInTheDocument();

    expect(getAllByText('32°C')).toHaveLength(2);
  });

  it('renders the weather icon when available', () => {
    const { getByAltText } = render(<WeatherInfoPane data={mockWeatherCity} />);
    expect(getByAltText('Sunny')).toBeInTheDocument();
  });

  it('does not render the icon section if no icon is provided', () => {
    const { queryByAltText } = render(
      <WeatherInfoPane
        data={{
          ...mockWeatherCity,
          weather: { ...mockWeatherCity.weather, icon: '' }
        }}
      />
    );

    expect(queryByAltText('Sunny')).not.toBeInTheDocument();
  });
});
