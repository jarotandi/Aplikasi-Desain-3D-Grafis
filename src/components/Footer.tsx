import { Link } from "react-router-dom";
import {
  Palette,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Heart,
} from "lucide-react";

const footerLinks = {
  produk: [
    { name: "Editor Desain", path: "/editor" },
    { name: "Template", path: "/templates" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Print on Demand", path: "/print" },
  ],
  perusahaan: [
    { name: "Tentang Kami", path: "#" },
    { name: "Blog", path: "#" },
    { name: "Karir", path: "#" },
    { name: "Hubungi Kami", path: "#" },
  ],
  dukungan: [
    { name: "Pusat Bantuan", path: "#" },
    { name: "Tutorial", path: "#" },
    { name: "Kebijakan Privasi", path: "#" },
    { name: "Syarat & Ketentuan", path: "#" },
  ],
  komunitas: [
    { name: "Komunitas", path: "/community" },
    { name: "Discord", path: "#" },
    { name: "Facebook Group", path: "#" },
    { name: "Events", path: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0a0a1a] border-t border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                KREASI
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Ekosistem desain grafis all-in-one untuk kreator Indonesia. Desain,
              cetak, dan jual karya Anda dalam satu platform.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-[#6C63FF]" />
                <span>hello@kreasi.id</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-[#6C63FF]" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-[#6C63FF]" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 text-sm hover:text-[#6C63FF] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social & Copyright */}
        <div className="mt-16 pt-8 border-t border-purple-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#6C63FF] transition-all"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#6C63FF] transition-all"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#6C63FF] transition-all"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#6C63FF] transition-all"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          <p className="text-gray-500 text-sm text-center flex items-center gap-1">
            &copy; {new Date().getFullYear()} KREASI. Dibuat dengan
            <Heart className="w-4 h-4 text-[#FF6584] fill-[#FF6584]" />
            di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
