import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Mock Socket.IO functionality for demonstration
// In a real app, this would connect to actual Socket.IO server
interface LiveSocketData {
  type: 'user_activity' | 'system_alert' | 'data_update';
  payload: any;
  timestamp: Date;
}

interface UseLiveSocketReturn {
  isConnected: boolean;
  lastMessage: LiveSocketData | null;
  sendMessage: (type: string, payload: any) => void;
  connectionCount: number;
}

export function useLiveSocket(): UseLiveSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<LiveSocketData | null>(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const { user } = useAuth();

  // Mock connection establishment
  useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }

    // Simulate connection delay
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
      setConnectionCount(Math.floor(Math.random() * 50) + 100); // Mock 100-150 active connections
    }, 1000);

    return () => clearTimeout(connectTimeout);
  }, [user]);

  // Mock incoming messages
  useEffect(() => {
    if (!isConnected) return;

    const mockMessages: Omit<LiveSocketData, 'timestamp'>[] = [
      {
        type: 'user_activity',
        payload: { action: 'login', user: 'John Doe', location: 'New York' }
      },
      {
        type: 'system_alert',
        payload: { level: 'info', message: 'System backup completed successfully' }
      },
      {
        type: 'data_update',
        payload: { metric: 'active_users', value: Math.floor(Math.random() * 1000) + 2000 }
      },
      {
        type: 'user_activity',
        payload: { action: 'document_created', user: 'Sarah Wilson', document: 'Q4 Report' }
      }
    ];

    const interval = setInterval(() => {
      const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      setLastMessage({
        ...randomMessage,
        timestamp: new Date()
      });
      
      // Occasionally update connection count
      if (Math.random() < 0.1) {
        setConnectionCount(prev => prev + Math.floor(Math.random() * 10) - 5);
      }
    }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  const sendMessage = useCallback((type: string, payload: any) => {
    if (!isConnected) {
      console.warn('Socket not connected');
      return;
    }

    // Mock sending message
    console.log('Mock Socket.IO send:', { type, payload, user: user?.email });
    
    // In a real implementation, this would emit to the server:
    // socket.emit(type, payload);
  }, [isConnected, user]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connectionCount
  };
}