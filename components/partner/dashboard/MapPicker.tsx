"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ 
  position, 
  onPositionChange 
}: { 
  position: { lat: number; lng: number }; 
  onPositionChange: (lat: number, lng: number) => void;
}) {
  const [markerPosition, setMarkerPosition] = useState(position);

  useMapEvents({
    click: (e) => {
      setMarkerPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  return (
    <Marker
      position={[markerPosition.lat, markerPosition.lng]}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setMarkerPosition({ lat: position.lat, lng: position.lng });
          onPositionChange(position.lat, position.lng);
        },
      }}
    />
  );
}

export default function MapPicker({ latitude, longitude, onLocationSelect }: MapPickerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker 
        position={{ lat: latitude, lng: longitude }}
        onPositionChange={onLocationSelect}
      />
    </MapContainer>
  );
}
