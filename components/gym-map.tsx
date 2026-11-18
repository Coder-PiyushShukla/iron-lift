"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Leaflet default marker fix
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// Component to handle smooth map movement
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 14, { duration: 1.5 })
    }
  }, [center, map])
  return null
}

export default function GymMap({ 
  center, 
  gyms = [], 
  onGymClick 
}: { 
  center: [number, number]
  gyms: any[]
  onGymClick: (gym: any) => void 
}) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
    >
      {/* Official OpenStreetMap Tile Layer - 100% Free, No API Key Required */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="osm-tiles"
      />
      
      {gyms.map((gym: any) => (
        <Marker 
          key={gym.id || `${gym.lat}-${gym.lng}`} 
          position={[gym.lat, gym.lng]} 
          icon={icon}
          eventHandlers={{
            click: () => onGymClick(gym),
          }}
        >
          <Popup className="text-zinc-950 font-bold">
            <div>{gym.name}</div>
            {gym.address && <div className="text-xs font-normal text-zinc-600 mt-0.5">{gym.address}</div>}
          </Popup>
        </Marker>
      ))}
      
      <MapUpdater center={center} />
    </MapContainer>
  )
}
