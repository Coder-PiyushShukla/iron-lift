import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dumbbell } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center relative overflow-hidden">
      
       
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />

      {/* Glassmorphism Card */}
      <Card className="w-95 z-10 bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-2">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">IronLift</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access the ecosystem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input id="email" placeholder="beast@gym.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-primary hover:bg-red-700 text-white font-bold transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            Login
          </Button>
          <p className="text-xs text-center text-gray-500">
            Don't have an account? <span className="text-primary cursor-pointer hover:underline">Sign Up</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}