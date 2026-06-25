import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  TrendingUp,
  Settings,
  Sparkles,
  Plus,
  Clock,
  Download,
  Share2,
  Edit3,
  Trash2,
  Eye,
  Heart,
  Image,
  FileText,
  Shirt,
  ShoppingBag,
  ChevronRight,
  Award,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Jan", desain: 12, views: 240 },
  { name: "Feb", desain: 19, views: 380 },
  { name: "Mar", desain: 25, views: 520 },
  { name: "Apr", desain: 32, views: 680 },
  { name: "Mei", desain: 28, views: 750 },
  { name: "Jun", desain: 45, views: 920 },
];

const recentProjects = [
  {
    id: 1,
    name: "Logo Brand Coffee",
    type: "Logo",
    date: "2 jam lalu",
    image: "/feature-marketplace.png",
    icon: Image,
  },
  {
    id: 2,
    name: "Instagram Post Summer",
    type: "Social Media",
    date: "5 jam lalu",
    image: "/feature-templates.png",
    icon: FileText,
  },
  {
    id: 3,
    name: "T-Shirt Design Urban",
    type: "Merchandise",
    date: "1 hari lalu",
    image: "/feature-print.png",
    icon: Shirt,
  },
  {
    id: 4,
    name: "Event Poster Jakarta",
    type: "Poster",
    date: "2 hari lalu",
    image: "/feature-editor.png",
    icon: FileText,
  },
];

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Proyek Saya", icon: FolderOpen, path: "/dashboard?tab=projects" },
  { name: "Marketplace", icon: ShoppingBag, path: "/marketplace" },
  { name: "Print Order", icon: Shirt, path: "/print" },
  { name: "Analytics", icon: TrendingUp, path: "/dashboard?tab=analytics" },
  { name: "Pengaturan", icon: Settings, path: "/dashboard?tab=settings" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("kreasi-theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(
      stored
        ? JSON.parse(stored)
        : { name: "Demo Kreator", email: "demo@kreasi.id" }
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("kreasi-theme", theme);
  }, [theme]);

  if (!user) return null;

  const isLight = theme === "light";
  const pageBg = isLight ? "bg-[#F8F9FA]" : "bg-[#0a0a1a]";
  const panel = isLight ? "bg-white border-gray-200" : "bg-[#12122a] border-purple-500/10";
  const softPanel = isLight ? "bg-[#F3F4F6]" : "bg-[#1a1a3a]";
  const textMain = isLight ? "text-[#1A1A2E]" : "text-white";
  const textSub = isLight ? "text-gray-600" : "text-gray-400";

  return (
    <div className={`min-h-screen ${pageBg} pt-16 transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              <div className={`${isLight ? "bg-white border-gray-200" : "glass-dark"} rounded-xl p-4 mb-6 border`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className={`${textMain} font-semibold text-sm`}>
                      {user.name}
                    </p>
                    <p className={`${textSub} text-xs`}>{user.email}</p>
                  </div>
                </div>
                <Badge className="mt-3 bg-[#6C63FF] text-white border-0 text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Free Plan
                </Badge>
              </div>

              {sidebarItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.path.includes("?tab=")) {
                      setActiveTab(item.path.split("=")[1]);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    (item.path === "/dashboard" && activeTab === "overview") ||
                    item.path.includes(activeTab)
                      ? "bg-purple-500/20 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}

              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/");
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Welcome */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold ${textMain}`}>
                  Halo, {user.name?.split(" ")[0] || "Kreator"}!
                </h1>
                <p className={`${textSub} mt-1`}>
                  Dashboard mengikuti rekomendasi mockup dark/light dari dokumen
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTheme(isLight ? "dark" : "light")}
                  className={`h-10 w-10 rounded-lg border flex items-center justify-center ${
                    isLight
                      ? "bg-white border-gray-200 text-[#1A1A2E]"
                      : "bg-[#12122a] border-purple-500/20 text-gray-300"
                  }`}
                  title="Toggle tema"
                >
                  {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
                <Link to="/editor">
                  <Button className="gradient-primary text-white border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Desain Baru
                  </Button>
                </Link>
              </div>
            </div>

            <Card className={`${panel} overflow-hidden`}>
              <CardContent className="p-0">
                <img
                  src={isLight ? "/mockup-dashboard-light.jpg" : "/mockup-dashboard-dark.jpg"}
                  alt="Referensi dashboard KREASI"
                  className="h-64 w-full object-cover"
                />
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Desain", value: "24", icon: FolderOpen, color: "#6C63FF" },
                { label: "Views", value: "3.5K", icon: Eye, color: "#00D4AA" },
                { label: "Likes", value: "1.2K", icon: Heart, color: "#FF6584" },
                { label: "Downloads", value: "856", icon: Download, color: "#6C63FF" },
              ].map((stat, i) => (
                <Card
                  key={i}
                  className={`${panel} card-hover`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`${textSub} text-xs`}>{stat.label}</p>
                        <p className={`text-2xl font-bold ${textMain} mt-1`}>
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <stat.icon
                          className="w-5 h-5"
                          style={{ color: stat.color }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Chart */}
            <Card className={panel}>
              <CardHeader className="pb-2">
                <CardTitle className={`${textMain} text-lg flex items-center`}>
                  <TrendingUp className="w-5 h-5 mr-2 text-[#6C63FF]" />
                  Statistik Bulanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorDesain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        background: "#12122a",
                        border: "1px solid #6C63FF33",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="desain"
                      stroke="#6C63FF"
                      fillOpacity={1}
                      fill="url(#colorDesain)"
                      name="Desain"
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#00D4AA"
                      fillOpacity={1}
                      fill="url(#colorViews)"
                      name="Views"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card className={panel}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className={`${textMain} text-lg flex items-center`}>
                    <Clock className="w-5 h-5 mr-2 text-[#6C63FF]" />
                    Proyek Terbaru
                  </CardTitle>
                  <button className="text-[#6C63FF] text-sm hover:underline flex items-center">
                    Lihat Semua
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className={`group flex items-start space-x-4 p-4 rounded-xl ${softPanel} transition-colors cursor-pointer`}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`${textMain} font-medium text-sm truncate group-hover:text-[#6C63FF] transition-colors`}>
                          {project.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs border-purple-500/30 text-gray-400"
                          >
                            {project.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {project.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-purple-500/20 text-gray-400 hover:text-[#6C63FF]">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-purple-500/20 text-gray-400 hover:text-[#6C63FF]">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/editor">
                <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/20 card-hover cursor-pointer h-full">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        Buat Desain Baru
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Mulai dari template atau kosong
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/templates">
                <Card className="bg-gradient-to-br from-teal-600/20 to-blue-600/20 border-teal-500/20 card-hover cursor-pointer h-full">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl gradient-teal-purple flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        Jelajahi Template
                      </h3>
                      <p className="text-gray-400 text-sm">
                        10,000+ template siap pakai
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/marketplace">
                <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/20 card-hover cursor-pointer h-full">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        Marketplace
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Beli & jual aset kreatif
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
