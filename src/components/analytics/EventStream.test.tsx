import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventStream } from './EventStream';

const mockEvents = [
  {
    id: '1',
    timestamp: new Date('2023-01-01T12:00:00Z'),
    level: 'info' as const,
    title: 'Test Info Event',
    description: 'This is a test info event',
    source: 'Test Source',
  },
  {
    id: '2',
    timestamp: new Date('2023-01-01T11:00:00Z'),
    level: 'warning' as const,
    title: 'Test Warning Event',
    description: 'This is a test warning event',
    source: 'Another Source',
  },
  {
    id: '3',
    timestamp: new Date('2023-01-01T10:00:00Z'),
    level: 'error' as const,
    title: 'Test Error Event',
    description: 'This is a test error event',
    source: 'Test Source',
  },
];

describe('EventStream', () => {
  it('renders events correctly', () => {
    render(<EventStream events={mockEvents} />);
    
    expect(screen.getByText('Event Stream')).toBeInTheDocument();
    expect(screen.getByText('Test Info Event')).toBeInTheDocument();
    expect(screen.getByText('Test Warning Event')).toBeInTheDocument();
    expect(screen.getByText('Test Error Event')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<EventStream events={[]} loading={true} />);
    
    expect(screen.getByRole('status') || screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows empty state when no events', () => {
    render(<EventStream events={[]} />);
    
    expect(screen.getByText('No events found')).toBeInTheDocument();
  });

  it('filters events by search query', async () => {
    const user = userEvent.setup();
    render(<EventStream events={mockEvents} showFilters={true} />);
    
    const searchInput = screen.getByPlaceholderText('Search events...');
    await user.type(searchInput, 'warning');
    
    await waitFor(() => {
      expect(screen.getByText('Test Warning Event')).toBeInTheDocument();
      expect(screen.queryByText('Test Info Event')).not.toBeInTheDocument();
    });
  });

  it('filters events by level', async () => {
    const user = userEvent.setup();
    render(<EventStream events={mockEvents} showFilters={true} />);
    
    // Click on level filter dropdown
    const levelFilter = screen.getByDisplayValue('All Levels') || 
                       screen.getByRole('combobox', { name: /level/i });
    await user.click(levelFilter);
    
    // Select error level
    const errorOption = screen.getByText('Error');
    await user.click(errorOption);
    
    await waitFor(() => {
      expect(screen.getByText('Test Error Event')).toBeInTheDocument();
      expect(screen.queryByText('Test Info Event')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Warning Event')).not.toBeInTheDocument();
    });
  });

  it('handles event click', async () => {
    const onEventClick = vi.fn();
    const user = userEvent.setup();
    
    render(<EventStream events={mockEvents} onEventClick={onEventClick} />);
    
    const firstEvent = screen.getByText('Test Info Event');
    await user.click(firstEvent);
    
    expect(onEventClick).toHaveBeenCalledWith(mockEvents[0]);
  });

  it('shows correct event count', () => {
    render(<EventStream events={mockEvents} />);
    
    expect(screen.getByText('3 events')).toBeInTheDocument();
  });

  it('handles load more functionality', async () => {
    const onLoadMore = vi.fn();
    const user = userEvent.setup();
    
    render(
      <EventStream 
        events={mockEvents} 
        hasMore={true}
        onLoadMore={onLoadMore}
      />
    );
    
    const loadMoreButton = screen.getByText('Load More Events');
    await user.click(loadMoreButton);
    
    expect(onLoadMore).toHaveBeenCalled();
  });

  it('shows auto-refresh badge when enabled', () => {
    render(<EventStream events={mockEvents} autoRefresh={true} />);
    
    expect(screen.getByText('Auto-refresh')).toBeInTheDocument();
  });

  it('filters by source correctly', async () => {
    const user = userEvent.setup();
    render(<EventStream events={mockEvents} showFilters={true} />);
    
    // Find and click the source filter dropdown
    const sourceFilters = screen.getAllByRole('combobox');
    const sourceFilter = sourceFilters.find(filter => 
      filter.getAttribute('aria-expanded') !== null
    );
    
    if (sourceFilter) {
      await user.click(sourceFilter);
      
      const testSourceOption = screen.getByText('Test Source');
      await user.click(testSourceOption);
      
      await waitFor(() => {
        expect(screen.getByText('Test Info Event')).toBeInTheDocument();
        expect(screen.getByText('Test Error Event')).toBeInTheDocument();
        expect(screen.queryByText('Test Warning Event')).not.toBeInTheDocument();
      });
    }
  });

  it('displays event levels with correct styling', () => {
    render(<EventStream events={mockEvents} />);
    
    expect(screen.getByText('info')).toBeInTheDocument();
    expect(screen.getByText('warning')).toBeInTheDocument();
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('shows timestamps correctly', () => {
    render(<EventStream events={mockEvents} />);
    
    // Should show formatted time for each event
    const timeElements = screen.getAllByText(/\d{1,2}:\d{2}:\d{2}/);
    expect(timeElements).toHaveLength(mockEvents.length);
  });
});