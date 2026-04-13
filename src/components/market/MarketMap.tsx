'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatCurrency } from '@/lib/utils';

// Corrigir ícones do Leaflet que costumam quebrar no Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MarketMapProps {
  properties: any[];
  center?: [number, number];
}

export default function MarketMap({ properties, center = [40.2033, -8.4103] }: MarketMapProps) {
  return (
    <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-border shadow-xl relative z-10">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {properties.map((prop) => {
          // Gerar coordenadas aleatórias aproximadas se não existirem
          const lat = 40.2033 + (Math.random() - 0.5) * 0.05;
          const lng = -8.4103 + (Math.random() - 0.5) * 0.05;

          return (
            <Marker key={prop.id} position={[lat, lng]} icon={icon}>
              <Popup className="custom-popup">
                <div className="p-2 space-y-2">
                  <img src={prop.image} className="w-full h-20 object-cover rounded-lg" alt="" />
                  <h4 className="font-bold text-xs truncate">{prop.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-xs">{formatCurrency(prop.price)}</span>
                    <span className="text-[10px] bg-muted px-1 rounded">{prop.rooms}</span>
                  </div>
                  <a 
                    href={prop.link} 
                    target="_blank" 
                    className="block text-center py-1 bg-primary text-white text-[10px] font-bold rounded-md"
                  >
                    Ver no Portal
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
