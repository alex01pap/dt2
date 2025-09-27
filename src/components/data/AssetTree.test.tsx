import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssetTree } from './AssetTree';

const mockAssets = [
  {
    id: 'building-1',
    name: 'Main Building',
    type: 'building' as const,
    status: 'online' as const,
    children: [
      {
        id: 'sensor-1',
        name: 'Temperature Sensor',
        type: 'sensor' as const,
        status: 'online' as const,
        parentId: 'building-1'
      }
    ]
  }
];

describe('AssetTree', () => {
  it('renders empty state when no assets', () => {
    render(<AssetTree assets={[]} />);
    expect(screen.getByText('No Assets')).toBeInTheDocument();
  });

  it('renders assets correctly', () => {
    render(<AssetTree assets={mockAssets} />);
    expect(screen.getByText('Main Building')).toBeInTheDocument();
  });

  it('handles node selection', () => {
    const onNodeSelect = vi.fn();
    render(<AssetTree assets={mockAssets} onNodeSelect={onNodeSelect} />);
    
    fireEvent.click(screen.getByText('Main Building'));
    expect(onNodeSelect).toHaveBeenCalledWith(mockAssets[0]);
  });
});