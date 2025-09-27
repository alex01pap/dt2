import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SensorCard } from './SensorCard';

const mockSensorProps = {
  id: 'sensor-1',
  name: 'Test Sensor',
  type: 'Temperature',
  location: 'Room A',
  isOnline: true,
  currentReading: {
    id: 'reading-1',
    value: 22.5,
    unit: '°C',
    timestamp: new Date('2023-01-01T12:00:00Z'),
    status: 'normal' as const,
  },
  trend: {
    direction: 'up' as const,
    percentage: 2.3,
  },
};

describe('SensorCard', () => {
  it('renders sensor information correctly', () => {
    render(<SensorCard {...mockSensorProps} />);
    
    expect(screen.getByText('Test Sensor')).toBeInTheDocument();
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('Room A')).toBeInTheDocument();
    expect(screen.getByText('22.5')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
  });

  it('shows online status correctly', () => {
    render(<SensorCard {...mockSensorProps} />);
    
    // Should show online WiFi icon
    const wifiIcon = screen.getByTestId('lucide-wifi') || 
                    screen.getByRole('img', { hidden: true });
    expect(wifiIcon).toBeInTheDocument();
  });

  it('shows offline status correctly', () => {
    render(<SensorCard {...mockSensorProps} isOnline={false} />);
    
    // Should show offline WiFi icon
    const wifiOffIcon = screen.getByTestId('lucide-wifi-off') ||
                       screen.getByRole('img', { hidden: true });
    expect(wifiOffIcon).toBeInTheDocument();
  });

  it('displays trend information', () => {
    render(<SensorCard {...mockSensorProps} />);
    
    expect(screen.getByText('2.3%')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<SensorCard {...mockSensorProps} onClick={onClick} />);
    
    fireEvent.click(screen.getByRole('button', { hidden: true }) || screen.getByText('Test Sensor').closest('[role="button"]') || screen.getByText('Test Sensor').closest('div')!);
    
    expect(onClick).toHaveBeenCalledWith('sensor-1');
  });

  it('shows warning status correctly', () => {
    const warningProps = {
      ...mockSensorProps,
      currentReading: {
        ...mockSensorProps.currentReading,
        status: 'warning' as const,
      },
    };
    
    render(<SensorCard {...warningProps} />);
    
    expect(screen.getByText('warning')).toBeInTheDocument();
  });

  it('shows critical status with alert icon', () => {
    const criticalProps = {
      ...mockSensorProps,
      currentReading: {
        ...mockSensorProps.currentReading,
        status: 'critical' as const,
      },
    };
    
    render(<SensorCard {...criticalProps} />);
    
    expect(screen.getByText('critical')).toBeInTheDocument();
  });

  it('handles no data gracefully', () => {
    const noDataProps = {
      ...mockSensorProps,
      currentReading: undefined,
      trend: undefined,
    };
    
    render(<SensorCard {...noDataProps} />);
    
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    render(<SensorCard {...mockSensorProps} />);
    
    // Should show "Updated" followed by time
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
  });
});