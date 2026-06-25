import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  Award,
  Star,
  Plus,
  Bookmark,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const categories = ["Semua", "Terbaru", "Trending", "Populer", "Premium"];

const posts = [
  {
    id: 1,
    author: { name: "Rina Wijaya", initials: "RW", badge: "PRO" },
    title: "Logo Brand Kopi Nusantara",
    image: "/logo-kreasi-creative.png",
    likes: 456,
    comments: 89,
    views: 2340,
    time: "2 jam lalu",
    tags: ["Logo", "Branding"],
    liked: false,
    saved: false,
  },
  {
    id: 2,
    author: { name: "Ahmad Fauzi", initials: "AF", badge: null },
    title: "Instagram Feed Aesthetic Summer",
    image: "/template-sosmed-set.jpg",
    likes: 892,
    comments: 156,
    views: 5670,
    time: "5 jam lalu",
    tags: ["Social Media", "Feed"],
    liked: false,
    saved: false,
  },
  {
    id: 3,
    author: { name: "Dewi Kusuma", initials: "DK", badge: "PRO" },
    title: "T-Shirt Design Urban Street",
    image: "/feature-print.png",
    likes: 1234,
    comments: 234,
    views: 8900,
    time: "8 jam lalu",
    tags: ["Merchandise", "T-Shirt"],
    liked: false,
    saved: false,
  },
  {
    id: 4,
    author: { name: "Budi Santoso", initials: "BS", badge: null },
    title: "Event Poster Jakarta Festival 2026",
    image: "/feature-editor.png",
    likes: 345,
    comments: 67,
    views: 1890,
    time: "1 hari lalu",
    tags: ["Poster", "Event"],
    liked: false,
    saved: false,
  },
  {
    id: 5,
    author: { name: "Siti Rahayu", initials: "SR", badge: "PRO" },
    title: "UI Kit Dashboard Analytics",
    image: "/mockup-dashboard-light.jpg",
    likes: 789,
    comments: 123,
    views: 4560,
    time: "1 hari lalu",
    tags: ["UI/UX", "Dashboard"],
    liked: false,
    saved: false,
  },
  {
    id: 6,
    author: { name: "Dimas Pratama", initials: "DP", badge: null },
    title: "3D Illustration Character Pack",
    image: "/showcase-collage.jpg",
    likes: 1567,
    comments: 289,
    views: 12300,
    time: "2 hari lalu",
    tags: ["3D", "Ilustrasi"],
    liked: false,
    saved: false,
  },
];

const topContributors = [
  { name: "Dewi Kusuma", initials: "DK", contributions: 156, badge: "Gold" },
  { name: "Rina Wijaya", initials: "RW", contributions: 134, badge: "Silver" },
  { name: "Ahmad Fauzi", initials: "AF", contributions: 112, badge: "Bronze" },
  { name: "Siti Rahayu", initials: "SR", contributions: 98, badge: null },
  { name: "Budi Santoso", initials: "BS", contributions: 87, badge: null },
];

const tags = ["Logo", "Social Media", "Poster", "UI/UX", "Ilustrasi", "3D", "Merchandise", "Branding", "Typography", "Photo Editing"];

export default function Community() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: number) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#1A1A2E] to-[#0a0a1a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-[#FF6584]/20 text-[#FF6584] border-0 mb-4">
            <Users className="w-3 h-3 mr-1" />
            50,000+ Kreator
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Komunitas Kreator
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Terhubung, berbagi, dan kolaborasi dengan kreator Indonesia
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Kreator", value: "50K+", icon: Users },
            { label: "Desain Dibagikan", value: "120K+", icon: Share2 },
            { label: "Like Diberikan", value: "2.5M+", icon: Heart },
            { label: "Komentar", value: "480K+", icon: MessageCircle },
          ].map((stat, i) => (
            <Card key={i} className="bg-[#12122a] border-purple-500/10">
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#6C63FF]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-xs">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Cari desain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#12122a] border-purple-500/20 text-white placeholder:text-gray-500"
            />
          </div>
          <Link to="/editor">
            <Button className="gradient-primary text-white border-0">
              <Plus className="w-4 h-4 mr-2" />
              Bagikan Karya
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === cat
                  ? "bg-purple-500/20 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Posts Grid */}
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-[#12122a] border-purple-500/10 card-hover overflow-hidden group"
                >
                  <div className="relative">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {post.author.badge && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {post.author.badge}
                      </Badge>
                    )}
                    <button
                      onClick={() => toggleSave(post.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          savedPosts.has(post.id)
                            ? "text-[#6C63FF] fill-[#6C63FF]"
                            : "text-white"
                        }`}
                      />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="gradient-primary text-white text-xs font-bold">
                          {post.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {post.author.name}
                        </p>
                        <p className="text-gray-500 text-xs">{post.time}</p>
                      </div>
                    </div>

                    <h3 className="text-white font-medium text-sm group-hover:text-[#6C63FF] transition-colors mb-2">
                      {post.title}
                    </h3>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-[#1a1a3a] text-gray-400 border-0 text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-purple-500/10">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center space-x-1 text-gray-400 hover:text-[#FF6584] transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              likedPosts.has(post.id)
                                ? "text-[#FF6584] fill-[#FF6584]"
                                : ""
                            }`}
                          />
                          <span className="text-xs">
                            {post.likes +
                              (likedPosts.has(post.id) ? 1 : 0)}
                          </span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-[#6C63FF] transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs">{post.comments}</span>
                        </button>
                        <span className="flex items-center space-x-1 text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">
                            {(post.views / 1000).toFixed(1)}K
                          </span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <Card className="bg-[#12122a] border-purple-500/10">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-[#6C63FF]" />
                  Top Kreator
                </h3>
                <div className="space-y-3">
                  {topContributors.map((c, i) => (
                    <div
                      key={c.name}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span className="text-[#6C63FF] font-bold text-sm w-5">
                        {i + 1}
                      </span>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="gradient-primary text-white text-xs font-bold">
                          {c.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">
                          {c.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {c.contributions} karya
                        </p>
                      </div>
                      {c.badge && (
                        <Star
                          className={`w-4 h-4 ${
                            c.badge === "Gold"
                              ? "text-yellow-400 fill-yellow-400"
                              : c.badge === "Silver"
                              ? "text-gray-300 fill-gray-300"
                              : "text-orange-400 fill-orange-400"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="bg-[#12122a] border-purple-500/10">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-[#6C63FF]" />
                  Tag Populer
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-[#1a1a3a] text-gray-400 text-xs hover:bg-purple-500/20 hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
