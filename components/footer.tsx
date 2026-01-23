import Link from "next/link"
import { Dumbbell, Github, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
                <Dumbbell size={18} />
              </div>
              <span>IRON<span className="text-red-600">LIFT</span></span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The world's most advanced AI fitness companion. 
              Built for athletes who demand precision and progress.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors"><Twitter size={20} /></Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors"><Github size={20} /></Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors"><Instagram size={20} /></Link>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-bold mb-4 text-white">Product</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="/planner" className="hover:text-red-500 transition-colors">AI Planner</Link></li>
              <li><Link href="/scanner" className="hover:text-red-500 transition-colors">Food Scanner</Link></li>
              <li><Link href="/gyms" className="hover:text-red-500 transition-colors">Gym Finder</Link></li>
              <li><Link href="/dashboard" className="hover:text-red-500 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-bold mb-4 text-white">Company</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="font-bold mb-4 text-white">Legal</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} IronLift Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            All Systems Operational
          </div>
        </div>
      </div>
    </footer>
  )
}