/* eslint-disable @next/next/no-img-element */

import { fireEvent, render } from '@testing-library/react';

import { useMainStore } from '@/stores';

import { CityTile } from '@/components';

interface LinkProps {
  children: React.ReactNode;
  href: string;
}

interface ImgProps {
  src: string;
  alt: string;
}

jest.mock('@/stores/main-store', () => ({
  useMainStore: jest.fn()
}));

jest.mock('next/image', () => {
  const MockedImage = ({ src, alt }: ImgProps) => {
    return <img src={src} alt={alt} />;
  };

  return MockedImage;
});

jest.mock('next/link', () => {
  const MockedLink = ({ children, href }: LinkProps) => {
    return <a href={href}>{children}</a>;
  };

  return MockedLink;
});

describe('CityTile', () => {
  const mockCity = {
    population: 37400068,
    isFavorite: false,
    country: 'Japan',
    name: 'Tokyo',
    id: '1'
  };

  const mockWeather = {
    icon: 'sun-icon-url',
    lastUpdated: new Date().toISOString(),
    description: 'Sunny',
    temperature: 22,
    visibility: 10,
    pressure: 1015,
    windSpeed: 10,
    feelsLike: 24,
    humidity: 60
  };

  const mockRemoveFromFavorites = jest.fn();
  const mockAddToFavorites = jest.fn();
  const mockRemoveCity = jest.fn();

  beforeEach(() => {
    (useMainStore as unknown as jest.Mock).mockReturnValue({
      removeFromFavorites: mockRemoveFromFavorites,
      addToFavorites: mockAddToFavorites,
      removeCity: mockRemoveCity
    });

    jest.clearAllMocks();
  });

  it('renders city name and country', () => {
    const { getByText } = render(
      <CityTile city={mockCity} weather={mockWeather} isFave={false} />
    );

    expect(getByText('Tokyo')).toBeInTheDocument();
    expect(getByText('Japan')).toBeInTheDocument();
  });

  it('renders weather information when provided', () => {
    const { getByText } = render(
      <CityTile city={mockCity} weather={mockWeather} isFave={false} />
    );

    expect(getByText('Sunny')).toBeInTheDocument();
    expect(getByText('22°C')).toBeInTheDocument();
  });

  it('shows loading state when weather is not provided', () => {
    const { getByTestId } = render(<CityTile city={mockCity} isFave={false} />);
    expect(getByTestId('loading-message')).toBeInTheDocument();
  });

  it('calls removeFromFavorites() when favorite button is clicked for favorited city', () => {
    const { getByTestId } = render(
      <CityTile
        city={{ ...mockCity, isFavorite: true }}
        weather={mockWeather}
        isFave={false}
      />
    );

    fireEvent.click(getByTestId('favorite-button'));

    expect(mockRemoveFromFavorites).toHaveBeenCalledWith(mockCity.id);
  });

  it('calls addToFavorites() when favorite button is clicked', () => {
    const { getByTestId } = render(
      <CityTile city={mockCity} weather={mockWeather} isFave={false} />
    );

    fireEvent.click(getByTestId('favorite-button'));

    expect(mockAddToFavorites).toHaveBeenCalledWith(mockCity);
  });

  it('calls removeCity() when remove button is clicked and confirmed', () => {
    const { getByTestId } = render(
      <CityTile city={mockCity} weather={mockWeather} isFave={false} />
    );

    window.confirm = jest.fn(() => true);

    fireEvent.click(getByTestId('remove-button'));

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to remove Tokyo?'
    );

    expect(mockRemoveCity).toHaveBeenCalledWith(mockCity.id);
  });

  it('calls removeFromFavorites() when remove button is clicked for favorite pane', () => {
    const { getByTestId } = render(
      <CityTile city={mockCity} weather={mockWeather} isFave={true} />
    );

    fireEvent.click(getByTestId('remove-button'));

    expect(mockRemoveFromFavorites).toHaveBeenCalledWith(mockCity.id);
    expect(mockRemoveCity).not.toHaveBeenCalled();
  });

  it('does not display favorite button when isFave prop is true', () => {
    const { queryByTestId } = render(
      <CityTile city={mockCity} weather={mockWeather} isFave={true} />
    );

    expect(queryByTestId('favorite-button')).not.toBeInTheDocument();
  });

  it('creates correct href for city detail page', () => {
    const { container } = render(
      <CityTile city={mockCity} weather={mockWeather} isFave={false} />
    );

    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/city/1');
  });

  it('renders favorite star in correct color when city is favorited', () => {
    const { getByTestId } = render(
      <CityTile
        city={{ ...mockCity, isFavorite: true }}
        weather={mockWeather}
        isFave={false}
      />
    );

    const favoriteButton = getByTestId('favorite-button');

    expect(favoriteButton).toHaveClass('text-yellow-400');
  });

  it('prevents default and stops propagation when clicking favorite button', () => {
    const { getByTestId } = render(
      <CityTile city={mockCity} weather={mockWeather} isFave={false} />
    );

    const favoriteButton = getByTestId('favorite-button');

    const mockEvent = new MouseEvent('click', {
      cancelable: true,
      bubbles: true
    });

    jest.spyOn(mockEvent, 'stopPropagation');
    jest.spyOn(mockEvent, 'preventDefault');

    fireEvent(favoriteButton, mockEvent);

    expect(mockAddToFavorites).toHaveBeenCalled();
  });

  it('prevents default and stops propagation when clicking remove button', () => {
    const { getByTestId } = render(
      <CityTile city={mockCity} weather={mockWeather} isFave={false} />
    );

    const removeButton = getByTestId('remove-button');

    const mockEvent = new MouseEvent('click', {
      cancelable: true,
      bubbles: true
    });

    jest.spyOn(mockEvent, 'stopPropagation');
    jest.spyOn(mockEvent, 'preventDefault');

    fireEvent(removeButton, mockEvent);

    expect(mockRemoveCity).toHaveBeenCalled();

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('displays correct title for buttons', () => {
    const { getByTitle } = render(
      <CityTile city={mockCity} weather={mockWeather} isFave={false} />
    );

    expect(getByTitle('Add to favorites')).toBeInTheDocument();
    expect(getByTitle('Remove city')).toBeInTheDocument();
  });

  it('displays correct title for favorite buttons when city is already favorited', () => {
    const { getByTitle } = render(
      <CityTile
        city={{ ...mockCity, isFavorite: true }}
        weather={mockWeather}
        isFave={false}
      />
    );

    expect(getByTitle('Remove from favorites')).toBeInTheDocument();
    expect(getByTitle('Remove city')).toBeInTheDocument();
  });
});
