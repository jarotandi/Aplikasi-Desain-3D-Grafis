import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Type,
  Image,
  Square,
  Circle,
  Triangle,
  Palette,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Layers,
  Trash2,
  MousePointer,
  Save,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Grid3X3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface CanvasElement {
  id: string;
  type: "text" | "image" | "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  color: string;
  fontSize?: number;
  shape?: "rect" | "circle" | "triangle";
}

const toolbarTabs = [
  {
    name: "Teks",
    icon: Type,
    items: ["Heading", "Subheading", "Body", "Caption"],
  },
  {
    name: "Gambar",
    icon: Image,
    items: ["Upload", "Galeri", "Unsplash", "Icons"],
  },
  {
    name: "Bentuk",
    icon: Square,
    items: ["Kotak", "Lingkaran", "Segitiga", "Garis"],
  },
  { name: "Elemen", icon: Sparkles, items: ["Frame", "Sticker", "Line", "Pattern"] },
];

const fonts = ["Inter", "Poppins", "Montserrat", "Playfair", "Roboto"];
const colors = ["#6C63FF", "#FF6584", "#00D4AA", "#FFD700", "#FF6B35", "#1A1A2E", "#FFFFFF", "#000000"];

export default function Editor() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Teks");
  const [zoom, setZoom] = useState(100);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const selected = elements.find((e) => e.id === selectedId);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addElement = (type: CanvasElement["type"], defaults: Partial<CanvasElement> = {}) => {
    const el: CanvasElement = {
      id: generateId(),
      type,
      x: 100 + elements.length * 20,
      y: 100 + elements.length * 20,
      width: type === "text" ? 200 : 100,
      height: type === "text" ? 40 : 100,
      content: type === "text" ? "Teks Baru" : "",
      color: "#1A1A2E",
      fontSize: type === "text" ? 24 : undefined,
      shape: type === "shape" ? "rect" : undefined,
      ...defaults,
    };
    setElements([...elements, el]);
    setSelectedId(el.id);
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragEnd = (e: React.MouseEvent) => {
    if (!draggedId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setElements(
      elements.map((el) =>
        el.id === draggedId ? { ...el, x: Math.max(0, Math.min(90, x)), y: Math.max(0, Math.min(90, y)) } : el
      )
    );
    setDraggedId(null);
  };

  const updateSelected = (updates: Partial<CanvasElement>) => {
    if (!selectedId) return;
    setElements(
      elements.map((el) =>
        el.id === selectedId ? { ...el, ...updates } : el
      )
    );
  };

  return (
    <div className="h-screen bg-[#0a0a1a] flex flex-col pt-16" onMouseUp={handleDragEnd}>
      {/* Top Bar */}
      <div className="h-14 bg-[#12122a] border-b border-purple-500/10 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Desain Tanpa Judul</span>
          </div>
          <Badge className="bg-[#6C63FF]/20 text-[#6C63FF] border-0 text-xs">
            1080 x 1080px
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-[#1a1a3a] rounded-lg px-2">
            <button
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              className="p-1.5 text-gray-400 hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-gray-400 text-sm w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="p-1.5 text-gray-400 hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/20 text-gray-300 hover:bg-purple-500/10"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/20 text-gray-300 hover:bg-purple-500/10"
          >
            <Redo className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            className="gradient-primary text-white border-0"
          >
            <Save className="w-4 h-4 mr-1" />
            Simpan
          </Button>
          <Button
            size="sm"
            className="bg-[#00D4AA] hover:bg-[#00D4AA]/80 text-white border-0"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-16 bg-[#12122a] border-r border-purple-500/10 flex flex-col items-center py-4 space-y-2">
          {toolbarTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center space-y-0.5 transition-colors ${
                activeTab === tab.name
                  ? "bg-purple-500/20 text-[#6C63FF]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[9px]">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Panel Content */}
        <div className="w-64 bg-[#0f0f2a] border-r border-purple-500/10 p-4 overflow-y-auto">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            {activeTab}
            <ChevronRight className="w-4 h-4 ml-1" />
          </h3>

          {activeTab === "Teks" && (
            <div className="space-y-3">
              {toolbarTabs[0].items.map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    addElement("text", {
                      content: item,
                      fontSize:
                        item === "Heading"
                          ? 48
                          : item === "Subheading"
                          ? 32
                          : item === "Body"
                          ? 18
                          : 14,
                    })
                  }
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[#1a1a3a] hover:bg-[#222250] text-gray-300 hover:text-white transition-colors"
                >
                  <Type className="w-4 h-4 text-[#6C63FF]" />
                  <span className="text-sm">{item}</span>
                </button>
              ))}
              <div className="mt-6">
                <p className="text-gray-400 text-xs mb-2">Font</p>
                <select className="w-full bg-[#1a1a3a] border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm">
                  {fonts.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "Gambar" && (
            <div className="space-y-3">
              {toolbarTabs[1].items.map((item) => (
                <button
                  key={item}
                  onClick={() => addElement("image")}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[#1a1a3a] hover:bg-[#222250] text-gray-300 hover:text-white transition-colors"
                >
                  <Image className="w-4 h-4 text-[#00D4AA]" />
                  <span className="text-sm">{item}</span>
                </button>
              ))}
              <div className="mt-4 p-4 rounded-lg border-2 border-dashed border-purple-500/20 text-center">
                <Image className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  Drop gambar di sini
                </p>
              </div>
            </div>
          )}

          {activeTab === "Bentuk" && (
            <div className="space-y-3">
              <button
                onClick={() => addElement("shape", { shape: "rect", width: 120, height: 120 })}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[#1a1a3a] hover:bg-[#222250] text-gray-300 hover:text-white transition-colors"
              >
                <Square className="w-4 h-4 text-[#FF6584]" />
                <span className="text-sm">Kotak</span>
              </button>
              <button
                onClick={() => addElement("shape", { shape: "circle", width: 120, height: 120 })}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[#1a1a3a] hover:bg-[#222250] text-gray-300 hover:text-white transition-colors"
              >
                <Circle className="w-4 h-4 text-[#FF6584]" />
                <span className="text-sm">Lingkaran</span>
              </button>
              <button
                onClick={() => addElement("shape", { shape: "triangle", width: 120, height: 120 })}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[#1a1a3a] hover:bg-[#222250] text-gray-300 hover:text-white transition-colors"
              >
                <Triangle className="w-4 h-4 text-[#FF6584]" />
                <span className="text-sm">Segitiga</span>
              </button>
            </div>
          )}

          {activeTab === "Elemen" && (
            <div className="grid grid-cols-2 gap-2">
              {["Bintang", "Hati", "Panah", "Garis", "Pola 1", "Pola 2", "Frame 1", "Frame 2"].map(
                (item) => (
                  <button
                    key={item}
                    className="p-4 rounded-lg bg-[#1a1a3a] hover:bg-[#222250] text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-[#0a0a1a] p-8 overflow-auto">
          <div
            ref={canvasRef}
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{
              width: `${zoom * 5.4}px`,
              height: `${zoom * 5.4}px`,
              backgroundImage:
                "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
            onClick={() => setSelectedId(null)}
          >
            {elements.map((el) => (
              <div
                key={el.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(el.id);
                }}
                onMouseDown={() => handleDragStart(el.id)}
                className={`absolute cursor-move transition-shadow ${
                  selectedId === el.id
                    ? "ring-2 ring-[#6C63FF] shadow-lg"
                    : "hover:ring-1 hover:ring-purple-500/30"
                }`}
                style={{
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  zIndex: selectedId === el.id ? 10 : 1,
                }}
              >
                {el.type === "text" && (
                  <div
                    style={{
                      fontSize: `${el.fontSize}px`,
                      color: el.color,
                      fontWeight: "bold",
                      fontFamily: "Inter",
                    }}
                    className="whitespace-nowrap select-none"
                  >
                    {el.content}
                  </div>
                )}
                {el.type === "shape" && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: el.color,
                      borderRadius: el.shape === "circle" ? "50%" : el.shape === "rect" ? "8px" : "0",
                      clipPath:
                        el.shape === "triangle"
                          ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                          : undefined,
                    }}
                  />
                )}
                {el.type === "image" && (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300">
                    <Image className="w-8 h-8 text-purple-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-64 bg-[#0f0f2a] border-l border-purple-500/10 p-4 overflow-y-auto">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Layers className="w-4 h-4 mr-2" />
            Properti
          </h3>

          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">Tipe</p>
                <p className="text-white text-sm capitalize">{selected.type}</p>
              </div>

              {selected.type === "text" && (
                <>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Teks</p>
                    <input
                      type="text"
                      value={selected.content}
                      onChange={(e) => updateSelected({ content: e.target.value })}
                      className="w-full bg-[#1a1a3a] border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Ukuran Font</p>
                    <Slider
                      value={[selected.fontSize || 24]}
                      onValueChange={(v) => updateSelected({ fontSize: v[0] })}
                      min={8}
                      max={120}
                      step={1}
                      className="py-2"
                    />
                    <span className="text-gray-400 text-xs">{selected.fontSize}px</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Alignment</p>
                    <div className="flex space-x-1">
                      <button className="p-2 rounded bg-[#1a1a3a] text-gray-400 hover:text-white">
                        <AlignLeft className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded bg-[#1a1a3a] text-gray-400 hover:text-white">
                        <AlignCenter className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded bg-[#1a1a3a] text-gray-400 hover:text-white">
                        <AlignRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Style</p>
                    <div className="flex space-x-1">
                      <button className="p-2 rounded bg-[#1a1a3a] text-gray-400 hover:text-white">
                        <Bold className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded bg-[#1a1a3a] text-gray-400 hover:text-white">
                        <Italic className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded bg-[#1a1a3a] text-gray-400 hover:text-white">
                        <Underline className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <p className="text-gray-400 text-xs mb-2">Warna</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateSelected({ color: c })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        selected.color === c ? "border-white scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Posisi X</p>
                <Slider
                  value={[Math.round(selected.x)]}
                  onValueChange={(v) => updateSelected({ x: v[0] })}
                  max={90}
                  className="py-2"
                />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Posisi Y</p>
                <Slider
                  value={[Math.round(selected.y)]}
                  onValueChange={(v) => updateSelected({ y: v[0] })}
                  max={90}
                  className="py-2"
                />
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="w-full mt-4"
                onClick={() => deleteElement(selected.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Hapus
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <MousePointer className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                Pilih elemen untuk mengedit
              </p>
            </div>
          )}

          {/* Layers */}
          <div className="mt-8">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Layer ({elements.length})
            </h4>
            <div className="space-y-1">
              {elements.map((el) => (
                <button
                  key={el.id}
                  onClick={() => setSelectedId(el.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedId === el.id
                      ? "bg-purple-500/20 text-white"
                      : "text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {el.type === "text" && <Type className="w-4 h-4" />}
                  {el.type === "image" && <Image className="w-4 h-4" />}
                  {el.type === "shape" && <Square className="w-4 h-4" />}
                  <span className="truncate">
                    {el.content || el.type} {el.id.slice(0, 4)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
