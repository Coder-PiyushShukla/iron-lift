"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlayCircle } from "lucide-react"

interface VideoModalProps {
  exerciseName: string;
  searchQuery: string;
}

export function VideoModal({ exerciseName, searchQuery }: VideoModalProps) {
   
  const videoUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(searchQuery)}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-colors bg-primary/10 px-3 py-1.5 rounded-full cursor-pointer">
          <PlayCircle className="w-4 h-4" /> Watch Tutorial
        </button>
      </DialogTrigger>
      
      
      <DialogContent className="bg-zinc-900 border-white/10 sm:max-w-150 p-0 overflow-hidden text-white">
        <DialogHeader className="p-4 bg-zinc-900/50 backdrop-blur-md absolute z-10 w-full top-0 left-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
             <PlayCircle className="text-primary w-5 h-5" /> 
             {exerciseName}
          </DialogTitle>
        </DialogHeader>
        
         
        <div className="aspect-video w-full mt-0 bg-black">
          <iframe
            width="100%"
            height="100%"
            src={videoUrl}
            title={exerciseName}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  )
}