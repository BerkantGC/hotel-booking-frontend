# Socket Provider Documentation

## Overview

The `SocketProvider` is a React context provider that manages WebSocket connections using STOMP protocol over SockJS. It provides real-time communication capabilities for your hotel booking application.

## Features

- **Automatic Connection Management**: Connects when a valid token is available
- **Real-time Notifications**: Receives both user-specific and public notifications
- **Reconnection Logic**: Automatically attempts to reconnect on connection loss
- **TypeScript Support**: Fully typed for better development experience
- **Error Handling**: Comprehensive error reporting and handling

## Usage

### 1. Provider Setup

The `SocketProvider` is already configured in your root layout:

```tsx
// app/layout.tsx
import SocketProvider from "@/hooks/useSocket";
import { getSession } from "@/actions/authApi";

export default async function RootLayout({ children }) {
  const session = await getSession();
  
  return (
    <html lang="en">
      <body>
        <SocketProvider token={session?.token || ""}>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
```

### 2. Using the Socket Hook

Use the `useSocket` hook in any component to access socket functionality:

```tsx
'use client';
import { useSocket } from '@/hooks/useSocket';

export const MyComponent = () => {
  const { 
    isConnected, 
    notifications, 
    error, 
    sendMessage, 
    clearNotifications 
  } = useSocket();

  const handleSendMessage = () => {
    sendMessage('/app/booking', {
      action: 'book',
      hotelId: 123,
      userId: 456
    });
  };

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <p>Notifications: {notifications.length}</p>
      {error && <p>Error: {error}</p>}
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
};
```

## API Reference

### SocketProvider Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Child components |
| `token` | `string` | JWT token for authentication |

### useSocket Hook Returns

| Property | Type | Description |
|----------|------|-------------|
| `isConnected` | `boolean` | WebSocket connection status |
| `notifications` | `Notification[]` | Array of received notifications |
| `error` | `string \| null` | Current error message |
| `connect` | `() => void` | Manually connect to WebSocket |
| `disconnect` | `() => void` | Manually disconnect from WebSocket |
| `sendMessage` | `(destination: string, message: any) => void` | Send message to server |
| `clearNotifications` | `() => void` | Clear all notifications |

### Notification Type

```typescript
interface Notification {
  id?: string;
  message: string;
  type?: string;
  timestamp?: string;
  [key: string]: any;
}
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_WS_URL` | `http://localhost:8080/notify` | WebSocket server URL |

### Connection Settings

- **Reconnection Delay**: 5 seconds
- **Max Reconnection Attempts**: 5
- **Heartbeat Interval**: 4 seconds (incoming/outgoing)

## Examples

### 1. Notification Bell Component

The `NotificationBell` component shows how to display real-time notifications:

```tsx
import { useSocket } from '@/hooks/useSocket';

export const NotificationBell = () => {
  const { notifications, isConnected, clearNotifications } = useSocket();
  
  return (
    <div>
      <button>
        🔔 {notifications.length > 0 && <span>{notifications.length}</span>}
      </button>
      {/* Notification dropdown */}
    </div>
  );
};
```

### 2. Socket Tester Component

Use the `SocketTester` component to test WebSocket functionality:

```tsx
import SocketTester from '@/components/SocketTester';

export const TestPage = () => {
  return (
    <div>
      <h1>WebSocket Testing</h1>
      <SocketTester />
    </div>
  );
};
```

## Subscription Endpoints

The socket automatically subscribes to:

- `/user/queue/notifications` - User-specific notifications
- `/topic/notifications` - Public notifications

## Error Handling

Common errors and solutions:

1. **"No valid token available"**: Ensure user is authenticated
2. **"Connection error"**: Check server availability and token validity
3. **"Max reconnection attempts reached"**: Server might be down
4. **"useSocket must be used within a SocketProvider"**: Component is outside provider

## Migration from useWebSocket

If you were using the old `useWebSocket` hook:

```tsx
// Old way (deprecated)
import { useWebSocket } from '@/hooks/useSocket';

// New way
import { useSocket } from '@/hooks/useSocket';
```

The API is identical, but `useSocket` must be used within a `SocketProvider`.

## Troubleshooting

1. **Connection Issues**: Check if the WebSocket server is running and accessible
2. **Authentication Issues**: Verify JWT token is valid and not expired
3. **No Notifications**: Check if subscriptions are working on the server side
4. **TypeScript Errors**: Ensure you're using the hooks within the provider context
