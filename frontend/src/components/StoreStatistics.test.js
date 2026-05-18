import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StoreStatistics from './StoreStatistics';

describe('StoreStatistics Component', () => {
  test('renders loading state initially', () => {
    render(<StoreStatistics />);
    const spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  test('renders statistics after loading', async () => {
    render(<StoreStatistics />);
    
    await waitFor(() => {
      expect(screen.getByText('Store Statistics & Analytics')).toBeInTheDocument();
    });
  });

  test('displays total sales metric', async () => {
    render(<StoreStatistics />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sales')).toBeInTheDocument();
    });
  });

  test('displays total orders metric', async () => {
    render(<StoreStatistics />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Orders')).toBeInTheDocument();
    });
  });

  test('displays average order value metric', async () => {
    render(<StoreStatistics />);
    
    await waitFor(() => {
      expect(screen.getByText('Avg Order Value')).toBeInTheDocument();
    });
  });

  test('displays top product metric', async () => {
    render(<StoreStatistics />);
    
    await waitFor(() => {
      expect(screen.getByText('Top Product')).toBeInTheDocument();
    });
  });

  test('renders chart sections', async () => {
    render(<StoreStatistics />);
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Sales & Orders')).toBeInTheDocument();
      expect(screen.getByText('Sales by Category')).toBeInTheDocument();
      expect(screen.getByText('Weekly Revenue & Customer Trend')).toBeInTheDocument();
    });
  });

  test('displays performance summary', async () => {
    render(<StoreStatistics />);
    
    await waitFor(() => {
      expect(screen.getByText('Best Performing Month')).toBeInTheDocument();
      expect(screen.getByText('Customer Satisfaction')).toBeInTheDocument();
      expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
    });
  });

  test('renders recent activity section', async () => {
    render(<StoreStatistics />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });
  });

  test('displays growth indicators', async () => {
    render(<StoreStatistics />);
    
    await waitFor(() => {
      const growthIndicators = screen.getAllByText(/↑/);
      expect(growthIndicators.length).toBeGreaterThan(0);
    });
  });
});
