import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KPIWidget } from './KPIWidget';
import { DollarSign } from 'lucide-react';

const mockKPIData = {
  current: 45680,
  previous: 42300,
  format: 'currency' as const,
  precision: 0,
};

describe('KPIWidget', () => {
  it('renders KPI information correctly', () => {
    render(
      <KPIWidget 
        title="Monthly Revenue" 
        data={mockKPIData}
        icon={DollarSign}
      />
    );
    
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    expect(screen.getByText('$45,680')).toBeInTheDocument();
  });

  it('calculates and displays trend correctly', () => {
    render(
      <KPIWidget 
        title="Revenue" 
        data={mockKPIData}
      />
    );
    
    // Should show positive trend (45680 vs 42300 = ~8% increase)
    expect(screen.getByText(/8\.\d%/)).toBeInTheDocument();
  });

  it('handles different number formats', () => {
    const percentageData = {
      current: 87.5,
      format: 'percentage' as const,
      precision: 1,
    };
    
    render(
      <KPIWidget 
        title="Efficiency" 
        data={percentageData}
      />
    );
    
    expect(screen.getByText('87.5%')).toBeInTheDocument();
  });

  it('shows loading state correctly', () => {
    render(
      <KPIWidget 
        title="Loading Data" 
        data={mockKPIData}
        loading={true}
      />
    );
    
    // Should show skeleton loaders instead of actual data
    const skeletons = screen.getAllByTestId(/skeleton/i);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(
      <KPIWidget 
        title="Clickable KPI" 
        data={mockKPIData}
        onClick={onClick}
      />
    );
    
    fireEvent.click(screen.getByText('Clickable KPI').closest('div')!);
    expect(onClick).toHaveBeenCalled();
  });

  it('displays target information when provided', () => {
    const dataWithTarget = {
      ...mockKPIData,
      target: {
        value: 50000,
        label: 'Target $50K',
        type: 'minimum' as const,
      },
    };
    
    render(
      <KPIWidget 
        title="Revenue with Target" 
        data={dataWithTarget}
      />
    );
    
    expect(screen.getByText('Target $50K')).toBeInTheDocument();
  });

  it('handles compact variant', () => {
    render(
      <KPIWidget 
        title="Compact KPI" 
        data={mockKPIData}
        variant="compact"
        size="sm"
      />
    );
    
    expect(screen.getByText('Compact KPI')).toBeInTheDocument();
    expect(screen.getByText('$45,680')).toBeInTheDocument();
  });

  it('formats bytes correctly', () => {
    const bytesData = {
      current: 2147483648, // 2GB
      format: 'bytes' as const,
      precision: 2,
    };
    
    render(
      <KPIWidget 
        title="Data Size" 
        data={bytesData}
      />
    );
    
    expect(screen.getByText('2.00 GB')).toBeInTheDocument();
  });

  it('formats duration correctly', () => {
    const durationData = {
      current: 3661, // 1h 1m 1s
      format: 'duration' as const,
      precision: 0,
    };
    
    render(
      <KPIWidget 
        title="Duration" 
        data={durationData}
      />
    );
    
    expect(screen.getByText('1h 1m')).toBeInTheDocument();
  });

  it('handles no previous data gracefully', () => {
    const noTrendData = {
      current: 156,
      format: 'number' as const,
      precision: 0,
    };
    
    render(
      <KPIWidget 
        title="Static Value" 
        data={noTrendData}
      />
    );
    
    expect(screen.getByText('156')).toBeInTheDocument();
    // Should not show any trend indicators
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});