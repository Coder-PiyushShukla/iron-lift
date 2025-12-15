"use client"

import { useState } from "react"
import { glossaryTerms } from "@/lib/glossary-data"
import { motion, AnimatePresence } from "framer-motion"
import { Search, BookOpen, Dumbbell, Activity, Flame, Zap, Brain, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"

// 🧠 Smart Function: Assigns icons based on the keyword
const getIcon = (term: string) => {
  const lower = term.toLowerCase()
  if (lower.includes("hypertrophy") || lower.includes("muscle")) return Dumbbell
  if (lower.includes("caloric") || lower.includes("macros") || lower.includes("nutrition")) return Flame
  if (lower.includes("failure") || lower.includes("overload") || lower.includes("progressive")) return Activity
  if (lower.includes("eccentric") || lower.includes("concentric")) return Zap
  return BookOpen // Default icon
}

export default function LearnPage() {
  const [search, setSearch] = useState("")
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  // Filter logic for the search bar
  const filteredTerms = glossaryTerms.filter(item =>
    item.term.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-100 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-6 mb-16 relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center justify-center p-4 bg-red-600/10 rounded-full mb-2 ring-1 ring-red-600/20"
        >
          <Brain className="w-8 h-8 text-red-500" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold tracking-tight text-white"
        >
          Iron <span className="text-red-600">Knowledge</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Don't just lift the weight. Understand it. Master the terminology to master your body.
        </motion.p>
        
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-xl mx-auto mt-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input 
            placeholder="Search for a term (e.g., 'Hypertrophy')..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500 rounded-2xl text-lg backdrop-blur-md transition-all hover:bg-zinc-900/80"
          />
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <AnimatePresence>
          {filteredTerms.map((item, index) => {
            const Icon = getIcon(item.term)
            const isExpanded = expandedIndex === index

            return (
              <motion.div
                key={item.term}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className={`group cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isExpanded 
                    ? 'bg-zinc-900 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.2)] col-span-1 md:col-span-2' 
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/60'
                  }
                `}
              >
                <div className="p-6 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors duration-300 ${isExpanded ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400 group-hover:text-white'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className={`text-xl font-bold transition-colors ${isExpanded ? 'text-white' : 'text-gray-200'}`}>
                      {item.term}
                    </h3>
                  </div>
                  <div className={`p-2 rounded-full bg-zinc-800/50 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-red-600/20 text-red-500' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-8"
                    >
                      <div className="w-full h-px bg-zinc-800 mb-6" />
                      <div className="text-gray-300 leading-8 whitespace-pre-line text-lg font-light">
                        {item.definition}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredTerms.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg">No terms found matching "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}