import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Layers,
  Shirt,
  Store,
  Users,
  ArrowRight,
  Download,
  Share2,
  CheckCircle,
  Eye,
  Palette,
  MonitorSmartphone,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ────── HERO ────── */
function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-16">
      <img
        src="/banner-hero-futuristic.jpg"
        alt="DESAIN TANPA BATAS"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060612]/95 via-[#0a0a1a]/75 to-[#0a0a1a]/25" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0f0f2a] to-transparent" />

      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl space-y-8">
          <Badge className="bg-purple-500/20 text-purple-100 border-purple-400/30 px-4 py-1.5 text-sm">
            <Sparkles className="w-4 h-4 mr-1" />
            Ekosistem desain grafis all-in-one
          </Badge>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none">
            DESAIN TANPA BATAS
          </h1>

          <p className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
            Buat desain profesional, pilih template siap pakai, cetak produk,
            dan jual aset kreatif dalam satu platform untuk kreator Indonesia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/editor">
              <Button className="gradient-primary text-white border-0 text-lg px-8 py-6 hover:opacity-90 glow-purple">
                <Sparkles className="w-5 h-5 mr-2" />
                Mulai Desain Gratis
              </Button>
            </Link>
            <Link to="/templates">
              <Button
                variant="outline"
                className="border-white/30 bg-black/20 text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                <Layers className="w-5 h-5 mr-2" />
                Jelajahi Template
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-xl pt-4">
            {[
              ["10K+", "Template"],
              ["8K+", "Aset"],
              ["PNG/PDF/SVG", "Export"],
            ].map(([value, label]) => (
              <div key={label} className="glass rounded-lg px-4 py-3">
                <p className="text-white font-bold">{value}</p>
                <p className="text-gray-300 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────── STATS ────── */
function Stats() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: "50,000+", label: "Kreator Aktif", icon: Users },
    { value: "10,000+", label: "Template", icon: Layers },
    { value: "1M+", label: "Desain Dibuat", icon: Sparkles },
    { value: "500+", label: "Aset Marketplace", icon: Store },
  ];

  return (
    <section ref={statsRef} className="bg-[#0f0f2a] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="w-8 h-8 text-[#6C63FF] mx-auto mb-3" />
              <p className="text-3xl md:text-4xl font-black text-white">
                {stat.value}
              </p>
              <p className="text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────── FEATURES ────── */
function Features() {
  const features = [
    {
      title: "Editor Drag & Drop",
      desc: "Buat desain profesional tanpa pengalaman coding. Cukup drag dan drop elemen ke kanvas.",
      icon: Layers,
      image: "/feature-editor.png",
      color: "#6C63FF",
    },
    {
      title: "Ribuan Template",
      desc: "Pilih dari 10,000+ template siap pakai untuk social media, logo, poster, dan lainnya.",
      icon: Sparkles,
      image: "/feature-templates.png",
      color: "#FF6584",
    },
    {
      title: "Print on Demand",
      desc: "Cetak desainmu ke t-shirt, mug, tote bag, poster, dan merchandise lainnya.",
      icon: Shirt,
      image: "/feature-print.png",
      color: "#00D4AA",
    },
    {
      title: "Marketplace Aset",
      desc: "Beli dan jual font, icon, ilustrasi, template, dan aset kreatif lainnya.",
      icon: Store,
      image: "/feature-marketplace.png",
      color: "#6C63FF",
    },
    {
      title: "Komunitas Kreator",
      desc: "Terhubung dengan kreator lain, bagikan karya, dan kolaborasi dalam proyek.",
      icon: Users,
      image: "/feature-community.png",
      color: "#FF6584",
    },
    {
      title: "Export & Share",
      desc: "Download desain dalam format PNG, JPG, PDF, atau SVG. Share langsung ke sosial media.",
      icon: Share2,
      image: "/devices-mockup.png",
      color: "#00D4AA",
    },
  ];

  return (
    <section className="bg-[#0a0a1a] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
            Fitur Lengkap
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Semua yang Kamu Butuhkan
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Satu platform untuk semua kebutuhan desain grafismu. Dari ide hingga
            produk jadi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="bg-[#12122a] border-purple-500/10 card-hover overflow-hidden group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-40 mb-6 bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl group-hover:from-purple-500/10 transition-all">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-32 object-contain drop-shadow-lg group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon
                      className="w-5 h-5"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandSystem() {
  const logos = [
    {
      title: "Modern Gradient",
      desc: "Logo utama untuk header, aplikasi, favicon, dan loading screen.",
      image: "/logo-kreasi-modern.png",
      icon: Palette,
    },
    {
      title: "Dashboard Reference",
      desc: "Arah UI dashboard dengan sidebar, grid proyek, aktivitas, dan statistik.",
      image: "/mockup-dashboard-dark.jpg",
      icon: MonitorSmartphone,
    },
    {
      title: "Marketing & Template",
      desc: "Poster promosi dan template sosial media sebagai materi kampanye dan library.",
      image: "/poster-promosi.jpg",
      icon: PackageCheck,
    },
  ];

  return (
    <section className="bg-[#0f0f2a] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 mb-4">
            Implementasi Dokumen
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Identitas Visual KREASI
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl">
            Aset dari dokumen konsep dipakai langsung sebagai fondasi brand,
            homepage, dashboard, library template, marketplace, dan materi promosi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {logos.map((item) => (
            <Card key={item.title} className="bg-[#12122a] border-purple-500/10 overflow-hidden">
              <div className="h-56 bg-[#1a1a3a] flex items-center justify-center overflow-hidden">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#6C63FF]" />
                  </div>
                  <h3 className="text-white font-bold">{item.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────── HOW IT WORKS ────── */
function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Pilih Template",
      desc: "Pilih dari ribuan template profesional atau mulai dari nol",
      icon: Layers,
    },
    {
      step: "02",
      title: "Kustomisasi",
      desc: "Edit warna, teks, gambar, dan elemen dengan drag-and-drop",
      icon: Sparkles,
    },
    {
      step: "03",
      title: "Download & Share",
      desc: "Simpan, download, atau bagikan desainmu ke media sosial",
      icon: Download,
    },
  ];

  return (
    <section className="bg-[#0f0f2a] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 mb-4">
            Cara Kerja
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Mudah & Cepat
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tiga langkah sederhana untuk membuat desain profesional
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative text-center">
              <div className="w-20 h-20 mx-auto mb-6 gradient-primary rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                <s.icon className="w-10 h-10 text-white" />
              </div>
              <span className="text-5xl font-black text-purple-500/20 absolute top-0 right-8">
                {s.step}
              </span>
              <h3 className="text-2xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────── SHOWCASE ────── */
function Showcase() {
  return (
    <section className="bg-[#0a0a1a] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 mb-4">
            Inspirasi
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Karya dari Komunitas
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Lihat apa yang telah dibuat oleh kreator KREASI
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="/showcase-collage.jpg"
            alt="Community Showcase"
            className="w-full rounded-2xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Jelajahi Karya Terbaik
              </h3>
              <p className="text-gray-300">
                Temukan inspirasi dari ribuan desain kreator Indonesia
              </p>
            </div>
            <Link to="/community">
              <Button className="gradient-primary text-white border-0">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────── BLOG ────── */
function Blog() {
  const articles = [
    {
      title: "10 Tips Desain Logo yang Memukau",
      category: "Tutorial",
      readTime: "5 menit",
      image: "/templates-showcase.jpg",
    },
    {
      title: "Cara Membuat Feed Instagram yang Estetik",
      category: "Social Media",
      readTime: "7 menit",
      image: "/showcase-collage.jpg",
    },
    {
      title: "Panduan Lengkap Print on Demand",
      category: "Bisnis",
      readTime: "10 menit",
      image: "/feature-print.png",
    },
  ];

  return (
    <section className="bg-[#0f0f2a] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
            Blog
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Tips & Tutorial
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Pelajari teknik desain terbaru dan tingkatkan skill kreatifmu
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <Card
              key={i}
              className="bg-[#12122a] border-purple-500/10 card-hover overflow-hidden group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#6C63FF] text-white border-0">
                    {article.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 text-gray-400 text-sm mb-3">
                  <Eye className="w-4 h-4" />
                  <span>{article.readTime} baca</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#6C63FF] transition-colors">
                  {article.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────── CTA ────── */
function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 gradient-primary" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          Mulai Kreasimu Sekarang
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Bergabung dengan 50,000+ kreator Indonesia. Buat desain profesional
          gratis, tanpa kartu kredit.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button className="bg-white text-[#6C63FF] hover:bg-white/90 text-lg px-8 py-6 font-bold">
              Daftar Gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/templates">
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Jelajahi Template
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center space-x-6 mt-8 text-white/70 text-sm">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>Gratis Selamanya</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>Tanpa Kartu Kredit</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>1000+ Template</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────── HOME PAGE ────── */
export default function Home() {
  return (
    <div>
      <Hero />
      <Stats />
      <Features />
      <BrandSystem />
      <HowItWorks />
      <Showcase />
      <Blog />
      <CTA />
    </div>
  );
}
