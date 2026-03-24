import { fireEvent, render } from '@testing-library/react';

import { usePathname, useRouter } from 'next/navigation';

import { appName } from '@/constants';

import { Header } from '@/components';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn()
}));

describe('Header', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack
    });
  });

  it('renders the header with the app name', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    const { queryByText, getByText } = render(<Header />);

    expect(queryByText('Back to Home')).not.toBeInTheDocument();
    expect(getByText(appName)).toBeInTheDocument();
  });

  it('renders the "Back to Home" button on non-home pages', () => {
    (usePathname as jest.Mock).mockReturnValue('/details');

    const { getByText } = render(<Header />);

    expect(getByText('Back to Home')).toBeInTheDocument();
  });

  it('navigates back to home when "Back to Home" is clicked and history is empty', () => {
    (usePathname as jest.Mock).mockReturnValue('/details');

    Object.defineProperty(window, 'history', {
      writable: true,
      value: {
        length: 1
      }
    });

    const { getByText } = render(<Header />);

    const backButton = getByText('Back to Home');
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('navigates back using router.back() when "Back to Home" is clicked and history is not empty', () => {
    (usePathname as jest.Mock).mockReturnValue('/details');

    Object.defineProperty(window, 'history', {
      writable: true,
      value: {
        length: 2
      }
    });

    const { getByText } = render(<Header />);

    const backButton = getByText('Back to Home');
    fireEvent.click(backButton);

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockBack).toHaveBeenCalled();
  });
});
