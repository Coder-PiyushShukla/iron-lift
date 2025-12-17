"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { Dumbbell, MapPin, ScanLine, Calculator, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Dumbbell },
    { name: "Gym Map", href: "/gyms", icon: MapPin },
    { name: "Scanner", href: "/scanner", icon: ScanLine },
    { name: "Setup", href: "/onboarding", icon: Settings }, // <--- ADDED THIS
  ]

  return (
    <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Dumbbell size={18} />
            </div>
            <span>IRON<span className="text-red-600">LIFT</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`text-zinc-400 hover:text-white hover:bg-zinc-800 ${
                      isActive ? "bg-zinc-800 text-white font-bold" : ""
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9 border border-zinc-700">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback className="bg-red-600 text-white font-bold">
                        {session.user?.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-white" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session.user?.name}</p>
                      <p className="text-xs text-zinc-400">{session.user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  
                  {/* Quick Access to Setup in Dropdown too */}
                  <Link href="/onboarding">
                    <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Update Goals
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer text-red-500 font-bold" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn()} className="bg-red-600 hover:bg-red-700 font-bold">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}