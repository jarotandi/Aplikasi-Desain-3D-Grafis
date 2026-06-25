import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Layout,
  LogIn,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Beranda", path: "/" },
  { name: "Template", path: "/templates" },
  { name: "Marketplace", path: "/marketplace" },
  { name: "Print", path: "/print" },
  { name: "Komunitas", path: "/community" },
];

const createLinks = [
  { name: "Desain Baru", path: "/editor", icon: Sparkles },
  { name: "Dari Template", path: "/templates", icon: Layout },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src="/logo-kreasi-modern.png"
              alt="KREASI"
              className="h-10 w-10 object-contain group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-bold text-white tracking-wide">
              KREASI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* Create Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCreateOpen(!createOpen)}
                className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buat</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${createOpen ? "rotate-180" : ""}`}
                />
              </button>
              {createOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#1A1A2E] border border-purple-500/30 rounded-lg shadow-xl py-1 z-50">
                  {createLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setCreateOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-purple-500/20 transition-colors"
                    >
                      <link.icon className="w-4 h-4 text-[#6C63FF]" />
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.path)
                    ? "text-white bg-purple-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/login"
              className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
            <Link to="/register">
              <Button className="gradient-primary text-white border-0 hover:opacity-90 text-sm">
                Daftar Gratis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1A1A2E]/95 backdrop-blur-lg border-t border-purple-500/20">
          <div className="px-4 py-4 space-y-2">
            {createLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg"
              >
                <link.icon className="w-5 h-5 text-[#6C63FF]" />
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="border-t border-purple-500/20 my-2" />
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive(link.path)
                    ? "text-white bg-purple-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-purple-500/20 my-2" />
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-300 hover:text-white"
            >
              <LogIn className="w-5 h-5" />
              <span>Masuk</span>
            </Link>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              <Button className="w-full gradient-primary text-white border-0">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
