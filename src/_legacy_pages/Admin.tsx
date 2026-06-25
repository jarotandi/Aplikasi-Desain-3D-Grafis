import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  ShoppingBag,
  Printer,
  Settings,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ChevronRight,
  Shield,
  Ban,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 45000000, orders: 320 },
  { month: "Feb", revenue: 52000000, orders: 380 },
  { month: "Mar", revenue: 48000000, orders: 350 },
  { month: "Apr", revenue: 61000000, orders: 420 },
  { month: "Mei", revenue: 68000000, orders: 480 },
  { month: "Jun", revenue: 75000000, orders: 520 },
];

const categoryData = [
  { name: "Social Media", value: 35, color: "#6C63FF" },
  { name: "Logo", value: 25, color: "#FF6584" },
  { name: "Merchandise", value: 20, color: "#00D4AA" },
  { name: "Poster", value: 12, color: "#FFD700" },
  { name: "Lainnya", value: 8, color: "#8884d8" },
];

const recentUsers = [
  { id: 1, name: "Rina Wijaya", email: "rina@email.com", status: "active", designs: 24, joined: "2 jam lalu", initials: "RW" },
  { id: 2, name: "Ahmad Fauzi", email: "ahmad@email.com", status: "active", designs: 56, joined: "5 jam lalu", initials: "AF" },
  { id: 3, name: "Dewi Kusuma", email: "dewi@email.com", status: "premium", designs: 134, joined: "1 hari lalu", initials: "DK" },
  { id: 4, name: "Budi Santoso", email: "budi@email.com", status: "active", designs: 12, joined: "2 hari lalu", initials: "BS" },
  { id: 5, name: "Siti Rahayu", email: "siti@email.com", status: "premium", designs: 89, joined: "3 hari lalu", initials: "SR" },
];

const recentOrders = [
  { id: "ORD-001", product: "T-Shirt Premium", customer: "Rina Wijaya", amount: 120000, status: "completed", date: "2 jam lalu" },
  { id: "ORD-002", product: "Mug Keramik", customer: "Ahmad Fauzi", amount: 75000, status: "processing", date: "5 jam lalu" },
  { id: "ORD-003", product: "Sticker Vinyl", customer: "Dewi Kusuma", amount: 15000, status: "completed", date: "8 jam lalu" },
  { id: "ORD-004", product: "Tote Bag", customer: "Budi Santoso", amount: 85000, status: "pending", date: "1 hari lalu" },
  { id: "ORD-005", product: "Poster Art", customer: "Siti Rahayu", amount: 45000, status: "completed", date: "1 hari lalu" },
];

const adminNav = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Pengguna", icon: Users },
  { name: "Desain", icon: FolderOpen },
  { name: "Marketplace", icon: ShoppingBag },
  { name: "Print Order", icon: Printer },
  { name: "Analytics", icon: BarChart3 },
  { name: "Pengaturan", icon: Settings },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              <div className="glass-dark rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Admin Panel</p>
                    <p className="text-gray-400 text-xs">Super Admin</p>
                  </div>
                </div>
              </div>
              {adminNav.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    activeTab === item.name
                      ? "bg-purple-500/20 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">{activeTab}</h1>
                <p className="text-gray-400 mt-1">
                  {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Cari..."
                    className="pl-10 bg-[#12122a] border-purple-500/20 text-white placeholder:text-gray-500 w-48"
                  />
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-0">
                  Online
                </Badge>
              </div>
            </div>

            {activeTab === "Dashboard" && (
              <>
                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Pengguna", value: "50,420", change: "+12%", up: true, icon: Users, color: "#6C63FF" },
                    { label: "Pendapatan Bulan Ini", value: "Rp 75M", change: "+8.5%", up: true, icon: DollarSign, color: "#00D4AA" },
                    { label: "Total Desain", value: "142,800", change: "+15%", up: true, icon: FolderOpen, color: "#FF6584" },
                    { label: "Order Print", value: "2,340", change: "-2%", up: false, icon: Printer, color: "#FFD700" },
                  ].map((stat, i) => (
                    <Card key={i} className="bg-[#12122a] border-purple-500/10 card-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-xs">{stat.label}</p>
                            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                            <div className="flex items-center mt-1">
                              {stat.up ? (
                                <ArrowUpRight className="w-3 h-3 text-green-400" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3 text-red-400" />
                              )}
                              <span className={`text-xs ${stat.up ? "text-green-400" : "text-red-400"}`}>
                                {stat.change}
                              </span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-[#12122a] border-purple-500/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Pendapatan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={revenueData}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" tickFormatter={(v) => `Rp ${v / 1000000}M`} />
                          <Tooltip contentStyle={{ background: "#12122a", border: "1px solid #6C63FF33", borderRadius: "8px", color: "#fff" }} formatter={(value: number) => [`Rp ${(value / 1000000).toFixed(0)}M`, "Pendapatan"]} />
                          <Area type="monotone" dataKey="revenue" stroke="#6C63FF" fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#12122a] border-purple-500/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Kategori Populer</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: "#12122a", border: "1px solid #6C63FF33", borderRadius: "8px", color: "#fff" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Users */}
                <Card className="bg-[#12122a] border-purple-500/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">Pengguna Terbaru</CardTitle>
                      <Button variant="ghost" className="text-[#6C63FF] text-sm hover:bg-purple-500/10">
                        Lihat Semua <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-gray-400 text-xs border-b border-purple-500/10">
                            <th className="text-left py-3 px-4">Pengguna</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Desain</th>
                            <th className="text-left py-3 px-4">Bergabung</th>
                            <th className="text-left py-3 px-4">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentUsers.map((user) => (
                            <tr key={user.id} className="border-b border-purple-500/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="gradient-primary text-white text-xs">{user.initials}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-white text-sm font-medium">{user.name}</p>
                                    <p className="text-gray-500 text-xs">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={`${user.status === "premium" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"} border-0 text-xs`}>
                                  {user.status === "premium" ? "Premium" : "Aktif"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-white text-sm">{user.designs}</td>
                              <td className="py-3 px-4 text-gray-400 text-sm">{user.joined}</td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-1">
                                  <button className="p-1.5 rounded hover:bg-green-500/10 text-gray-400 hover:text-green-400"><CheckCircle className="w-4 h-4" /></button>
                                  <button className="p-1.5 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Ban className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="bg-[#12122a] border-purple-500/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">Order Print Terbaru</CardTitle>
                      <Button variant="ghost" className="text-[#6C63FF] text-sm hover:bg-purple-500/10">
                        Lihat Semua <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-gray-400 text-xs border-b border-purple-500/10">
                            <th className="text-left py-3 px-4">Order ID</th>
                            <th className="text-left py-3 px-4">Produk</th>
                            <th className="text-left py-3 px-4">Pelanggan</th>
                            <th className="text-left py-3 px-4">Total</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Waktu</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="border-b border-purple-500/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 text-white text-sm font-mono">{order.id}</td>
                              <td className="py-3 px-4 text-white text-sm">{order.product}</td>
                              <td className="py-3 px-4 text-gray-400 text-sm">{order.customer}</td>
                              <td className="py-3 px-4 text-white text-sm">Rp {order.amount.toLocaleString()}</td>
                              <td className="py-3 px-4">
                                <Badge className={`border-0 text-xs ${order.status === "completed" ? "bg-green-500/20 text-green-400" : order.status === "processing" ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                  {order.status === "completed" ? "Selesai" : order.status === "processing" ? "Proses" : "Pending"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-gray-400 text-sm">{order.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab !== "Dashboard" && (
              <Card className="bg-[#12122a] border-purple-500/10">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Settings className="w-10 h-10 text-[#6C63FF]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Segera Hadir</h2>
                  <p className="text-gray-400">Fitur ini sedang dalam pengembangan</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
