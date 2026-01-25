"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default Leaflet markers missing in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// Component to handle map movement
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, 14, { duration: 2 })
  }, [center, map])
  return null
}

export default function GymMap({ center, gyms, onGymClick }: any) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
    >
      {/* 👇 THIS IS THE FIX: Switched to CartoDB (Free, Dark Mode, No API Key needed) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {gyms.map((gym: any) => (
        <Marker 
          key={gym.id} 
          position={[gym.lat, gym.lng]} 
          icon={icon}
          eventHandlers={{
            click: () => onGymClick(gym),
          }}
        >
          <Popup className="text-black font-bold">
            {gym.name}
          </Popup>
        </Marker>
      ))}
      
      <MapUpdater center={center} />
    </MapContainer>
  )
}