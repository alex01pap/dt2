import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LiveChart } from './LiveChart';

const mockSeries = [
  {
    key: 'temperature',
    name: 'Temperature',
    color: '#ff6b6b',
    data: [
      { timestamp: Date.now() - 60000, value: 22.5 },
      { timestamp: Date.now(), value: 23.1 }
    ],
    unit: '°C'
  }
];

describe('LiveChart', () => {
  it('renders empty state when no series', () => {
    render(<LiveChart series={[]} />);
    expect(screen.getByText('No Data')).toBeInTheDocument();
  });

  it('renders chart with series data', () => {
    render(<LiveChart series={mockSeries} title="Test Chart" />);
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByText('Temperature')).toBeInTheDocument();
  });
});