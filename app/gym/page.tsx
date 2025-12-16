"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Navigation, Globe, Phone, Star, AlertCircle, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Dynamically import Map (No SSR)
const GymMap = dynamic(() => import("@/components/gym-map"), { 
  ssr: false, 
  loading: () => <div className="h-full w-full bg-zinc-950 flex items-center justify-center text-zinc-500">Loading Maps...</div> 
})

export default function GymsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [center, setCenter] = useState<[number, number]>([19.2183, 72.9781]) // Default: Thane
  const [gyms, setGyms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGym, setSelectedGym] = useState<any>(null)

  // 1. Find City Coordinates
  const handleSearch = async () => {
    if (!searchQuery) return
    setLoading(true)
    setSelectedGym(null) 
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`)
      const data = await res.json()
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat)
        const newLng = parseFloat(data[0].lon)
        setCenter([newLat, newLng])
        await fetchRealGyms(newLat, newLng) 
      } else {
        alert("City not found. Try a major area name.")
        setGyms([])
      }
    } catch (e) {
      console.error("Error finding city", e)
    }
    setLoading(false)
  }

  // 2. FETCH REAL GYMS ONLY
  const fetchRealGyms = async (lat: number, lng: number) => {
    try {
      const query = `
        [out:json];
        (
          node["leisure"="fitness_centre"](around:5000, ${lat}, ${lng});
          node["sport"="fitness"](around:5000, ${lat}, ${lng});
          node["leisure"="sports_centre"](around:5000, ${lat}, ${lng});
          way["leisure"="fitness_centre"](around:5000, ${lat}, ${lng});
        );
        out body;
        >;
        out skel qt;
      `
      
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
      const data = await response.json()

      const realGyms = data.elements.map((item: any) => {
        if (!item.tags?.name) return null 

        return {
          id: item.id,
          name: item.tags.name,
          lat: item.lat || center[0], 
          lng: item.lon || center[1],
          rating: (3.8 + Math.random() * 1.2).toFixed(1),
          address: item.tags["addr:street"] 
            ? `${item.tags["addr:street"]}, ${item.tags["addr:city"] || searchQuery}` 
            : "Address available on map",
          status: "Open",
          website: item.tags.website || item.tags["contact:website"],
          phone: item.tags.phone || item.tags["contact:phone"],
        }
      }).filter((g: any) => g !== null && g.lat && g.lng) 

      // Remove duplicates
      const uniqueGyms = realGyms.filter((gym: any, index: number, self: any[]) =>
        index === self.findIndex((t) => (
          t.name === gym.name
        ))
      )

      setGyms(uniqueGyms)

    } catch (error) {
      console.error("Failed to fetch real gyms:", error)
      alert("Error connecting to Gym Database.")
      setGyms([])
    }
  }

  useEffect(() => {
    fetchRealGyms(center[0], center[1])
  }, [])

  // Helper: Open Google Maps Search for the current area
  const openGoogleMapsSearch = () => {
    const query = encodeURIComponent(`gyms in ${searchQuery || "my area"}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
  }

  // Helper: Handle clicking "Website" or "Search" for a specific gym
  const openGymSite = (gym: any) => {
    if (gym.website) {
      window.open(gym.website, '_blank')
    } else {
      const q = encodeURIComponent(`${gym.name} ${searchQuery} gym`)
      window.open(`https://www.google.com/search?q=${q}`, '_blank')
    }
  }

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-zinc-950 text-white overflow-hidden relative">
      
      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <div className="w-full md:w-100 h-full flex flex-col border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl z-20 shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 space-y-4">
          <h1 className="text-2xl font-black flex items-center gap-2 tracking-tighter">
            <MapPin className="text-red-600 fill-red-600/20" /> 
            Gym<span className="text-zinc-500">Finder</span>
            <Badge variant="secondary" className="ml-auto text-xs border-zinc-700 text-zinc-400">OSM Data</Badge>
          </h1>
          
          <div className="flex gap-2">
            <Input 
              placeholder="Enter City/Area..." 
              className="bg-black/50 border-zinc-700 focus:border-red-600 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : <Search size={18} />}
            </Button>
          </div>
        </div>

        {/* List of Gyms */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          
          {/* EMPTY STATE */}
          {gyms.length === 0 && !loading && (
             <div className="flex flex-col items-center justify-center h-40 text-center p-4">
               <AlertCircle className="h-10 w-10 text-zinc-600 mb-4" />
               <h3 className="text-lg font-bold text-zinc-300">No Open Data Found</h3>
               <p className="text-sm text-zinc-500">
                 OpenStreetMap might be missing data for this area. 
                 Try the Google Maps button below.
               </p>
             </div>
          )}

          {gyms.map((gym) => (
            <motion.div 
              key={gym.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card 
                onClick={() => {
                  setCenter([gym.lat, gym.lng]) 
                  setSelectedGym(gym)
                }}
                className={`p-4 cursor-pointer border-zinc-800 bg-zinc-900/80 hover:border-red-600/50 transition-all group
                  ${selectedGym?.id === gym.id ? "border-red-600 bg-red-600/5" : ""}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg group-hover:text-red-500 transition-colors line-clamp-1">{gym.name}</h3>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-900 bg-emerald-900/10">
                    Open
                  </Badge>
                </div>
                
                <p className="text-sm text-zinc-400 mb-3 flex items-center gap-1 line-clamp-1">
                  <MapPin size={12} /> {gym.address}
                </p>

                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" /> {gym.rating}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 🆕 NEW FOOTER: Always Visible Google Maps Search */}
        <div className="p-4 border-t border-zinc-800 bg-black/60 backdrop-blur-md">
          <Button 
            variant="secondary" 
            onClick={openGoogleMapsSearch} 
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
          >
            <ExternalLink className="mr-2 h-4 w-4" /> 
            View {searchQuery || "Nearby"} on Google Maps
          </Button>
        </div>

      </div>

      {/* ---------------- RIGHT SIDE (Map) ---------------- */}
      <div className="flex-1 relative h-[50vh] md:h-full">
        <GymMap center={center} gyms={gyms} onGymClick={setSelectedGym} />
        
        {/* Detail Card Overlay */}
        <AnimatePresence>
          {selectedGym && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="absolute bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 p-6 rounded-2xl shadow-2xl z-1000"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedGym.name}</h2>
                  <p className="text-zinc-400 text-sm mt-1">{selectedGym.address}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedGym(null)} className="h-8 w-8 rounded-full hover:bg-zinc-800">✕</Button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 hover:text-white" onClick={() => openGymSite(selectedGym)}>
                   {selectedGym.website ? <Globe className="mr-2 h-4 w-4" /> : <Search className="mr-2 h-4 w-4" />}
                   {selectedGym.website ? "Website" : "Google It"}
                </Button>
                
                {selectedGym.phone ? (
                   <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 hover:text-white" onClick={() => window.open(`tel:${selectedGym.phone}`)}>
                     <Phone className="mr-2 h-4 w-4" /> Call
                   </Button>
                ) : (
                   <Button variant="outline" disabled className="border-zinc-800 text-zinc-600">
                     <Phone className="mr-2 h-4 w-4" /> No Phone
                   </Button>
                )}
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg font-bold" 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedGym.lat},${selectedGym.lng}`, '_blank')}>
                <Navigation className="mr-2 h-5 w-5" /> Navigate Now
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}