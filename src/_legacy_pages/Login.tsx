import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Palette,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LogIn,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login
    localStorage.setItem("user", JSON.stringify({ email, name: "Demo User" }));
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center pt-16 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Palette className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">
              KREASI
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-6 mb-2">
            Selamat Datang Kembali
          </h1>
          <p className="text-gray-400">Masuk ke akun KREASI-mu</p>
        </div>

        <Card className="bg-[#12122a]/80 border-purple-500/20 backdrop-blur-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#1a1a3a] border-purple-500/20 text-white placeholder:text-gray-500 focus:border-[#6C63FF] focus:ring-[#6C63FF]/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-[#1a1a3a] border-purple-500/20 text-white placeholder:text-gray-500 focus:border-[#6C63FF] focus:ring-[#6C63FF]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-400">
                  <input
                    type="checkbox"
                    className="rounded border-purple-500/20 bg-[#1a1a3a] text-[#6C63FF]"
                  />
                  <span>Ingat saya</span>
                </label>
                <Link
                  to="#"
                  className="text-[#6C63FF] hover:text-[#FF6584] transition-colors"
                >
                  Lupa password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-white border-0 py-6 hover:opacity-90"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Masuk
              </Button>
            </form>

            <div className="relative my-6">
              <Separator className="bg-purple-500/20" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-[#12122a] px-3 text-xs text-gray-500">
                atau masuk dengan
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-[#6C63FF] hover:text-[#FF6584] font-medium transition-colors"
          >
            Daftar Gratis
            <ArrowRight className="w-4 h-4 inline ml-1" />
          </Link>
        </p>
      </div>
    </div>
  );
}
