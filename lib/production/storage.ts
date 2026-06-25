import { listQuotations } from "@/lib/bulk-order/storage";
import type { BulkQuotationRecord } from "@/lib/bulk-order/types";
import type { OrderStatus } from "@/types";
import type { ProductionOrder, ProductionUpdate, VendorRecord } from "@/lib/production/types";

const ORDERS_KEY = "merchdesign-production-orders";
const VENDORS_KEY = "merchdesign-vendors";
const UPDATES_KEY = "merchdesign-production-updates";

function now() {
  return new Date().toISOString();
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function seedVendors(): VendorRecord[] {
  const timestamp = now();
  return [
    {
      id: "vendor-bandung-print",
      userId: "vendor-user-1",
      companyName: "Bandung Print House",
      location: "Bandung",
      contactPhone: "+62 812-1000-2000",
      productionMethods: ["DTF", "Screen Printing", "Digital Print"],
      capabilities: ["Clothing", "Merchandise", "Event Kit"],
      capacityPerDay: { tshirt: 400, lanyard: 1000, sticker: 2500 },
      priceList: { dtf: 18000, screen: 12000, lanyard: 7500 },
      status: "active",
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      id: "vendor-jakarta-apparel",
      userId: "vendor-user-2",
      companyName: "Jakarta Apparel Works",
      location: "Jakarta",
      contactPhone: "+62 811-3000-9000",
      productionMethods: ["Embroidery", "DTF", "Sublimation"],
      capabilities: ["Clothing", "Corporate Gift"],
      capacityPerDay: { hoodie: 120, tshirt: 350, polo: 180 },
      priceList: { embroidery: 22000, dtf: 19000, sublimation: 15000 },
      status: "active",
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      id: "vendor-surabaya-3d",
      userId: "vendor-user-3",
      companyName: "Surabaya 3D Lab",
      location: "Surabaya",
      contactPhone: "+62 813-7000-3000",
      productionMethods: ["FDM", "Resin Print", "Painting"],
      capabilities: ["3D Printing", "Trophy", "Logo Stand"],
      capacityPerDay: { keychain: 180, trophy: 24, logoStand: 36 },
      priceList: { plaGram: 850, resinGram: 1500, finishingHour: 35000 },
      status: "active",
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ];
}

function orderFromQuotation(quotation: BulkQuotationRecord, index: number): ProductionOrder {
  const timestamp = now();
  return {
    id: `order-from-${quotation.id}`,
    orderNumber: `MDS-${24000 + index}`,
    customerName: "Local Customer",
    quotationNumber: quotation.quotation_number,
    orderType: "bulk_event",
    status: "quotation_requested",
    totalAmount: quotation.total,
    paymentStatus: "unpaid",
    dpAmount: quotation.dp_amount,
    remainingAmount: quotation.remaining_amount,
    productionDeadline: quotation.event_info.deadline,
    shippingAddress: quotation.event_info.location,
    notes: quotation.terms,
    items: quotation.items.map((item) => ({
      productName: item.productName,
      category: item.category,
      quantity: item.quantity,
      specs: `${item.printMethod}, ${item.productionTime}`
    })),
    files: [
      { id: `file-${quotation.id}-1`, fileName: "artwork-preview.png", fileType: "Design Preview", fileUrl: "#" },
      { id: `file-${quotation.id}-2`, fileName: "production-spec.pdf", fileType: "Production Spec", fileUrl: "#" }
    ],
    createdAt: quotation.created_at,
    updatedAt: timestamp
  };
}

export function seedOrders(): ProductionOrder[] {
  const timestamp = now();
  const quotationOrders = listQuotations().map(orderFromQuotation);
  return [
    ...quotationOrders,
    {
      id: "order-mds-24001",
      orderNumber: "MDS-24001",
      customerName: "PT Nusantara Event",
      quotationNumber: "QTN-MDS-202605-1001",
      orderType: "bulk_event",
      status: "approved_for_production",
      totalAmount: 14850000,
      paymentStatus: "dp_paid",
      dpAmount: 7425000,
      remainingAmount: 7425000,
      productionDeadline: "2026-06-08",
      shippingAddress: "Jakarta Convention Center",
      notes: "Event seminar 200 peserta. Prioritas kaos, lanyard, ID card.",
      items: [
        { productName: "T-shirt Cotton Combed 24s", category: "Clothing", quantity: 200, specs: "DTF front print, size breakdown attached" },
        { productName: "Lanyard Custom", category: "Event Kit", quantity: 200, specs: "Sublimation full color" },
        { productName: "ID Card PVC", category: "Event Kit", quantity: 200, specs: "Digital print double side" }
      ],
      files: [
        { id: "file-1", fileName: "seminar-shirt-artwork.png", fileType: "Artwork", fileUrl: "#" },
        { id: "file-2", fileName: "size-breakdown.xlsx", fileType: "Size Breakdown", fileUrl: "#" }
      ],
      assignedVendorId: "vendor-bandung-print",
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      id: "order-mds-24002",
      orderNumber: "MDS-24002",
      customerName: "Kopi Loka",
      quotationNumber: "QTN-MDS-202605-1002",
      orderType: "quotation_based",
      status: "in_production",
      totalAmount: 7200000,
      paymentStatus: "dp_paid",
      dpAmount: 3600000,
      remainingAmount: 3600000,
      productionDeadline: "2026-06-03",
      shippingAddress: "Bandung",
      notes: "Packaging launch kit untuk cafe.",
      items: [
        { productName: "Coffee Cup Sleeve", category: "F&B Branding", quantity: 500, specs: "Kraft full color" },
        { productName: "Sticker Vinyl", category: "Packaging", quantity: 500, specs: "Die cut matte laminate" }
      ],
      files: [{ id: "file-3", fileName: "kopi-loka-label.pdf", fileType: "Print Ready PDF", fileUrl: "#" }],
      assignedVendorId: "vendor-bandung-print",
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      id: "order-mds-24003",
      orderNumber: "MDS-24003",
      customerName: "Award Night Committee",
      quotationNumber: "QTN-MDS-202605-1003",
      orderType: "3d_printing",
      status: "quality_check",
      totalAmount: 3600000,
      paymentStatus: "paid",
      dpAmount: 1800000,
      remainingAmount: 0,
      productionDeadline: "2026-05-28",
      shippingAddress: "Surabaya",
      notes: "Trophy 3D print dengan finishing gold.",
      items: [{ productName: "Trophy 3D Print", category: "3D Printing", quantity: 12, specs: "PLA + painting gold, base black" }],
      files: [{ id: "file-4", fileName: "trophy-logo.stl", fileType: "STL", fileUrl: "#" }],
      assignedVendorId: "vendor-surabaya-3d",
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ];
}

export function listVendors() {
  const vendors = readJson<VendorRecord[]>(VENDORS_KEY, []);
  if (vendors.length) return vendors;
  const seeded = seedVendors();
  if (typeof window !== "undefined") writeJson(VENDORS_KEY, seeded);
  return seeded;
}

export function saveVendor(vendor: VendorRecord) {
  const vendors = listVendors();
  const next = vendors.some((item) => item.id === vendor.id) ? vendors.map((item) => (item.id === vendor.id ? vendor : item)) : [vendor, ...vendors];
  writeJson(VENDORS_KEY, next);
  return vendor;
}

export function listProductionOrders() {
  const orders = readJson<ProductionOrder[]>(ORDERS_KEY, []);
  if (orders.length) return orders;
  const seeded = seedOrders();
  if (typeof window !== "undefined") writeJson(ORDERS_KEY, seeded);
  return seeded;
}

export function getProductionOrder(orderId: string) {
  return listProductionOrders().find((order) => order.id === orderId || order.orderNumber === orderId) ?? null;
}

export function saveProductionOrder(order: ProductionOrder) {
  const orders = listProductionOrders();
  const next = orders.some((item) => item.id === order.id) ? orders.map((item) => (item.id === order.id ? order : item)) : [order, ...orders];
  writeJson(ORDERS_KEY, next);
  return order;
}

export function updateOrderStatus(orderId: string, status: OrderStatus, createdBy: "admin" | "vendor" = "admin", note = `Status updated to ${status}`) {
  const order = getProductionOrder(orderId);
  if (!order) return null;
  const updated = saveProductionOrder({ ...order, status, updatedAt: now() });
  addProductionUpdate({ orderId: order.id, vendorId: order.assignedVendorId, status, note, createdBy });
  return updated;
}

export function assignVendorToOrder(orderId: string, vendorId: string) {
  const order = getProductionOrder(orderId);
  if (!order) return null;
  const updated = saveProductionOrder({ ...order, assignedVendorId: vendorId, status: "assigned_to_vendor", updatedAt: now() });
  addProductionUpdate({ orderId: order.id, vendorId, status: "assigned_to_vendor", note: "Vendor assigned by admin.", createdBy: "admin" });
  return updated;
}

export function listProductionUpdates() {
  return readJson<ProductionUpdate[]>(UPDATES_KEY, []);
}

export function addProductionUpdate(input: Omit<ProductionUpdate, "id" | "createdAt">) {
  const update: ProductionUpdate = { ...input, id: `update-${Date.now()}-${Math.floor(Math.random() * 10000)}`, createdAt: now() };
  writeJson(UPDATES_KEY, [update, ...listProductionUpdates()]);
  return update;
}

export function ordersForVendor(vendorId = "vendor-bandung-print") {
  return listProductionOrders().filter((order) => order.assignedVendorId === vendorId);
}
