import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@ui5/webcomponents-react';
import App from './App';

describe('inital test', () => {
  test('should display a button', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    expect(screen.getByText('Send message')).toBeInTheDocument();
  });
});
