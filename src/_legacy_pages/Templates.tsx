import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Heart,
  Eye,
  Sparkles,
  Star,
  Image,
  FileText,
  Video,
  Presentation,
  Shirt,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Semua", icon: Sparkles, count: 10420 },
  { name: "Social Media", icon: Instagram, count: 3420 },
  { name: "Presentasi", icon: Presentation, count: 1850 },
  { name: "Logo", icon: Image, count: 2100 },
  { name: "Poster", icon: FileText, count: 1200 },
  { name: "Video", icon: Video, count: 890 },
  { name: "Merchandise", icon: Shirt, count: 960 },
];

const templates = [
  { id: 1, name: "Paket Konten Instagram", category: "Social Media", likes: 245, views: 1200, premium: false, image: "/template-sosmed-set.jpg", size: "1080x1080" },
  { id: 2, name: "Business Presentation", category: "Presentasi", likes: 189, views: 890, premium: false, image: "/templates-showcase.jpg", size: "1920x1080" },
  { id: 3, name: "Minimalist Logo", category: "Logo", likes: 567, views: 3400, premium: true, image: "/feature-marketplace.png", size: "1000x1000" },
  { id: 4, name: "Poster Promosi Brand", category: "Poster", likes: 334, views: 2100, premium: false, image: "/poster-promosi.jpg", size: "1080x1350" },
  { id: 5, name: "YouTube Thumbnail", category: "Video", likes: 445, views: 2800, premium: true, image: "/showcase-collage.jpg", size: "1280x720" },
  { id: 6, name: "T-Shirt Design", category: "Merchandise", likes: 223, views: 1100, premium: false, image: "/feature-print.png", size: "3000x3000" },
  { id: 7, name: "Instagram Story Campaign", category: "Social Media", likes: 678, views: 4200, premium: false, image: "/banner-hero-retro.jpg", size: "1080x1920" },
  { id: 8, name: "Pitch Deck Pro", category: "Presentasi", likes: 156, views: 780, premium: true, image: "/feature-templates.png", size: "1920x1080" },
  { id: 9, name: "Brand Identity", category: "Logo", likes: 445, views: 2300, premium: true, image: "/feature-community.png", size: "1000x1000" },
  { id: 10, name: "Music Poster", category: "Poster", likes: 289, views: 1500, premium: false, image: "/feature-editor.png", size: "1080x1350" },
  { id: 11, name: "TikTok Cover", category: "Video", likes: 534, views: 3100, premium: false, image: "/showcase-collage.jpg", size: "1080x1920" },
  { id: 12, name: "Tote Bag Design", category: "Merchandise", likes: 178, views: 900, premium: true, image: "/feature-print.png", size: "3000x3000" },
];

const sortOptions = ["Terpopuler", "Terbaru", "Trending", "Gratis"];

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Terpopuler");
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = templates.filter((t) => {
    const matchCategory = activeCategory === "Semua" || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#1A1A2E] to-[#0a0a1a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
            <Star className="w-3 h-3 mr-1" />
            10,000+ Template
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Template Siap Pakai
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Pilih dari ribuan template profesional, kustomisasi dalam hitungan menit
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Cari template..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#12122a] border-purple-500/20 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            {sortOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  sortBy === opt
                    ? "bg-purple-500/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                activeCategory === cat.name
                  ? "gradient-primary text-white shadow-lg"
                  : "bg-[#12122a] text-gray-400 hover:text-white border border-purple-500/10"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{cat.name}</span>
              <span
                className={`text-xs ${
                  activeCategory === cat.name ? "text-white/70" : "text-gray-500"
                }`}
              >
                {cat.count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((template) => (
            <Card
              key={template.id}
              className="bg-[#12122a] border-purple-500/10 card-hover overflow-hidden group"
            >
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {template.premium && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    <Star className="w-3 h-3 mr-1" />
                    PRO
                  </Badge>
                )}
                <button
                  onClick={() => toggleLike(template.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      liked.has(template.id)
                        ? "text-red-500 fill-red-500"
                        : "text-white"
                    }`}
                  />
                </button>
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-black/50 text-white border-0 text-xs">
                    {template.size}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium text-sm group-hover:text-[#6C63FF] transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {template.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-500/10">
                  <div className="flex items-center space-x-3 text-gray-400 text-xs">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{template.views.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{template.likes.toLocaleString()}</span>
                    </span>
                  </div>
                  <Link to="/editor">
                    <Button
                      size="sm"
                      className="gradient-primary text-white border-0 text-xs"
                    >
                      Gunakan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
