"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Navigation, Globe, Phone, Star, AlertCircle, ExternalLink, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const GymMap = dynamic(() => import("@/components/gym-map"), { 
  ssr: false, 
  loading: () => <div className="h-full w-full bg-zinc-950 flex items-center justify-center text-zinc-500">Loading OpenStreetMap...</div> 
})

export default function GymsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [center, setCenter] = useState<[number, number]>([19.2183, 72.9781]) // Default coordinates
  const [gyms, setGyms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGym, setSelectedGym] = useState<any>(null)

  // Fetch gyms using OpenStreetMap (server-side proxy fixes CORS and 406 errors)
  const fetchOpenStreetMapGyms = useCallback(async (lat: number, lng: number, queryText?: string) => {
    setLoading(true)
    setSelectedGym(null)
    try {
      const params = new URLSearchParams()
      params.set("lat", lat.toString())
      params.set("lng", lng.toString())
      if (queryText) {
        params.set("query", queryText)
      }

      const res = await fetch(`/api/gyms?${params.toString()}`)
      const data = await res.json()

      if (data.center && Array.isArray(data.center)) {
        setCenter(data.center as [number, number])
      }

      setGyms(data.gyms || [])
    } catch (e) {
      console.error("Error loading OpenStreetMap gyms:", e)
      setGyms([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setLoading(true)
    setSelectedGym(null)

    try {
      // Use OpenStreetMap Nominatim
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat)
        const newLng = parseFloat(data[0].lon)
        setCenter([newLat, newLng])
        await fetchOpenStreetMapGyms(newLat, newLng, searchQuery)
      } else {
        alert("City or area not found in OpenStreetMap. Try another name.")
        setGyms([])
      }
    } catch (e) {
      console.error("Error searching OpenStreetMap location:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOpenStreetMapGyms(center[0], center[1])
  }, [fetchOpenStreetMapGyms])

  const openGoogleMapsSearch = () => {
    const query = encodeURIComponent(`gyms in ${searchQuery || "my area"}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
  }

  const openGymOnGoogleMaps = (gym: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const query = encodeURIComponent(`${gym.name} ${gym.address || searchQuery || ""}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
  }

  const openGymSite = (gym: any) => {
    if (gym.website) {
      window.open(gym.website, "_blank")
    } else {
      const q = encodeURIComponent(`${gym.name} ${searchQuery} gym`)
      window.open(`https://www.google.com/search?q=${q}`, "_blank")
    }
  }

  return (
    // Note: Adjusted height to h-[calc(100dvh-4rem)] so the 64px navbar does not push the bottom button off screen
    <div className="h-[calc(100dvh-4rem)] w-full flex flex-col md:flex-row bg-zinc-950 text-white overflow-hidden relative">
      
      {/* Sidebar */}
      <div className="w-full md:w-105 h-full flex flex-col border-r border-zinc-800 bg-zinc-900/60 backdrop-blur-xl z-20 shadow-2xl">
        
        <div className="p-5 border-b border-zinc-800 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black flex items-center gap-2 tracking-tighter">
              <MapPin className="text-red-600 fill-red-600/20" /> 
              Gym<span className="text-zinc-500">Finder</span>
            </h1>
            <Badge variant="secondary" className="text-xs border-zinc-700 bg-zinc-800 text-zinc-300">
              OpenStreetMap
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Input 
              placeholder="Enter City/Area..." 
              className="bg-black/50 border-zinc-700 focus:border-red-600 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading} className="bg-red-600 hover:bg-red-700 shrink-0">
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Search size={18} />}
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>{gyms.length} OpenStreetMap gyms found</span>
            <button
              onClick={openGoogleMapsSearch}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 font-medium transition-colors"
            >
              <ExternalLink size={12} /> Open in Google Maps
            </button>
          </div>
        </div>

        {/* Scrollable Gym List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-0">
          
          {gyms.length === 0 && !loading && (
             <div className="flex flex-col items-center justify-center h-48 text-center p-4 bg-zinc-950/40 rounded-xl border border-zinc-800/60">
               <AlertCircle className="h-10 w-10 text-zinc-500 mb-3" />
               <h3 className="text-base font-bold text-zinc-300">No Open Data Found</h3>
               <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                 OpenStreetMap might be missing data for this area. 
                 Try searching on Google Maps below.
               </p>
               <Button 
                 onClick={openGoogleMapsSearch} 
                 className="mt-4 bg-red-600 hover:bg-red-700 text-white text-xs h-9"
               >
                 <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open Google Maps Directory
               </Button>
             </div>
          )}

          {gyms.map((gym) => (
            <motion.div 
              key={gym.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card 
                onClick={() => {
                  setCenter([gym.lat, gym.lng]) 
                  setSelectedGym(gym)
                }}
                className={`p-4 cursor-pointer border-zinc-800 bg-zinc-900/80 hover:border-red-600/50 transition-all group rounded-xl
                  ${selectedGym?.id === gym.id ? "border-red-600 bg-red-600/10 shadow-lg shadow-red-950/40" : ""}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg group-hover:text-red-500 transition-colors line-clamp-1">{gym.name}</h3>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-900 bg-emerald-900/10 shrink-0">
                    Open
                  </Badge>
                </div>
                
                <p className="text-sm text-zinc-400 mb-3 flex items-center gap-1 line-clamp-1">
                  <MapPin size={12} className="text-red-500 shrink-0" /> {gym.address}
                </p>

                <div className="flex items-center justify-between text-sm font-medium">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" /> {gym.rating}
                  </div>

                  <button
                    onClick={(e) => openGymOnGoogleMaps(gym, e)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800/80 hover:bg-zinc-700 px-2 py-1 rounded transition-colors"
                    title="View this gym on Google Maps"
                  >
                    <ExternalLink size={11} className="text-red-500" /> Google Maps
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pinned Bottom Action - Always Visible */}
        <div className="p-4 border-t border-zinc-800 bg-black/80 backdrop-blur-md shrink-0">
          <Button 
            variant="secondary" 
            onClick={openGoogleMapsSearch} 
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 shadow-lg h-10 font-semibold text-sm"
          >
            <ExternalLink className="mr-2 h-4 w-4 text-red-500" /> 
            Open {searchQuery || "Nearby"} on Google Maps
          </Button>
        </div>

      </div>

      {/* Map Canvas */}
      <div className="flex-1 relative h-[50vh] md:h-full">
        <GymMap center={center} gyms={gyms} onGymClick={setSelectedGym} />
        
        {/* Floating Detail Card */}
        <AnimatePresence>
          {selectedGym && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="absolute bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 p-6 rounded-2xl shadow-2xl z-1000"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedGym.name}</h2>
                  <p className="text-zinc-400 text-sm mt-1">{selectedGym.address}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedGym(null)} className="h-8 w-8 rounded-full hover:bg-zinc-800">✕</Button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 hover:text-white" onClick={() => openGymSite(selectedGym)}>
                   {selectedGym.website ? <Globe className="mr-2 h-4 w-4" /> : <Search className="mr-2 h-4 w-4" />}
                   {selectedGym.website ? "Website" : "Search Info"}
                </Button>
                
                {selectedGym.phone ? (
                   <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 hover:text-white" onClick={() => window.open(`tel:${selectedGym.phone}`)}>
                     <Phone className="mr-2 h-4 w-4" /> Call
                   </Button>
                ) : (
                   <Button 
                     variant="outline" 
                     className="border-zinc-700 hover:bg-zinc-800 hover:text-white text-xs"
                     onClick={(e) => openGymOnGoogleMaps(selectedGym, e)}
                   >
                     <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-red-500" /> Google Maps
                   </Button>
                )}
              </div>

              <Button 
                className="w-full bg-red-600 hover:bg-red-700 h-12 text-base font-bold shadow-lg shadow-red-900/40" 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedGym.lat},${selectedGym.lng}`, '_blank')}
              >
                <Navigation className="mr-2 h-5 w-5" /> Start Google Maps Navigation
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
