'use client';

import { useSocket } from '@/hooks/useSocket';
import { useState } from 'react';

export const SocketTester = () => {
  const { isConnected, sendMessage, notifications, error } = useSocket();
  const [message, setMessage] = useState('');
  const [destination, setDestination] = useState('/app/test');

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(destination, { 
        message: message.trim(),
        timestamp: new Date().toISOString(),
        type: 'test'
      });
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Socket Connection Tester</h2>
      
      {/* Connection Status */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? '● Connected' : '● Disconnected'}
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Send Message Form */}
      <div className="space-y-4">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="/app/test"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your test message..."
          />
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !message.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Send Message
        </button>
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Notifications</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {notifications.slice(0, 3).map((notification, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                <div className="font-medium">{notification.message}</div>
                {notification.timestamp && (
                  <div className="text-gray-500">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocketTester;
