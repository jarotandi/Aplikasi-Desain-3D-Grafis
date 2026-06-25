import { useState } from "react";
import {
  Shirt,
  Coffee,
  ShoppingBag,
  Sticker,
  Badge,
  Image,
  Upload,
  CheckCircle,
  Truck,
  Shield,
  Star,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";

const products = [
  {
    id: 1,
    name: "T-Shirt Premium",
    price: 120000,
    desc: "Katun combed 30s, print DTG",
    icon: Shirt,
    image: "/feature-print.png",
    colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#00FF00"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 2,
    name: "Mug Keramik",
    price: 75000,
    desc: "Keramik premium, 325ml",
    icon: Coffee,
    image: "/feature-editor.png",
    colors: ["#FFFFFF", "#000000", "#FF6B6B", "#4ECDC4"],
    sizes: ["325ml"],
  },
  {
    id: 3,
    name: "Tote Bag",
    price: 85000,
    desc: "Kanvas premium, resleting",
    icon: ShoppingBag,
    image: "/feature-marketplace.png",
    colors: ["#F5F5DC", "#000000", "#8B4513", "#FFFFFF"],
    sizes: ["Medium", "Large"],
  },
  {
    id: 4,
    name: "Sticker Vinyl",
    price: 15000,
    desc: "Vinyl waterproof, die-cut",
    icon: Sticker,
    image: "/feature-templates.png",
    colors: ["#Transparent", "#White"],
    sizes: ["5cm", "8cm", "10cm"],
  },
  {
    id: 5,
    name: "Pin Button",
    price: 20000,
    desc: "Metal pin, 58mm",
    icon: Badge,
    image: "/showcase-collage.jpg",
    colors: ["#Silver", "#Gold"],
    sizes: ["32mm", "44mm", "58mm"],
  },
  {
    id: 6,
    name: "Poster Art",
    price: 45000,
    desc: "Art paper 260gsm, laminasi",
    icon: Image,
    image: "/poster-promosi.jpg",
    colors: ["#Matte", "#Glossy"],
    sizes: ["A4", "A3", "A2"],
  },
];

const processSteps = [
  { title: "Upload Desain", desc: "Upload desain atau pilih dari galeri", icon: Upload },
  { title: "Pilih Produk", desc: "T-Shirt, mug, tote bag, dll", icon: Shirt },
  { title: "Checkout", desc: "Pembayaran aman", icon: CheckCircle },
  { title: "Dikirim", desc: "Ke seluruh Indonesia", icon: Truck },
];

export default function Print() {
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const product = products[selectedProduct];
  const total = product.price * quantity;

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#1A1A2E] to-[#0a0a1a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <UIBadge className="bg-[#00D4AA]/20 text-[#00D4AA] border-0 mb-4">
            <Truck className="w-3 h-3 mr-1" />
            Gratis Ongkir
          </UIBadge>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Print on Demand
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cetak desainmu ke produk berkualitas. Dari T-shirt, mug, tote bag, hingga poster.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* How It Works */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {processSteps.map((step, i) => (
            <div key={i} className="text-center p-4">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl gradient-primary flex items-center justify-center">
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-gray-400 text-xs">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Product Selector */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-white font-semibold mb-4">Pilih Produk</h3>
            {products.map((p, i) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProduct(i);
                  setSelectedColor(0);
                  setSelectedSize(0);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  selectedProduct === i
                    ? "bg-purple-500/20 text-white border border-[#6C63FF]/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <p.icon className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    Rp {p.price.toLocaleString()}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-[#12122a] border-purple-500/10 overflow-hidden">
              <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-80 object-contain rounded-xl"
                  />
                  {uploadedImage && (
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="Design"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upload */}
            <div className="mt-4">
              <label className="flex items-center justify-center p-6 border-2 border-dashed border-purple-500/20 rounded-xl cursor-pointer hover:border-purple-500/50 transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    Upload desain atau drag & drop
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setUploadedImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{product.name}</h2>
              <p className="text-gray-400 text-sm mt-1">{product.desc}</p>
              <div className="flex items-center space-x-2 mt-3">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-sm">4.9</span>
                <span className="text-gray-500 text-sm">(2,340 review)</span>
              </div>
            </div>

            <div className="border-t border-purple-500/10 pt-6">
              <h3 className="text-white font-medium mb-3">Warna</h3>
              <div className="flex gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(i)}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor === i
                        ? "border-[#6C63FF] scale-110"
                        : "border-transparent"
                    }`}
                    style={{
                      backgroundColor: c === "Transparent" ? "transparent" : c === "Matte" ? "#e0e0e0" : c === "Glossy" ? "#f0f0f0" : c,
                      border: c === "Transparent" || c === "White" || c === "Matte" || c === "Glossy" ? "2px solid #444" : undefined,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-purple-500/10 pt-6">
              <h3 className="text-white font-medium mb-3">Ukuran</h3>
              <div className="flex gap-2">
                {product.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(i)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedSize === i
                        ? "bg-[#6C63FF] text-white"
                        : "bg-[#1a1a3a] text-gray-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-purple-500/10 pt-6">
              <h3 className="text-white font-medium mb-3">Jumlah</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-[#1a1a3a] flex items-center justify-center text-white hover:bg-[#222250]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-bold text-xl w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(100, quantity + 1))}
                  className="w-10 h-10 rounded-lg bg-[#1a1a3a] flex items-center justify-center text-white hover:bg-[#222250]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-purple-500/10 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Harga Satuan</span>
                <span className="text-white">
                  Rp {product.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Jumlah</span>
                <span className="text-white">{quantity} pcs</span>
              </div>
              <div className="flex items-center justify-between border-t border-purple-500/10 pt-4">
                <span className="text-white font-semibold">Total</span>
                <span className="text-2xl font-bold text-[#6C63FF]">
                  Rp {total.toLocaleString()}
                </span>
              </div>
              <Button className="w-full gradient-primary text-white border-0 py-6 text-lg">
                Pesan Sekarang
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
              <div className="flex items-center justify-center space-x-4 text-gray-500 text-xs">
                <span className="flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Garansi
                </span>
                <span className="flex items-center">
                  <Truck className="w-3 h-3 mr-1" />
                  Gratis Ongkir
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Kualitas Premium
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
