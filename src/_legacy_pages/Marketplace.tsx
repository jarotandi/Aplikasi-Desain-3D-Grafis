import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Star,
  Heart,
  TrendingUp,
  Award,
  ArrowRight,
  Package,
  Type,
  Image,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const assetCategories = [
  { name: "Semua", icon: Sparkles, count: 8420 },
  { name: "Ilustrasi", icon: Image, count: 3200 },
  { name: "Icon Set", icon: Layers, count: 2100 },
  { name: "Font", icon: Type, count: 890 },
  { name: "Mockup", icon: Package, count: 1230 },
  { name: "Template", icon: Sparkles, count: 1000 },
];

const assets = [
  { id: 1, name: "KREASI Modern Logo Kit", creator: "Dewi Studio", price: 50000, originalPrice: 75000, rating: 4.9, sales: 2340, category: "Ilustrasi", image: "/logo-kreasi-modern.png", tags: ["logo", "brand"], featured: true },
  { id: 2, name: "Minimal Icon Set 200+", creator: "PixelCraft", price: 35000, originalPrice: 50000, rating: 4.8, sales: 1890, category: "Icon Set", image: "/feature-templates.png", tags: ["icon", "minimal"], featured: false },
  { id: 3, name: "Handwritten Font Bundle", creator: "TypeFoundry", price: 120000, originalPrice: 180000, rating: 4.9, sales: 890, category: "Font", image: "/feature-marketplace.png", tags: ["font", "script"], featured: true },
  { id: 4, name: "T-Shirt Mockup Kit", creator: "MockupMaster", price: 85000, originalPrice: 120000, rating: 4.7, sales: 1560, category: "Mockup", image: "/feature-print.png", tags: ["mockup", "t-shirt"], featured: false },
  { id: 5, name: "Social Media Template Vol.1", creator: "CreativeID", price: 45000, originalPrice: 65000, rating: 4.8, sales: 3120, category: "Template", image: "/template-sosmed-set.jpg", tags: ["social media", "template"], featured: true },
  { id: 6, name: "3D Illustration Pack", creator: "Dimensi Studio", price: 150000, originalPrice: 200000, rating: 5.0, sales: 670, category: "Ilustrasi", image: "/showcase-collage.jpg", tags: ["3d", "illustration"], featured: true },
  { id: 7, name: "UI Icon System", creator: "UIVault", price: 25000, originalPrice: 40000, rating: 4.6, sales: 2780, category: "Icon Set", image: "/templates-showcase.jpg", tags: ["ui", "icon"], featured: false },
  { id: 8, name: "Vintage Campaign Pack", creator: "RetroType", price: 95000, originalPrice: 140000, rating: 4.8, sales: 920, category: "Template", image: "/banner-hero-retro.jpg", tags: ["vintage", "campaign"], featured: false },
  { id: 9, name: "Device Mockup Bundle", creator: "TechMockup", price: 110000, originalPrice: 160000, rating: 4.9, sales: 1340, category: "Mockup", image: "/devices-mockup.png", tags: ["device", "mockup"], featured: true },
];

const topCreators = [
  { name: "Dewi Studio", sales: "12.5K", avatar: "DS", items: 45 },
  { name: "PixelCraft", sales: "8.2K", avatar: "PC", items: 78 },
  { name: "TypeFoundry", sales: "6.8K", avatar: "TF", items: 23 },
  { name: "CreativeID", sales: "9.1K", avatar: "CI", items: 56 },
  { name: "Dimensi Studio", sales: "5.4K", avatar: "DM", items: 34 },
];

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = assets.filter((a) => {
    const matchCat = activeCategory === "Semua" || a.category === activeCategory;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.tags.some(t => t.includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#1A1A2E] to-[#0a0a1a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-[#6C63FF]/20 text-[#6C63FF] border-0 mb-4">
              <ShoppingBag className="w-3 h-3 mr-1" />
              8,420+ Aset Kreatif
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Marketplace Kreatif
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Beli dan jual aset desain berkualitas dari kreator Indonesia
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Cari aset kreatif..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#12122a] border-purple-500/20 text-white placeholder:text-gray-500"
            />
          </div>
          <Link to="/editor">
            <Button className="gradient-primary text-white border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              Jual Karyamu
            </Button>
          </Link>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {assetCategories.map((cat) => (
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
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Assets Grid */}
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((asset) => (
                <Card
                  key={asset.id}
                  className="bg-[#12122a] border-purple-500/10 card-hover overflow-hidden group"
                >
                  <div className="relative">
                    <div className="h-44 overflow-hidden">
                      <img
                        src={asset.image}
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {asset.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-white border-0 text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      {asset.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-black/50 text-white border-0 text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-white font-medium text-sm group-hover:text-[#6C63FF] transition-colors">
                      {asset.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      by {asset.creator}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-[#6C63FF] font-bold">
                          Rp {asset.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-xs line-through">
                          Rp {asset.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <span className="text-xs text-gray-400">
                          {asset.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-500/10">
                      <span className="text-gray-500 text-xs">
                        {asset.sales.toLocaleString()} terjual
                      </span>
                      <Button
                        size="sm"
                        className="bg-[#00D4AA] hover:bg-[#00D4AA]/80 text-white border-0 text-xs h-8"
                      >
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Beli
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Creators */}
            <Card className="bg-[#12122a] border-purple-500/10">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-[#6C63FF]" />
                  Top Kreator
                </h3>
                <div className="space-y-3">
                  {topCreators.map((creator, i) => (
                    <div
                      key={creator.name}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span className="text-[#6C63FF] font-bold text-sm w-5">
                        {i + 1}
                      </span>
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xs">
                        {creator.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">
                          {creator.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {creator.sales} penjualan
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Promo Banner */}
            <Card className="bg-gradient-to-br from-purple-600 to-pink-500 border-0 overflow-hidden">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-white mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-2">
                  Jadi Kreator
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Jual karyamu dan dapatkan penghasilan
                </p>
                <Link to="/editor">
                  <Button className="bg-white text-[#6C63FF] hover:bg-white/90 font-semibold">
                    Mulai Jual
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
