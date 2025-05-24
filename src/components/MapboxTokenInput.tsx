
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MapboxTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapboxTokenInput = ({ onTokenSubmit }: MapboxTokenInputProps) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 max-w-md">
        <h3 className="text-lg font-semibold mb-2">Map requires Mapbox token</h3>
        <p className="text-gray-600 mb-4">Please add your Mapbox public token to enable the map</p>
        <p className="text-sm text-gray-500 mb-6">Get your token at https://mapbox.com/</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your Mapbox public token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Load Map
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MapboxTokenInput;
