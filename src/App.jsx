// ============================================================
// Q'POCOTON Food & Drink — MVP v4.0
// ✅ Geolocalización: tarifa domicilio por distancia real
// ✅ Categoría "Domicilio" visible en sección de envíos
// ✅ Comprobante guardado en Excel (.xlsx) automáticamente
// ✅ Sin zonas manuales (sur/norte/oriente/occidente)
// ✅ Listo para Netlify (React SPA)
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ShoppingCart, X, Plus, Minus, MapPin, CheckCircle, Clock,
  ChefHat, Truck, MessageCircle, Settings, ArrowLeft, Flame,
  Star, Zap, Search, Users, TrendingUp, Download, Copy,
  Camera, Upload, Home, Navigation, AlertCircle, Locate
} from "lucide-react";

// ============================================================
// CONFIG — EDITA AQUÍ TODO
// ============================================================
const CONFIG = {
  restaurante: {
    nombre: "Q'Pocoton",
    eslogan: "Food & Drink",
    whatsapp: "573164216819",
    nequi: "316 421 6819",
    daviplata: "316 421 6819",
    qrNequi: "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Nequi%3A3164216819%20QPocoton&color=000000&bgcolor=ffffff",
    qrDaviplata: "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Daviplata%3A3164216819%20QPocoton&color=000000&bgcolor=ffffff",
    instagram: "@qpocoton",
    // Coordenadas del restaurante (actualiza con las reales)
    lat: 10.3910,
    lng: -75.4794,
  },
  // Tarifas de domicilio por distancia (km)
  tarifasDomicilio: [
    { hasta: 1.5,  precio: 3000,  label: "Muy cerca · <1.5 km" },
    { hasta: 3.0,  precio: 4000,  label: "Cerca · 1.5-3 km" },
    { hasta: 5.0,  precio: 5000,  label: "Zona media · 3-5 km" },
    { hasta: 8.0,  precio: 6500,  label: "Zona lejana · 5-8 km" },
    { hasta: 12.0, precio: 8000,  label: "Zona extendida · 8-12 km" },
    { hasta: 999,  precio: 10000, label: "Fuera de cobertura" },
  ],
  categorias: [
    {
      id: "hamburguesas", nombre: "Hamburguesas", icono: "🍔",
      items: [
        { id: "hb1", nombre: "Sencilla", descripcion: "Carne, jamón, lechuga, cebolla caramelizada, cebolla blanca, tomate, salsa de la casa.", precio: 20000, foto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", personalizaciones: ["Sin cebolla caramelizada", "Sin cebolla blanca", "Sin lechuga", "Sin tomate", "Sin jamón", "Sin salsa"], popular: true, tags: ["hamburguesa", "sencilla", "carne"] },
        { id: "hb2", nombre: "Doble Carne", descripcion: "Doble carne, tocineta, jamón, queso cheddar, lechuga, cebolla caramelizada, cebolla blanca, tomate, salsa de la casa.", precio: 25000, foto: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80", personalizaciones: ["Sin tocineta", "Sin cebolla caramelizada", "Sin cebolla blanca", "Sin lechuga", "Sin tomate", "Extra queso +$2.000"], popular: true, tags: ["hamburguesa", "doble", "carne", "tocineta"] },
        { id: "hb3", nombre: "Mixta", descripcion: "Pollo y Carne, tocineta, jamón, queso cheddar, lechuga, cebolla caramelizada, cebolla blanca, tomate, salsa de la casa.", precio: 25000, foto: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80", personalizaciones: ["Sin tocineta", "Sin cebolla", "Sin lechuga", "Sin tomate"], popular: false, tags: ["hamburguesa", "mixta", "pollo", "carne"] },
        { id: "hb4", nombre: "Hamburguezona", descripcion: "Bañada en queso, maíz tierno, tocineta, queso cheddar, doble carne, pollo, jamón, lechuga, cebolla caramelizada, cebolla blanca, tomate, salsa de la casa.", precio: 35000, foto: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80", personalizaciones: ["Sin maíz", "Sin tocineta", "Sin cebolla", "Sin lechuga", "Sin tomate"], popular: true, tags: ["hamburguesa", "hamburguezona", "especial", "grande"] },
      ]
    },
    {
      id: "perros", nombre: "Perros Calientes", icono: "🌭",
      items: [
        { id: "pc1", nombre: "Súper", descripcion: "Salchicha súper, queso mozarella, cebolla caramelizada, papas ripio, salsa de la casa.", precio: 15000, foto: "https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=400&q=80", personalizaciones: ["Sin cebolla caramelizada", "Sin papas ripio", "Sin salsa"], popular: true, tags: ["perro", "super", "salchicha"] },
        { id: "pc2", nombre: "Suizo", descripcion: "Salchicha suiza, queso mozarella, cebolla caramelizada, papas ripio, salsa de la casa.", precio: 18000, foto: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80", personalizaciones: ["Sin cebolla caramelizada", "Sin papas ripio", "Sin salsa"], popular: false, tags: ["perro", "suizo", "salchicha suiza"] },
        { id: "pc3", nombre: "Choriperro", descripcion: "Chorizo, cebolla caramelizada, queso mozarella, papas ripio, salsa de la casa.", precio: 18000, foto: "https://images.unsplash.com/photo-1558030137-a56c1b004fa6?w=400&q=80", personalizaciones: ["Sin cebolla caramelizada", "Sin papas ripio", "Sin salsa"], popular: true, tags: ["choriperro", "chorizo", "perro"] },
      ]
    },
    {
      id: "picadas", nombre: "Picadas", icono: "🍖",
      items: [
        { id: "pi1", nombre: "Picada Sencilla", descripcion: "Lechuga, papas a la francesa, chorizo, butifarra, salchicha, maíz, papas ripio, salsa de la casa.", precio: 21000, foto: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80", personalizaciones: ["Sin lechuga", "Sin maíz", "Sin papas ripio"], popular: false, tags: ["picada", "sencilla", "chorizo"] },
        { id: "pi2", nombre: "Picatón Half", descripcion: "Lechuga, papas a la francesa, chorizo, salchicha suiza, pollo, cerdo, butifarra, tocineta, maíz, papas ripio, salsa de la casa.", precio: 32000, foto: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", personalizaciones: ["Sin lechuga", "Sin maíz", "Sin tocineta"], popular: false, tags: ["picaton", "half", "picada"] },
        { id: "pi3", nombre: "Picatón", descripcion: "Bañada en queso, maíz tierno, tocineta, lechuga, papas a la francesa, chorizo, salchicha suiza, pollo, cerdo, butifarra, papas ripio y salsa.", precio: 45000, foto: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80", personalizaciones: ["Sin queso extra", "Sin maíz", "Sin tocineta"], popular: true, tags: ["picaton", "grande", "completa"] },
        { id: "pi4", nombre: "Picatón Especial", descripcion: "Bañada en queso, maíz tierno, tocineta, lechuga, papas a la francesa, chorizo, salchicha suiza, pollo, cerdo, butifarra, papas ripio y salsa.", precio: 65000, foto: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80", personalizaciones: ["Sin queso extra", "Sin maíz", "Sin tocineta"], popular: false, tags: ["picaton", "especial", "mega"] },
      ]
    },
    {
      id: "burritos", nombre: "Burritos", icono: "🌯",
      items: [
        { id: "bu1", nombre: "Pollo o Cerdo", descripcion: "Jamón, queso cheddar, queso Mozzarella (pollo o cerdo), lechuga, vegetales salteados, salsa pico de gallo y tahine.", precio: 20000, foto: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80", personalizaciones: ["Pollo", "Cerdo", "Sin lechuga", "Sin tahine"], popular: false, tags: ["burrito", "pollo", "cerdo"] },
        { id: "bu2", nombre: "Burritón Mixto", descripcion: "Jamón, queso cheddar, queso Mozzarella (pollo y cerdo), lechuga, vegetales salteados, salsa pico de gallo y tahine.", precio: 25000, foto: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80", personalizaciones: ["Sin lechuga", "Sin tahine", "Extra queso +$2.000"], popular: true, tags: ["burriton", "mixto", "grande"] },
      ]
    },
    {
      id: "patacones", nombre: "Patacones", icono: "🫓",
      items: [
        { id: "pt1", nombre: "Patacón Sencillo", descripcion: "Patacón tradicional, lechuga, butifarra, chorizo, pollo, cerdo, tocineta, papas ripio, salsa de la casa.", precio: 25000, foto: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80", personalizaciones: ["Sin lechuga", "Sin tocineta", "Sin papas ripio"], popular: false, tags: ["patacon", "sencillo"] },
        { id: "pt2", nombre: "Pataconzón", descripcion: "Bañado en queso, maíz tierno y tocineta, patacón en juliana, butifarra, chorizo, pollo, cerdo, lechuga, papas ripio, salsa de la casa.", precio: 35000, foto: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", personalizaciones: ["Sin queso extra", "Sin maíz", "Sin tocineta"], popular: true, tags: ["pataconzon", "grande", "especial"] },
      ]
    },
    {
      id: "pizza", nombre: "Pizza", icono: "🍕",
      items: [
        { id: "pz1", nombre: "Jamón con Queso", descripcion: "Pizza clásica jamón y queso. S/M/L.", precio: 32000, foto: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80", personalizaciones: ["Tamaño S ($32.000)", "Tamaño M ($38.000)", "Tamaño L ($48.000)", "Borde de queso +$12.000"], popular: false, tags: ["pizza", "jamon", "queso"] },
        { id: "pz2", nombre: "Hawaiana", descripcion: "Pizza hawaiana. S/M/L.", precio: 35000, foto: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", personalizaciones: ["Tamaño S ($35.000)", "Tamaño M ($40.000)", "Tamaño L ($51.000)", "Borde de queso +$12.000"], popular: false, tags: ["pizza", "hawaiana"] },
        { id: "pz3", nombre: "La Tóxica", descripcion: "Pollo, chorizo, butifarra, jamón, vegetales, maíz tierno y champiñones.", precio: 44000, foto: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&q=80", personalizaciones: ["Tamaño S ($44.000)", "Tamaño M ($51.000)", "Tamaño L ($61.000)", "Borde de queso +$12.000"], popular: true, tags: ["pizza", "toxica", "especial"] },
        { id: "pz4", nombre: "La Mimosa", descripcion: "Pollo, peperoni, salami, maíz tierno, cebolla y champiñones.", precio: 44000, foto: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", personalizaciones: ["Tamaño S ($44.000)", "Tamaño M ($51.000)", "Tamaño L ($61.000)", "Borde de queso +$12.000"], popular: true, tags: ["pizza", "mimosa", "peperoni"] },
        { id: "pz5", nombre: "La Celosa", descripcion: "Pollo, vegetales, peperoni y maíz tierno.", precio: 44000, foto: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80", personalizaciones: ["Tamaño S ($44.000)", "Tamaño M ($51.000)", "Tamaño L ($61.000)", "Borde de queso +$12.000"], popular: false, tags: ["pizza", "celosa"] },
        { id: "pz6", nombre: "Mexicana", descripcion: "Carne molida, salsa de la casa, chorizo y red pepper.", precio: 40000, foto: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400&q=80", personalizaciones: ["Tamaño S ($40.000)", "Tamaño M ($48.000)", "Tamaño L ($54.000)", "Borde de queso +$12.000"], popular: false, tags: ["pizza", "mexicana", "carne"] },
        { id: "pz7", nombre: "Campesina", descripcion: "Pollo, pimientón, cebolla, maíz y tocineta.", precio: 40000, foto: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80", personalizaciones: ["Tamaño S ($40.000)", "Tamaño M ($50.000)", "Tamaño L ($56.000)", "Borde de queso +$12.000"], popular: false, tags: ["pizza", "campesina", "pollo"] },
      ]
    },
    {
      id: "desgranados", nombre: "Desgranados", icono: "🌽",
      items: [
        { id: "dg1", nombre: "Tradicional", descripcion: "Queso, maíz, tocineta, papa ripio, salsa de la casa.", precio: 22000, foto: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80", personalizaciones: ["Sin tocineta", "Sin papas ripio", "Extra queso +$2.000"], popular: false, tags: ["desgranado", "maiz"] },
        { id: "dg2", nombre: "Pollo", descripcion: "Pollo, queso, maíz, papa ripio, salsa de la casa.", precio: 28000, foto: "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=400&q=80", personalizaciones: ["Sin papas ripio", "Extra queso +$2.000", "Extra pollo +$3.000"], popular: true, tags: ["desgranado", "maiz", "pollo"] },
      ]
    },
    {
      id: "infantil", nombre: "Menú Infantil", icono: "👶",
      items: [
        { id: "inf1", nombre: "Mini Pizzeta", descripcion: "Jamón y queso o hawaiana.", precio: 13000, foto: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80", personalizaciones: ["Jamón y Queso", "Hawaiana"], popular: false, tags: ["infantil", "pizza", "mini"] },
        { id: "inf2", nombre: "Mini Pizzeta Especial", descripcion: "Pizza mini especial.", precio: 19000, foto: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&q=80", personalizaciones: ["Jamón y Queso", "Hawaiana"], popular: false, tags: ["infantil", "pizza mini especial"] },
        { id: "inf3", nombre: "Salchipapa Sencilla", descripcion: "Papas a la francesa con salchicha.", precio: 12000, foto: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80", personalizaciones: ["Con kétchup", "Con mostaza", "Con salsa rosada"], popular: true, tags: ["salchipapa", "papas"] },
        { id: "inf4", nombre: "Salchipapa Doble", descripcion: "Doble porción de papas a la francesa con salchicha.", precio: 20000, foto: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80", personalizaciones: ["Con kétchup", "Con mostaza", "Extra salchicha +$2.000"], popular: false, tags: ["salchipapa", "doble", "papas"] },
      ]
    },
    {
      id: "bebidas", nombre: "Bebidas", icono: "🥤",
      items: [
        { id: "bb1", nombre: "Club Colombia", descripcion: "Cerveza 330ml.", precio: 6000, foto: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80", personalizaciones: [], popular: false, tags: ["cerveza", "club colombia"] },
        { id: "bb2", nombre: "Águila", descripcion: "Cerveza 330ml.", precio: 6000, foto: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80", personalizaciones: [], popular: false, tags: ["cerveza", "aguila"] },
        { id: "bb3", nombre: "Corona", descripcion: "Cerveza 330ml.", precio: 7000, foto: "https://images.unsplash.com/photo-1514362453360-8f94243c9996?w=400&q=80", personalizaciones: [], popular: false, tags: ["cerveza", "corona"] },
        { id: "bb4", nombre: "Gaseosa Personal", descripcion: "300ml tu elección.", precio: 5000, foto: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80", personalizaciones: ["Coca-Cola", "Pepsi", "Sprite", "Manzana", "Quatro"], popular: false, tags: ["gaseosa", "coca cola"] },
        { id: "bb5", nombre: "Coca-Cola Litro", descripcion: "Litro para compartir.", precio: 10000, foto: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&q=80", personalizaciones: [], popular: false, tags: ["gaseosa", "cocacola", "litro"] },
        { id: "bb6", nombre: "Kola Román", descripcion: "Kola Román litro.", precio: 10000, foto: "https://images.unsplash.com/photo-1543253687-c931c8e01820?w=400&q=80", personalizaciones: [], popular: true, tags: ["kola roman", "gaseosa"] },
        { id: "bb7", nombre: "Agua", descripcion: "Agua pura 600ml.", precio: 4000, foto: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80", personalizaciones: [], popular: false, tags: ["agua"] },
        { id: "bb8", nombre: "Agua Saborizada", descripcion: "Agua saborizada Hit.", precio: 5000, foto: "https://images.unsplash.com/photo-1614350292382-c448d0110dfa?w=400&q=80", personalizaciones: ["Durazno", "Mango", "Frutos Rojos"], popular: false, tags: ["agua", "saborizada"] },
        { id: "bb9", nombre: "Jugo Hit Litro", descripcion: "Jugo Hit litro.", precio: 10000, foto: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80", personalizaciones: ["Naranja", "Maracuyá", "Mango"], popular: false, tags: ["jugo", "hit", "litro"] },
        { id: "bb10", nombre: "Jugo Personal", descripcion: "Jugo Hit personal 300ml.", precio: 5000, foto: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80", personalizaciones: ["Naranja", "Maracuyá", "Mango"], popular: false, tags: ["jugo", "personal"] },
      ]
    },
    // ─── CATEGORÍA DOMICILIO ─────────────────────────────────
    {
      id: "domicilio", nombre: "Domicilio", icono: "🛵",
      items: [
        {
          id: "dom1", nombre: "¿Cómo funciona el domicilio?", popular: false,
          descripcion: "Calculamos el costo del domicilio automáticamente según tu ubicación GPS. Selecciona 'Domicilio' en tu carrito y toca 'Detectar mi ubicación' para obtener la tarifa exacta. Cobertura hasta 12 km del restaurante.",
          precio: 0, foto: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80",
          personalizaciones: [], tags: ["domicilio", "envio", "cobertura", "tarifa"]
        },
        {
          id: "dom2", nombre: "Tarifas por distancia", popular: false,
          descripcion: "< 1.5 km: $3.000 | 1.5-3 km: $4.000 | 3-5 km: $5.000 | 5-8 km: $6.500 | 8-12 km: $8.000. La tarifa se calcula en tiempo real cuando activas tu GPS.",
          precio: 0, foto: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&q=80",
          personalizaciones: [], tags: ["tarifa", "distancia", "domicilio", "precio"]
        },
        {
          id: "dom3", nombre: "Tiempo estimado de entrega", popular: false,
          descripcion: "Promedio 30-45 minutos dependiendo de la distancia y el volumen de pedidos. Te notificaremos por WhatsApp cuando tu pedido salga del restaurante.",
          precio: 0, foto: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
          personalizaciones: [], tags: ["tiempo", "entrega", "domicilio"]
        },
      ]
    },
  ]
};

// ─── Utilidades ───────────────────────────────────────────────
function buscarProductos(q) {
  if (!q || q.trim().length < 2) return [];
  const t = q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const res = [];
  for (const cat of CONFIG.categorias) {
    for (const item of cat.items) {
      const n = item.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const tags = (item.tags || []).join(" ").toLowerCase();
      const d = item.descripcion.toLowerCase();
      if (n.includes(t) || tags.includes(t) || d.includes(t))
        res.push({ ...item, categoriaNombre: cat.nombre, categoriaIcono: cat.icono });
    }
  }
  return res;
}

const formatCOP = (n) => `$${Number(n).toLocaleString("es-CO")}`;

// Haversine: distancia en km entre dos coordenadas
function calcDistanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getTarifaPorDistancia(km) {
  return CONFIG.tarifasDomicilio.find(t => km <= t.hasta) || CONFIG.tarifasDomicilio[CONFIG.tarifasDomicilio.length - 1];
}

function useStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

function registrarCliente(clientes, setClientes, data) {
  const tel = data.telefono?.replace(/\D/g, "");
  if (!tel) return;
  const ahora = new Date();
  setClientes(prev => {
    const idx = prev.findIndex(c => c.telefono === tel);
    if (idx >= 0) {
      const u = [...prev];
      u[idx] = { ...u[idx], nombre: data.nombre || u[idx].nombre, pedidos: u[idx].pedidos + 1, totalGastado: u[idx].totalGastado + data.total, ultimoPedido: ahora.toLocaleDateString("es-CO"), ultimoPedidoTs: ahora.getTime() };
      return u;
    }
    return [{ id: tel, telefono: tel, nombre: data.nombre || "Sin nombre", pedidos: 1, totalGastado: data.total, ultimoPedido: ahora.toLocaleDateString("es-CO"), ultimoPedidoTs: ahora.getTime(), fechaRegistro: ahora.toLocaleDateString("es-CO") }, ...prev];
  });
}

// ─── Exportar pedido a Excel (CSV con UTF-8 BOM para Excel) ───
function exportarPedidoExcel(pedidoData, imgBase64) {
  const ahora = new Date();
  const fecha = ahora.toLocaleString("es-CO");
  const productos = pedidoData.cart.map(i =>
    `${i.qty}x ${i.nombre}${i.personalizaciones?.length ? " (" + i.personalizaciones.join(", ") + ")" : ""} - ${formatCOP(i.precio * i.qty)}`
  ).join(" | ");

  const rows = [
    ["PEDIDO Q'POCOTON FOOD & DRINK"],
    [""],
    ["Campo", "Valor"],
    ["Fecha", fecha],
    ["ID Pedido", pedidoData.id || ahora.getTime()],
    ["Nombre cliente", pedidoData.nombre],
    ["Teléfono", pedidoData.telefono],
    ["Tipo entrega", pedidoData.tipoEntrega === "domicilio" ? "Domicilio" : "Recoge en local"],
    ["Barrio", pedidoData.barrio || "-"],
    ["Dirección", pedidoData.direccion || "-"],
    ["Distancia aprox.", pedidoData.distanciaKm ? pedidoData.distanciaKm.toFixed(1) + " km" : "-"],
    ["Método de pago", pedidoData.metodoPago === "efectivo" ? "Efectivo" : pedidoData.metodoPago === "nequi" ? "Nequi" : "Daviplata"],
    ["Productos", productos],
    ["Subtotal", pedidoData.subtotal],
    ["Domicilio", pedidoData.domicilio || 0],
    ["TOTAL", pedidoData.total],
    ["Comprobante adjunto", imgBase64 ? "SÍ (ver imagen abajo)" : "No aplica (efectivo)"],
    [""],
    imgBase64 ? ["COMPROBANTE DE PAGO (base64 - pegar en navegador para ver):", imgBase64.substring(0, 200) + "..."] : [""],
  ];

  const csvContent = "\uFEFF" + rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pedido_qpocoton_${String(pedidoData.nombre || "cliente").replace(/\s/g, "_")}_${ahora.toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Colores ───────────────────────────────────────────────────
const C = { gold: "#C5A83D", goldDk: "#a8892a", goldBg: "rgba(197,168,61,0.1)", red: "#E63329", bg: "#0a0a0a", card: "#1a1a1a", border: "#222", text: "#fff", muted: "#666", dim: "#3a3a3a" };
const inp = { width: "100%", padding: "11px 14px", borderRadius: 9, border: "1.5px solid #2a2a2a", background: "#111", color: "#fff", fontSize: 13, boxSizing: "border-box", outline: "none", fontFamily: "sans-serif" };
const btn = (active) => ({ padding: "13px 0", borderRadius: 11, border: active ? "2px solid " + C.gold : "2px solid #2a2a2a", background: active ? C.goldBg : "#111", color: active ? C.gold : C.muted, fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "all .15s" });

// ─── Producto Card ───────────────────────────────────────────────
function ProductCard({ item, onAdd }) {
  const [sc, setSc] = useState(false);
  const [sel, setSel] = useState([]);
  const tog = (o) => setSel(s => s.includes(o) ? s.filter(x => x !== o) : [...s, o]);
  const add = () => { onAdd(item, sel); setSel([]); setSc(false); };

  // Cards informativas de domicilio (precio 0)
  if (item.precio === 0) {
    return (
      <div style={{ background: C.card, borderRadius: 15, overflow: "hidden", border: "1px solid " + C.border }}>
        <div style={{ position: "relative", height: 120, overflow: "hidden" }}>
          <img src={item.foto} alt={item.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.85), transparent)" }} />
          <div style={{ position: "absolute", bottom: 9, left: 13 }}>
            <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 13, margin: 0 }}>{item.nombre}</h3>
          </div>
        </div>
        <div style={{ padding: "11px 13px 13px" }}>
          <p style={{ color: "#777", fontSize: 11, margin: 0, lineHeight: 1.6 }}>{item.descripcion}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.card, borderRadius: 15, overflow: "hidden", border: "1px solid " + C.border, transition: "transform .2s, box-shadow .2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(197,168,61,.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
      <div style={{ position: "relative", height: 150, overflow: "hidden" }}>
        <img src={item.foto} alt={item.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {item.popular && <div style={{ position: "absolute", top: 8, left: 8, background: C.gold, color: "#000", padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 900, display: "flex", alignItems: "center", gap: 3 }}><Star size={9} fill="#000" /> HOT</div>}
        {item.categoriaNombre && <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.75)", color: C.gold, padding: "3px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700 }}>{item.categoriaIcono} {item.categoriaNombre}</div>}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 44, background: "linear-gradient(transparent, " + C.card + ")" }} />
      </div>
      <div style={{ padding: "11px 13px 13px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
          <h3 style={{ color: C.text, fontWeight: 800, fontSize: 14, margin: 0, flex: 1 }}>{item.nombre}</h3>
          <span style={{ color: C.gold, fontWeight: 900, fontSize: 14, whiteSpace: "nowrap", marginLeft: 8 }}>{formatCOP(item.precio)}</span>
        </div>
        <p style={{ color: "#777", fontSize: 11, margin: "0 0 9px", lineHeight: 1.5 }}>{item.descripcion}</p>
        {sc && item.personalizaciones?.length > 0 && (
          <div style={{ marginBottom: 9 }}>
            <p style={{ color: C.gold, fontSize: 10, fontWeight: 700, marginBottom: 5 }}>Personaliza:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {item.personalizaciones.map(o => (
                <button key={o} onClick={() => tog(o)} style={{ padding: "3px 8px", borderRadius: 18, fontSize: 10, fontWeight: 600, border: "1.5px solid " + (sel.includes(o) ? C.gold : "#333"), background: sel.includes(o) ? C.goldBg : "transparent", color: sel.includes(o) ? C.gold : "#888", cursor: "pointer" }}>{o}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 6 }}>
          {item.personalizaciones?.length > 0 && (
            <button onClick={() => setSc(s => !s)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "1.5px solid #2a2a2a", background: "transparent", color: "#777", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{sc ? "✕" : "⚙ Personalizar"}</button>
          )}
          <button onClick={add} style={{ flex: 2, padding: "7px 0", borderRadius: 8, border: "none", background: "linear-gradient(135deg, " + C.gold + ", " + C.goldDk + ")", color: "#000", fontSize: 12, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <Plus size={13} /> Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer con geolocalización ────────────────────────────
function CartDrawer({ cart, setCart, onCheckout, onClose }) {
  const [tipo, setTipo] = useStorage("poc_tipo", "domicilio");
  const [geoEstado, setGeoEstado] = useState("idle"); // idle | cargando | ok | error
  const [geoData, setGeoData] = useState(null); // { distanciaKm, tarifa }
  const sub = cart.reduce((s, i) => s + i.precio * i.qty, 0);
  const dom = tipo === "domicilio" && geoData ? geoData.tarifa.precio : 0;
  const total = sub + dom;
  const upd = (id, d) => setCart(c => c.map(i => i._cartId === id ? { ...i, qty: Math.max(0, i.qty + d) } : i).filter(i => i.qty > 0));
  const ok = cart.length > 0 && (tipo === "recogida" || (tipo === "domicilio" && geoData));

  const detectarUbicacion = () => {
    if (!navigator.geolocation) { setGeoEstado("error"); return; }
    setGeoEstado("cargando");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = calcDistanciaKm(pos.coords.latitude, pos.coords.longitude, CONFIG.restaurante.lat, CONFIG.restaurante.lng);
        const tarifa = getTarifaPorDistancia(km);
        setGeoData({ distanciaKm: km, tarifa, lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoEstado("ok");
      },
      () => setGeoEstado("error"),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)" }} />
      <div style={{ width: "min(420px,100vw)", background: "#111", display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", borderLeft: "1px solid " + C.border }}>
        <div style={{ padding: "15px 16px 11px", borderBottom: "1px solid " + C.border, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.card, position: "sticky", top: 0, zIndex: 10 }}>
          <div><h2 style={{ color: C.text, margin: 0, fontWeight: 900, fontSize: 17 }}>Tu Pedido</h2><p style={{ color: C.muted, margin: 0, fontSize: 11 }}>{cart.reduce((s, i) => s + i.qty, 0)} producto(s)</p></div>
          <button onClick={onClose} style={{ background: "#2a2a2a", border: "none", borderRadius: 8, padding: 7, cursor: "pointer", color: C.text }}><X size={17} /></button>
        </div>

        {cart.length === 0
          ? <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.dim }}><ShoppingCart size={50} strokeWidth={1} /><p style={{ marginTop: 11, fontSize: 13 }}>Tu carrito está vacío</p></div>
          : <div style={{ flex: 1, padding: "11px 14px" }}>
              {cart.map(item => (
                <div key={item._cartId} style={{ display: "flex", gap: 9, marginBottom: 11, paddingBottom: 11, borderBottom: "1px solid #1a1a1a" }}>
                  <img src={item.foto} alt={item.nombre} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: C.text, margin: "0 0 2px", fontWeight: 700, fontSize: 12 }}>{item.nombre}</p>
                    {item.personalizaciones?.length > 0 && <p style={{ color: C.gold, fontSize: 10, margin: "0 0 4px" }}>{item.personalizaciones.join(" · ")}</p>}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button onClick={() => upd(item._cartId, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #333", background: "#1e1e1e", color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={10} /></button>
                        <span style={{ color: C.text, fontWeight: 800, minWidth: 14, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => upd(item._cartId, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: C.gold, color: "#000", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={10} /></button>
                      </div>
                      <span style={{ color: C.gold, fontWeight: 800, fontSize: 12 }}>{formatCOP(item.precio * item.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        }

        <div style={{ padding: "12px 14px 16px", borderTop: "1px solid " + C.border, background: C.card }}>
          <p style={{ color: C.gold, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>¿Cómo recibes tu pedido?</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              { id: "domicilio", icon: <Truck size={14} />, label: "Domicilio", sub: "Lo llevamos a tu puerta" },
              { id: "recogida", icon: <Home size={14} />, label: "Recoger aquí", sub: "Pago en efectivo" }
            ].map(t => (
              <button key={t.id} onClick={() => setTipo(t.id)} style={{ padding: "10px 8px", borderRadius: 10, border: "2px solid " + (tipo === t.id ? C.gold : "#2a2a2a"), background: tipo === t.id ? C.goldBg : "#111", color: tipo === t.id ? C.gold : C.muted, cursor: "pointer", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 800, fontSize: 12, marginBottom: 2 }}>{t.icon} {t.label}</div>
                <p style={{ margin: 0, fontSize: 10, color: tipo === t.id ? C.goldDk : "#444" }}>{t.sub}</p>
              </button>
            ))}
          </div>

          {/* Geolocalización para domicilio */}
          {tipo === "domicilio" && (
            <div style={{ marginBottom: 12 }}>
              {geoEstado === "idle" && (
                <button onClick={detectarUbicacion} style={{ width: "100%", padding: "11px 0", borderRadius: 9, border: "1.5px dashed " + C.gold, background: C.goldBg, color: C.gold, fontWeight: 800, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Locate size={14} /> Detectar mi ubicación para calcular tarifa
                </button>
              )}
              {geoEstado === "cargando" && (
                <div style={{ padding: "11px", background: "#111", borderRadius: 9, border: "1px solid #2a2a2a", textAlign: "center" }}>
                  <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>📍 Obteniendo ubicación...</p>
                </div>
              )}
              {geoEstado === "ok" && geoData && (
                <div style={{ background: "#0d2b1a", border: "1px solid rgba(39,174,96,.35)", borderRadius: 9, padding: "11px 13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ color: "#27ae60", fontWeight: 800, fontSize: 13, margin: "0 0 2px" }}>📍 Ubicación detectada</p>
                      <p style={{ color: "#1a6b3c", fontSize: 11, margin: 0 }}>{geoData.tarifa.label}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: C.gold, fontWeight: 900, fontSize: 16, margin: 0 }}>{formatCOP(geoData.tarifa.precio)}</p>
                      <button onClick={() => { setGeoEstado("idle"); setGeoData(null); }} style={{ background: "none", border: "none", color: "#444", fontSize: 10, cursor: "pointer", marginTop: 2 }}>Cambiar</button>
                    </div>
                  </div>
                </div>
              )}
              {geoEstado === "error" && (
                <div style={{ background: "rgba(230,51,41,.08)", border: "1px solid rgba(230,51,41,.25)", borderRadius: 9, padding: "11px 13px" }}>
                  <p style={{ color: "#e88", fontWeight: 700, fontSize: 12, margin: "0 0 4px" }}>⚠️ No se pudo detectar ubicación</p>
                  <p style={{ color: "#955", fontSize: 11, margin: "0 0 7px" }}>Activa el GPS y permite acceso a la ubicación.</p>
                  <button onClick={detectarUbicacion} style={{ padding: "6px 13px", borderRadius: 7, border: "1px solid #555", background: "transparent", color: "#aaa", fontSize: 11, cursor: "pointer" }}>Reintentar</button>
                </div>
              )}
            </div>
          )}

          {tipo === "recogida" && (
            <div style={{ background: "rgba(39,174,96,.08)", border: "1px solid rgba(39,174,96,.25)", borderRadius: 9, padding: "9px 12px", marginBottom: 11 }}>
              <p style={{ color: "#27ae60", fontSize: 12, fontWeight: 700, margin: 0 }}>🏠 Recoge en el local · Paga en efectivo</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: C.muted, fontSize: 12 }}><span>Subtotal</span><span>{formatCOP(sub)}</span></div>
            {tipo === "domicilio" && (
              <div style={{ display: "flex", justifyContent: "space-between", color: C.muted, fontSize: 12 }}>
                <span>Domicilio</span>
                <span style={{ color: geoData ? C.gold : "#444" }}>{geoData ? formatCOP(dom) : "Detecta ubicación"}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", color: C.text, fontSize: 17, fontWeight: 900, borderTop: "1px solid #222", paddingTop: 8 }}><span>TOTAL</span><span style={{ color: C.gold }}>{formatCOP(total)}</span></div>
          </div>

          <button onClick={() => { if (ok) onCheckout(geoData, total, sub, dom, tipo); }} disabled={!ok} style={{ width: "100%", padding: "13px 0", borderRadius: 11, border: "none", background: ok ? "linear-gradient(135deg, " + C.gold + ", " + C.goldDk + ")" : "#1e1e1e", color: ok ? "#000" : "#444", fontSize: 14, fontWeight: 900, cursor: ok ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Zap size={16} /> Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout (3 pasos) ──────────────────────────────────────────
function CheckoutScreen({ cart, geoData, total, subtotal, domicilio, tipoEntrega, onBack, onConfirm }) {
  const [nombre, setNombre] = useStorage("poc_nombre", "");
  const [telefono, setTelefono] = useStorage("poc_telefono", "");
  const [barrio, setBarrio] = useStorage("poc_barrio", "");
  const [direccion, setDireccion] = useStorage("poc_dir", "");
  const [pago, setPago] = useState(tipoEntrega === "recogida" ? "efectivo" : "nequi");
  const [copied, setCopied] = useState(false);
  const [paso, setPaso] = useState(1);
  const [imgComp, setImgComp] = useState(null);
  const fileRef = useRef(null);

  const copyNum = () => {
    navigator.clipboard?.writeText((pago === "nequi" ? CONFIG.restaurante.nequi : CONFIG.restaurante.daviplata).replace(/\s/g, ""));
    setCopied(true); setTimeout(() => setCopied(false), 2200);
  };

  const paso1OK = () => {
    if (!nombre.trim()) { alert("Ingresa tu nombre"); return; }
    if (!telefono.replace(/\D/g, "") || telefono.replace(/\D/g, "").length < 10) { alert("Ingresa un WhatsApp válido (10 dígitos)"); return; }
    if (tipoEntrega === "domicilio" && !barrio.trim()) { alert("Ingresa tu barrio"); return; }
    if (tipoEntrega === "domicilio" && !direccion.trim()) { alert("Ingresa tu dirección (carrera/calle)"); return; }
    setPaso(pago === "efectivo" ? 3 : 2);
  };

  const onFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => setImgComp(ev.target.result); r.readAsDataURL(f);
  };

  const confirmar = () => {
    if (pago !== "efectivo" && !imgComp) { alert("📸 Debes adjuntar el comprobante de pago para continuar."); return; }

    const pedidoData = {
      id: Date.now(),
      nombre, telefono, barrio, direccion,
      distanciaKm: geoData?.distanciaKm,
      tarifaLabel: geoData?.tarifa?.label,
      total, subtotal,
      domicilio: domicilio || 0,
      cart,
      metodoPago: pago,
      tipoEntrega
    };

    // Exportar a Excel/CSV automáticamente si hay comprobante
    if (pago !== "efectivo" && imgComp) {
      exportarPedidoExcel(pedidoData, imgComp);
    }

    const lineas = cart.map(i =>
      "• " + i.qty + "x " + i.nombre + (i.personalizaciones?.length ? " (" + i.personalizaciones.join(", ") + ")" : "") + " — " + formatCOP(i.precio * i.qty)
    ).join("\n");

    const distInfo = geoData ? "\n📏 *Distancia aprox.:* " + geoData.distanciaKm.toFixed(1) + " km (" + geoData.tarifa.label + ")" : "";
    const dirInfo = tipoEntrega === "domicilio" ? "📍 *Barrio:* " + barrio + "\n🏠 *Dirección:* " + direccion + distInfo + "\n" : "🏠 *Entrega:* Recoge en el local\n";
    const pagoInfo = pago === "efectivo" ? "💵 *Pago:* Efectivo en el local" : "💳 *Pago:* " + (pago === "nequi" ? "Nequi" : "Daviplata") + " — ✅ Comprobante adjunto en este chat";

    const msg = encodeURIComponent(
      "🍔 *PEDIDO — Q'Pocoton Food & Drink*\n\n" +
      "👤 *Cliente:* " + nombre + "\n📱 *WhatsApp:* " + telefono + "\n" + dirInfo +
      "\n*🧾 PRODUCTOS:*\n" + lineas + "\n\n" +
      "Subtotal: " + formatCOP(subtotal) + "\n" +
      (tipoEntrega === "domicilio" ? "Domicilio: " + formatCOP(domicilio) + "\n" : "") +
      "*TOTAL: " + formatCOP(total) + "*\n\n" + pagoInfo + "\n\n⏳ Esperando confirmación del restaurante"
    );
    window.open("https://wa.me/" + CONFIG.restaurante.whatsapp + "?text=" + msg, "_blank");
    onConfirm(pedidoData);
  };

  const pasoLabels = pago === "efectivo" ? ["Tus datos", "Confirmar"] : ["Tus datos", "Realizar pago", "Comprobante"];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 40 }}>
      <div style={{ background: C.card, padding: "12px 14px", display: "flex", alignItems: "center", gap: 9, borderBottom: "1px solid " + C.border, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => paso > 1 ? setPaso(p => p - 1) : onBack()} style={{ background: "#2a2a2a", border: "none", borderRadius: 8, padding: 7, cursor: "pointer", color: C.text }}><ArrowLeft size={17} /></button>
        <h2 style={{ color: C.text, margin: 0, fontWeight: 900, fontSize: 16, flex: 1 }}>Finalizar Pedido</h2>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {pasoLabels.map((_, i) => {
            const n = i + 1;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: paso >= n ? C.gold : "#2a2a2a", color: paso >= n ? "#000" : C.muted, fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
                {i < pasoLabels.length - 1 && <div style={{ width: 12, height: 2, background: paso > n ? C.gold : "#2a2a2a" }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 13px" }}>

        {/* PASO 1: DATOS */}
        {paso === 1 && (
          <>
            <div style={{ background: C.card, borderRadius: 13, padding: 14, marginBottom: 12, border: "1px solid " + C.border }}>
              <p style={{ color: C.gold, fontWeight: 800, fontSize: 12, margin: "0 0 8px" }}>🧾 Tu pedido</p>
              {cart.map(i => (
                <div key={i._cartId} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, color: "#bbb" }}>
                  <span>{i.qty}x {i.nombre}{i.personalizaciones?.length ? " (" + i.personalizaciones.join(", ") + ")" : ""}</span>
                  <span style={{ color: C.text, fontWeight: 700, marginLeft: 8, flexShrink: 0 }}>{formatCOP(i.precio * i.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid " + C.border, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 900, color: C.gold }}>
                <span>TOTAL</span><span>{formatCOP(total)}</span>
              </div>
              {tipoEntrega === "domicilio" && geoData && (
                <div style={{ marginTop: 7, padding: "7px 10px", background: "#0d2b1a", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <MapPin size={11} color="#27ae60" />
                  <p style={{ color: "#27ae60", fontSize: 10, margin: 0 }}>{geoData.tarifa.label} — Domicilio {formatCOP(domicilio)}</p>
                </div>
              )}
            </div>

            <div style={{ background: C.card, borderRadius: 13, padding: 14, marginBottom: 12, border: "1px solid " + C.border }}>
              <p style={{ color: C.gold, fontWeight: 800, fontSize: 12, margin: "0 0 10px" }}>👤 Tus datos</p>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre completo *" style={{ ...inp, marginBottom: 8 }} />
              <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="WhatsApp (ej: 3001234567) *" type="tel" style={inp} />
            </div>

            {tipoEntrega === "domicilio" && (
              <div style={{ background: C.card, borderRadius: 13, padding: 14, marginBottom: 12, border: "1px solid " + C.border }}>
                <p style={{ color: C.gold, fontWeight: 800, fontSize: 12, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 5 }}>
                  <Navigation size={13} /> Dirección de entrega
                </p>
                <input value={barrio} onChange={e => setBarrio(e.target.value)} placeholder="Barrio *  (ej: El Bosque, Manga, Centro)" style={{ ...inp, marginBottom: 8 }} />
                <input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Carrera / Calle *  (ej: Cra 15 #30-45)" style={inp} />
                <p style={{ color: "#444", fontSize: 10, marginTop: 6 }}>💡 Entre más precisa la dirección, más rápido llegamos</p>
              </div>
            )}

            {tipoEntrega === "recogida" && (
              <div style={{ background: "rgba(39,174,96,.08)", border: "1px solid rgba(39,174,96,.2)", borderRadius: 11, padding: "11px 13px", marginBottom: 12 }}>
                <p style={{ color: "#27ae60", fontWeight: 700, fontSize: 13, margin: 0 }}>🏠 Recoge en el local y paga en efectivo</p>
              </div>
            )}

            <div style={{ background: C.card, borderRadius: 13, padding: 14, marginBottom: 14, border: "1px solid " + C.border }}>
              <p style={{ color: C.gold, fontWeight: 800, fontSize: 12, margin: "0 0 10px" }}>💳 Forma de pago</p>
              <div style={{ display: "grid", gridTemplateColumns: tipoEntrega === "recogida" ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8 }}>
                {[{ id: "nequi", label: "🟣 Nequi" }, { id: "daviplata", label: "🔴 Daviplata" }, ...(tipoEntrega === "recogida" ? [{ id: "efectivo", label: "💵 Efectivo" }] : [])].map(m => (
                  <button key={m.id} onClick={() => setPago(m.id)} style={{ ...btn(pago === m.id), padding: "10px 6px", fontSize: 12 }}>{m.label}</button>
                ))}
              </div>
              {pago !== "efectivo" && <p style={{ color: "#555", fontSize: 10, marginTop: 8 }}>⚠️ Deberás adjuntar el comprobante en el siguiente paso — se guardará automáticamente en Excel</p>}
            </div>

            <button onClick={paso1OK} style={{ width: "100%", padding: "14px 0", borderRadius: 11, border: "none", background: "linear-gradient(135deg, " + C.gold + ", " + C.goldDk + ")", color: "#000", fontSize: 14, fontWeight: 900, cursor: "pointer" }}>
              Continuar →
            </button>
          </>
        )}

        {/* PASO 2: QR + número */}
        {paso === 2 && pago !== "efectivo" && (
          <>
            <div style={{ background: C.card, borderRadius: 13, padding: 16, marginBottom: 12, border: "1px solid " + C.border }}>
              <p style={{ color: C.gold, fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{pago === "nequi" ? "🟣 Pago por Nequi" : "🔴 Pago por Daviplata"}</p>
              <p style={{ color: C.muted, fontSize: 12, margin: "0 0 14px" }}>Transfiere exactamente <strong style={{ color: C.text }}>{formatCOP(total)}</strong> a:</p>

              <div style={{ background: "#111", borderRadius: 10, padding: "13px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>Número</p>
                  <p style={{ color: C.text, fontWeight: 900, fontSize: 22, margin: "3px 0 0", letterSpacing: 2 }}>{pago === "nequi" ? CONFIG.restaurante.nequi : CONFIG.restaurante.daviplata}</p>
                  <p style={{ color: "#555", fontSize: 10, margin: "3px 0 0" }}>A nombre de: Q'Pocoton</p>
                </div>
                <button onClick={copyNum} style={{ background: copied ? "#27ae60" : "#2a2a2a", border: "none", borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "background .2s" }}>
                  <Copy size={12} /> {copied ? "¡Copiado!" : "Copiar"}
                </button>
              </div>

              <div style={{ textAlign: "center" }}>
                <p style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>O escanea el QR:</p>
                <div style={{ display: "inline-block", padding: 11, background: "#fff", borderRadius: 13, boxShadow: "0 0 28px " + C.goldBg }}>
                  <img src={pago === "nequi" ? CONFIG.restaurante.qrNequi : CONFIG.restaurante.qrDaviplata} alt="QR pago" style={{ width: 165, height: 165, display: "block" }} />
                </div>
                <p style={{ color: "#444", fontSize: 10, marginTop: 7 }}>Q'Pocoton — {pago === "nequi" ? "Nequi" : "Daviplata"}</p>
              </div>
            </div>

            <div style={{ background: "rgba(230,51,41,.08)", border: "1px solid rgba(230,51,41,.2)", borderRadius: 11, padding: "11px 13px", marginBottom: 12, display: "flex", gap: 9, alignItems: "flex-start" }}>
              <AlertCircle size={17} color="#E63329" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: "#e88", fontSize: 12, margin: 0, lineHeight: 1.5 }}>Realiza la transferencia ahora, luego toma captura de pantalla del comprobante. La necesitarás en el siguiente paso.</p>
            </div>

            <button onClick={() => setPaso(3)} style={{ width: "100%", padding: "14px 0", borderRadius: 11, border: "none", background: "linear-gradient(135deg, " + C.gold + ", " + C.goldDk + ")", color: "#000", fontSize: 14, fontWeight: 900, cursor: "pointer" }}>
              Ya pagué → Adjuntar comprobante
            </button>
          </>
        )}

        {/* PASO 3: Comprobante */}
        {paso === 3 && (
          <>
            {pago !== "efectivo" && (
              <div style={{ background: C.card, borderRadius: 13, padding: 16, marginBottom: 12, border: "1px solid " + C.border }}>
                <p style={{ color: C.gold, fontWeight: 800, fontSize: 14, margin: "0 0 5px" }}>📸 Comprobante de pago</p>
                <p style={{ color: C.muted, fontSize: 12, margin: "0 0 6px" }}>Sin comprobante el restaurante no puede verificar tu pago.</p>
                <div style={{ background: "rgba(197,168,61,.07)", border: "1px solid rgba(197,168,61,.2)", borderRadius: 8, padding: "7px 11px", marginBottom: 12, display: "flex", gap: 6, alignItems: "center" }}>
                  <Download size={12} color={C.gold} />
                  <p style={{ color: C.gold, fontSize: 11, margin: 0, fontWeight: 600 }}>Al confirmar, el pedido se guardará automáticamente en Excel</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: "none" }} />
                {!imgComp ? (
                  <div style={{ border: "2px dashed " + C.gold + "55", borderRadius: 11, padding: "26px 14px", textAlign: "center", cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
                    <Camera size={38} color={C.gold} strokeWidth={1.5} style={{ marginBottom: 8 }} />
                    <p style={{ color: C.text, fontWeight: 700, fontSize: 13, margin: "0 0 3px" }}>Toca para adjuntar</p>
                    <p style={{ color: C.muted, fontSize: 11, margin: "0 0 12px" }}>Foto de la captura del recibo</p>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid " + C.gold, background: "transparent", color: C.gold, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}><Camera size={13} /> Cámara</button>
                      <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #2a2a2a", background: "transparent", color: C.muted, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}><Upload size={13} /> Galería</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ position: "relative" }}>
                      <img src={imgComp} alt="Comprobante" style={{ width: "100%", borderRadius: 10, maxHeight: 240, objectFit: "contain", background: "#000" }} />
                      <button onClick={() => { setImgComp(null); if (fileRef.current) fileRef.current.value = ""; }} style={{ position: "absolute", top: 7, right: 7, background: "rgba(0,0,0,.7)", border: "none", borderRadius: 7, padding: "5px 9px", color: "#fff", fontSize: 11, cursor: "pointer" }}>✕ Cambiar</button>
                    </div>
                    <div style={{ marginTop: 9, background: "rgba(39,174,96,.1)", border: "1px solid rgba(39,174,96,.3)", borderRadius: 8, padding: "8px 11px", display: "flex", alignItems: "center", gap: 7 }}>
                      <CheckCircle size={15} color="#27ae60" /><p style={{ color: "#27ae60", fontSize: 12, fontWeight: 700, margin: 0 }}>Comprobante listo ✓ — Se exportará a Excel al confirmar</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {pago === "efectivo" && (
              <div style={{ background: C.card, borderRadius: 13, padding: 16, marginBottom: 12, border: "1px solid " + C.border }}>
                <p style={{ color: "#27ae60", fontWeight: 800, fontSize: 14, margin: "0 0 8px" }}>💵 Pago en efectivo al recoger</p>
                <p style={{ color: C.muted, fontSize: 13 }}>Pagarás <strong style={{ color: C.text }}>{formatCOP(total)}</strong> en el local. El restaurante confirmará tu pedido por WhatsApp antes de que llegues.</p>
              </div>
            )}

            <div style={{ background: C.card, borderRadius: 13, padding: 13, marginBottom: 12, border: "1px solid " + C.border }}>
              <p style={{ color: C.gold, fontWeight: 700, fontSize: 11, margin: "0 0 8px" }}>📋 Confirma tus datos</p>
              <p style={{ color: C.muted, fontSize: 12, margin: "0 0 2px" }}>👤 {nombre} · 📱 {telefono}</p>
              {tipoEntrega === "domicilio" && <p style={{ color: C.muted, fontSize: 12, margin: "0 0 2px" }}>📍 {barrio} — {direccion}</p>}
              {tipoEntrega === "domicilio" && geoData && <p style={{ color: "#27ae60", fontSize: 11, margin: "0 0 2px" }}>📏 {geoData.distanciaKm.toFixed(1)} km · {geoData.tarifa.label} · {formatCOP(domicilio)}</p>}
              {tipoEntrega === "recogida" && <p style={{ color: C.muted, fontSize: 12, margin: "0 0 2px" }}>🏠 Recoge en el local</p>}
              <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>💳 {pago === "efectivo" ? "Efectivo" : pago === "nequi" ? "Nequi" : "Daviplata"} · <strong style={{ color: C.gold }}>{formatCOP(total)}</strong></p>
            </div>

            <button onClick={confirmar} style={{ width: "100%", padding: "15px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #25D366, #1aad54)", color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: "0 6px 24px rgba(37,211,102,.2)" }}>
              <MessageCircle size={19} /> Confirmar por WhatsApp
            </button>
            <p style={{ color: "#444", fontSize: 10, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
              {pago !== "efectivo" ? "Se abrirá WhatsApp y se descargará el Excel con el comprobante." : "Se abrirá WhatsApp con tu pedido. El restaurante te confirmará."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Sala de Espera ──────────────────────────────────────────────
function SalaEspera({ pedidoId, nombre, metodoPago, total, tipoEntrega, onVolver }) {
  const [seg, setSeg] = useState(0);
  const [pedidos] = useStorage("poc_pedidos", []);
  const pedido = pedidos.find(p => p.id === pedidoId);
  const estado = pedido?.estado || "Pendiente";
  useEffect(() => { const t = setInterval(() => setSeg(s => s + 1), 1000); return () => clearInterval(t); }, []);
  const min = Math.floor(seg / 60), sec = seg % 60;
  const flujo = [
    { id: "Pendiente", icon: "⏳", label: "Pedido recibido", desc: "El restaurante está revisando tu pedido" },
    { id: "Pago Verificado", icon: "✅", label: "Pago verificado", desc: "Tu pago fue confirmado. Pasando a cocina..." },
    { id: "En Cocina", icon: "🍳", label: "En preparación", desc: "Tu pedido está siendo preparado" },
    { id: "En Camino", icon: "🛵", label: "En camino", desc: "Tu pedido va en camino hacia ti" },
    { id: "Entregado", icon: "🎉", label: "¡Entregado!", desc: "¡Buen provecho!" },
  ];
  const idxActual = flujo.findIndex(e => e.id === estado);
  const etapa = flujo.find(e => e.id === estado) || flujo[0];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ background: C.card, padding: "13px 14px", borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, " + C.gold + ", " + C.goldDk + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🍔</div>
        <div>
          <h2 style={{ color: C.text, margin: 0, fontWeight: 900, fontSize: 16 }}>Seguimiento del pedido</h2>
          <p style={{ color: C.muted, margin: 0, fontSize: 11 }}>Hola {nombre} · {min > 0 ? min + "m " : ""}{sec}s esperando</p>
        </div>
      </div>
      <div style={{ flex: 1, maxWidth: 480, margin: "0 auto", width: "100%", padding: "18px 13px" }}>
        <div style={{ background: C.card, borderRadius: 16, padding: 22, marginBottom: 14, textAlign: "center", border: "2px solid " + (estado === "Entregado" ? "#27ae60" : estado === "Pendiente" ? "rgba(230,51,41,.4)" : C.gold + "88") }}>
          <div style={{ fontSize: 46, marginBottom: 10 }}>{etapa.icon}</div>
          <h3 style={{ color: C.text, fontWeight: 900, fontSize: 19, margin: "0 0 5px" }}>{etapa.label}</h3>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>{etapa.desc}</p>
        </div>
        <div style={{ background: C.card, borderRadius: 13, padding: 16, marginBottom: 12, border: "1px solid " + C.border }}>
          <p style={{ color: C.gold, fontWeight: 800, fontSize: 11, margin: "0 0 12px", letterSpacing: 1 }}>PROGRESO DEL PEDIDO</p>
          {flujo.map((e, i) => {
            const activo = i <= idxActual; const esActual = i === idxActual;
            return (
              <div key={e.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: activo ? (esActual ? C.gold : "#27ae60") : "#1e1e1e", border: "2px solid " + (activo ? (esActual ? C.gold : "#27ae60") : "#2a2a2a"), display: "flex", alignItems: "center", justifyContent: "center", color: activo ? "#000" : "#444", fontSize: 11, fontWeight: 900, boxShadow: esActual ? "0 0 14px " + C.goldBg : "none" }}>
                    {activo && !esActual ? "✓" : i + 1}
                  </div>
                  {i < flujo.length - 1 && <div style={{ width: 2, height: 22, background: i < idxActual ? "#27ae60" : "#1e1e1e", marginTop: 2 }} />}
                </div>
                <div style={{ paddingBottom: i < flujo.length - 1 ? 14 : 0 }}>
                  <p style={{ color: activo ? (esActual ? C.gold : C.text) : "#444", fontWeight: esActual ? 800 : 600, fontSize: 12, margin: "5px 0 2px" }}>{e.label}</p>
                  {esActual && <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>{e.desc}</p>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background: C.card, borderRadius: 13, padding: 13, marginBottom: 12, border: "1px solid " + C.border, display: "flex", justifyContent: "space-between" }}>
          <div><p style={{ color: C.muted, fontSize: 10, margin: 0 }}>Total</p><p style={{ color: C.gold, fontWeight: 900, fontSize: 18, margin: "3px 0 0" }}>{formatCOP(total)}</p></div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: C.muted, fontSize: 10, margin: 0 }}>Pago</p>
            <p style={{ color: C.text, fontWeight: 700, fontSize: 13, margin: "3px 0 0" }}>{metodoPago === "efectivo" ? "💵 Efectivo" : metodoPago === "nequi" ? "🟣 Nequi" : "🔴 Daviplata"}</p>
          </div>
        </div>
        {estado === "Entregado"
          ? <button onClick={onVolver} style={{ width: "100%", padding: "14px 0", borderRadius: 11, border: "none", background: "linear-gradient(135deg, #27ae60, #1e8449)", color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer" }}>🎉 ¡Gracias! Hacer otro pedido</button>
          : <button onClick={onVolver} style={{ width: "100%", padding: "11px 0", borderRadius: 11, border: "1.5px solid " + C.border, background: "transparent", color: C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>← Volver al menú</button>
        }
      </div>
    </div>
  );
}

// ─── Admin Panel ─────────────────────────────────────────────────
function AdminPanel({ pedidos, setPedidos, clientes, onBack }) {
  const [vista, setVista] = useState("pedidos");
  const estados = ["Pendiente", "Pago Verificado", "En Cocina", "En Camino", "Entregado"];
  const cols = { "Pendiente": "#E63329", "Pago Verificado": C.gold, "En Cocina": "#3498db", "En Camino": "#9b59b6", "Entregado": "#27ae60" };
  const cambiar = (id, e) => setPedidos(ps => ps.map(p => p.id === id ? { ...p, estado: e } : p));
  const totalVentas = pedidos.filter(p => p.estado === "Entregado").reduce((s, p) => s + p.total, 0);
  const pendientes = pedidos.filter(p => p.estado === "Pendiente").length;

  const exportCSV = () => {
    const rows = [
      ["Teléfono", "Nombre", "Pedidos", "Total Gastado", "Último Pedido", "Registro"],
      ...clientes.map(c => [c.telefono, c.nombre, c.pedidos, c.totalGastado, c.ultimoPedido, c.fechaRegistro])
    ];
    const blob = new Blob(["\uFEFF" + rows.map(r => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "clientes_qpocoton_" + new Date().toISOString().slice(0, 10) + ".csv"; a.click();
  };

  const exportPedidosCSV = () => {
    const rows = [
      ["ID", "Fecha", "Nombre", "Teléfono", "Tipo Entrega", "Barrio", "Dirección", "Distancia km", "Método Pago", "Subtotal", "Domicilio", "Total", "Estado", "Productos"],
      ...pedidos.map(p => [
        p.id, p.hora, p.nombre, p.telefono, p.tipoEntrega, p.barrio || "-", p.direccion || "-",
        p.distanciaKm ? p.distanciaKm.toFixed(1) : "-",
        p.metodoPago, p.subtotal || "-", p.domicilio || 0, p.total, p.estado,
        (p.cart || []).map(i => i.qty + "x " + i.nombre).join(" | ")
      ])
    ];
    const blob = new Blob(["\uFEFF" + rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "pedidos_qpocoton_" + new Date().toISOString().slice(0, 10) + ".csv"; a.click();
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ background: C.card, padding: "12px 14px", display: "flex", alignItems: "center", gap: 9, borderBottom: "1px solid " + C.border, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "#2a2a2a", border: "none", borderRadius: 8, padding: 7, cursor: "pointer", color: C.text }}><ArrowLeft size={17} /></button>
        <h2 style={{ color: C.text, margin: 0, fontWeight: 900, fontSize: 16, flex: 1 }}>Panel Admin</h2>
        {pendientes > 0 && <div style={{ background: C.red, borderRadius: 18, padding: "3px 10px", fontSize: 11, fontWeight: 900, color: "#fff" }}>{pendientes} nuevo(s)</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, padding: "11px 11px 0", maxWidth: 680, margin: "0 auto" }}>
        {[{ label: "Pedidos", val: pedidos.length, color: C.gold }, { label: "Ventas confirm.", val: formatCOP(totalVentas), color: "#27ae60" }, { label: "Clientes únicos", val: clientes.length, color: "#3498db" }].map(s => (
          <div key={s.label} style={{ background: C.card, borderRadius: 10, padding: "10px 11px", border: "1px solid " + C.border }}>
            <p style={{ color: s.color, fontWeight: 900, fontSize: 15, margin: "0 0 2px" }}>{s.val}</p>
            <p style={{ color: "#444", fontSize: 10, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", padding: "10px 11px 0", maxWidth: 680, margin: "0 auto" }}>
        {[{ id: "pedidos", label: "📋 Pedidos" }, { id: "clientes", label: "👥 Clientes" }].map((t, i) => (
          <button key={t.id} onClick={() => setVista(t.id)} style={{ flex: 1, padding: "8px 0", border: "none", background: vista === t.id ? C.gold : "#1e1e1e", color: vista === t.id ? "#000" : C.muted, fontWeight: 800, fontSize: 12, cursor: "pointer", borderRadius: i === 0 ? "8px 0 0 8px" : "0 8px 8px 0" }}>{t.label}</button>
        ))}
      </div>
      <div style={{ maxWidth: 680, margin: "11px auto", padding: "0 11px 40px" }}>
        {vista === "pedidos" && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <button onClick={exportPedidosCSV} style={{ padding: "6px 13px", borderRadius: 7, border: "1px solid " + C.border, background: C.card, color: C.gold, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Download size={11} /> Exportar Excel</button>
            </div>
            {pedidos.length === 0
              ? <div style={{ textAlign: "center", padding: 48, color: C.dim }}>
                  <ChefHat size={48} strokeWidth={1} /><p style={{ marginTop: 11, fontSize: 13 }}>Sin pedidos aún</p>
                  <button onClick={() => setPedidos([{ id: Date.now(), nombre: "Demo", telefono: "3001234567", barrio: "El Bosque", direccion: "Cra 15 #30-45", distanciaKm: 2.3, total: 43000, subtotal: 39000, domicilio: 4000, estado: "Pendiente", metodoPago: "nequi", tipoEntrega: "domicilio", hora: new Date().toLocaleTimeString("es-CO"), cart: [{ nombre: "Doble Carne", qty: 1, precio: 25000 }, { nombre: "Choriperro", qty: 1, precio: 18000 }] }])} style={{ marginTop: 11, padding: "8px 16px", borderRadius: 8, border: "1.5px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 11 }}>+ Simular pedido demo</button>
                </div>
              : pedidos.map(p => (
                  <div key={p.id} style={{ background: C.card, borderRadius: 13, padding: 15, marginBottom: 11, border: "1px solid " + (p.estado === "Pendiente" ? "rgba(230,51,41,.35)" : C.border) }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <h3 style={{ color: C.text, margin: 0, fontWeight: 800, fontSize: 13 }}>{p.nombre}</h3>
                        <p style={{ color: C.muted, margin: "2px 0 0", fontSize: 10 }}>📱 {p.telefono} · {p.hora}</p>
                        {p.tipoEntrega === "domicilio" && <p style={{ color: C.muted, margin: "1px 0 0", fontSize: 10 }}>📍 {p.barrio} — {p.direccion}{p.distanciaKm ? " · " + p.distanciaKm.toFixed(1) + " km" : ""}</p>}
                        {p.tipoEntrega === "recogida" && <p style={{ color: "#27ae60", margin: "1px 0 0", fontSize: 10 }}>🏠 Recoge en el local</p>}
                        <p style={{ color: "#444", margin: "1px 0 0", fontSize: 10 }}>{p.metodoPago === "efectivo" ? "💵 Efectivo" : p.metodoPago === "nequi" ? "🟣 Nequi" : "🔴 Daviplata"}</p>
                      </div>
                      <span style={{ color: C.gold, fontWeight: 900, fontSize: 15 }}>{formatCOP(p.total)}</span>
                    </div>
                    {p.cart?.map((i, idx) => <p key={idx} style={{ color: "#777", fontSize: 10, margin: "2px 0" }}>• {i.qty}x {i.nombre} — {formatCOP(i.precio * i.qty)}</p>)}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 18, background: (cols[p.estado] || "#555") + "15", border: "1px solid " + (cols[p.estado] || "#555") + "35", color: cols[p.estado] || "#555", fontSize: 10, fontWeight: 800, marginTop: 9, marginBottom: 9 }}>
                      {p.estado}
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {estados.map(e => (
                        <button key={e} onClick={() => cambiar(p.id, e)} disabled={p.estado === e} style={{ padding: "5px 9px", borderRadius: 6, border: "1px solid", borderColor: p.estado === e ? (cols[e] || "#555") : "#2a2a2a", background: p.estado === e ? (cols[e] || "#555") + "15" : "transparent", color: p.estado === e ? (cols[e] || "#555") : "#444", fontSize: 10, fontWeight: 700, cursor: p.estado === e ? "default" : "pointer" }}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
            }
          </>
        )}
        {vista === "clientes" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
              <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>👥 {clientes.length} cliente(s)</p>
              <button onClick={exportCSV} style={{ padding: "6px 11px", borderRadius: 7, border: "1px solid " + C.border, background: C.card, color: C.gold, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Download size={11} /> CSV</button>
            </div>
            {clientes.length === 0
              ? <div style={{ textAlign: "center", padding: 48, color: C.dim }}><Users size={48} strokeWidth={1} /><p style={{ marginTop: 11 }}>Sin clientes aún</p></div>
              : clientes.sort((a, b) => b.ultimoPedidoTs - a.ultimoPedidoTs).map(c => (
                  <div key={c.id} style={{ background: C.card, borderRadius: 11, padding: 13, marginBottom: 8, border: "1px solid " + C.border, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ color: C.text, fontWeight: 800, margin: 0, fontSize: 12 }}>{c.nombre}</p>
                      <p style={{ color: C.muted, margin: "2px 0 0", fontSize: 10 }}>📱 {c.telefono}</p>
                      <p style={{ color: "#444", margin: "2px 0 0", fontSize: 9 }}>Último: {c.ultimoPedido}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: C.gold, fontWeight: 900, margin: 0, fontSize: 13 }}>{formatCOP(c.totalGastado)}</p>
                      <p style={{ color: C.muted, margin: "2px 0 4px", fontSize: 9 }}>{c.pedidos} pedido(s)</p>
                      <a href={"https://wa.me/57" + c.telefono} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 8px", borderRadius: 6, background: "rgba(37,211,102,.1)", border: "1px solid rgba(37,211,102,.25)", color: "#25D366", fontSize: 9, fontWeight: 700, textDecoration: "none" }}>
                        <MessageCircle size={9} /> Escribir
                      </a>
                    </div>
                  </div>
                ))
            }
          </>
        )}
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────
export default function App() {
  const [vista, setVista] = useState("menu");
  const [catActiva, setCatActiva] = useState("hamburguesas");
  const [cart, setCart] = useStorage("poc_cart", []);
  const [cartOpen, setCartOpen] = useState(false);
  const [chkData, setChkData] = useState(null);
  const [pedidoConf, setPedidoConf] = useState(null);
  const [pedidos, setPedidos] = useStorage("poc_pedidos", []);
  const [clientes, setClientes] = useStorage("poc_clientes", []);
  const [busqueda, setBusqueda] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const resultados = buscarProductos(busqueda);

  const addToCart = useCallback((item, pers) => {
    if (item.precio === 0) return; // No agregar items informativos
    const _cartId = item.id + "_" + Date.now();
    setCart(c => {
      if (!pers.length) { const ex = c.find(i => i.id === item.id && !i.personalizaciones?.length); if (ex) return c.map(i => i._cartId === ex._cartId ? { ...i, qty: i.qty + 1 } : i); }
      return [...c, { ...item, qty: 1, personalizaciones: pers, _cartId }];
    });
  }, [setCart]);

  const handleCheckout = (geoData, total, sub, dom, tipo) => {
    setChkData({ geoData, total, subtotal: sub, domicilio: dom, tipoEntrega: tipo });
    setCartOpen(false);
    setVista("checkout");
  };

  const handleConfirm = (data) => {
    setPedidos(ps => [{ ...data, estado: "Pendiente", hora: new Date().toLocaleTimeString("es-CO") }, ...ps]);
    registrarCliente(clientes, setClientes, data);
    setCart([]);
    setPedidoConf({ id: data.id, nombre: data.nombre, metodoPago: data.metodoPago, total: data.total, tipoEntrega: data.tipoEntrega });
    setVista("espera");
  };

  useEffect(() => {
    const check = () => { if (window.location.hash === "#admin") setVista("admin"); };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  useEffect(() => { if (showSearch && searchRef.current) searchRef.current.focus(); }, [showSearch]);

  const volverMenu = () => { setPedidoConf(null); setVista("menu"); };
  const categoria = CONFIG.categorias.find(c => c.id === catActiva);

  if (vista === "admin") return <AdminPanel pedidos={pedidos} setPedidos={setPedidos} clientes={clientes} onBack={() => { window.location.hash = ""; setVista("menu"); }} />;
  if (vista === "espera" && pedidoConf) return <SalaEspera {...pedidoConf} pedidoId={pedidoConf.id} onVolver={volverMenu} />;
  if (vista === "checkout" && chkData) return <CheckoutScreen cart={cart} {...chkData} onBack={() => setVista("menu")} onConfirm={handleConfirm} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "sans-serif" }}>
      {/* HEADER */}
      <div style={{ background: "#111", padding: "0 12px", borderBottom: "2px solid " + C.gold, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 768, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ fontFamily: "Impact, sans-serif" }}>
            <div style={{ fontSize: 19, color: C.gold, letterSpacing: 2, lineHeight: 1 }}>Q'POCOTON</div>
            <div style={{ fontSize: 8, color: C.muted, letterSpacing: 3 }}>FOOD & DRINK</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setShowSearch(s => !s)} style={{ background: showSearch ? C.gold : "#1e1e1e", border: "none", borderRadius: 7, padding: "7px 8px", cursor: "pointer", color: showSearch ? "#000" : C.muted }}><Search size={15} /></button>
            <button onClick={() => { window.location.hash = "admin"; setVista("admin"); }} style={{ background: "#1e1e1e", border: "1px solid " + C.border, borderRadius: 7, padding: "7px 8px", cursor: "pointer", color: C.muted }}><Settings size={15} /></button>
            <button onClick={() => setCartOpen(true)} style={{ background: totalItems > 0 ? "linear-gradient(135deg, " + C.gold + ", " + C.goldDk + ")" : "#1e1e1e", border: "none", borderRadius: 7, padding: "7px 11px", cursor: "pointer", color: totalItems > 0 ? "#000" : C.text, display: "flex", alignItems: "center", gap: 5, fontWeight: 900, fontSize: 12 }}>
              <ShoppingCart size={15} />{totalItems > 0 && <span>{totalItems}</span>}
            </button>
          </div>
        </div>
        {showSearch && (
          <div style={{ paddingBottom: 9 }}>
            <div style={{ position: "relative", maxWidth: 768, margin: "0 auto" }}>
              <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.muted }} />
              <input ref={searchRef} value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Busca: hamburguesa, choriperro, pizza, pollo..." style={{ ...inp, paddingLeft: 32, fontSize: 12, border: "1.5px solid " + C.gold + "33" }} />
              {busqueda && <button onClick={() => setBusqueda("")} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer" }}><X size={13} /></button>}
            </div>
          </div>
        )}
      </div>

      {/* Búsqueda */}
      {showSearch && busqueda.length >= 2 && (
        <div style={{ maxWidth: 768, margin: "0 auto", padding: "12px 11px" }}>
          <p style={{ color: C.muted, fontSize: 11, marginBottom: 11 }}>{resultados.length} resultado(s) para "<span style={{ color: C.gold }}>{busqueda}</span>"</p>
          {resultados.length === 0
            ? <div style={{ textAlign: "center", padding: 28, color: C.muted }}><Search size={36} strokeWidth={1} /><p style={{ marginTop: 9, fontSize: 12 }}>Sin resultados</p></div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 275px), 1fr))", gap: 12 }}>{resultados.map(item => <ProductCard key={item.id} item={item} onAdd={addToCart} />)}</div>
          }
        </div>
      )}

      {/* MENÚ NORMAL */}
      {(!showSearch || busqueda.length < 2) && (
        <>
          <div style={{ background: "linear-gradient(160deg, #0f0f0a, #1a1500, #0a0a0a)", padding: "22px 12px 17px", textAlign: "center", borderBottom: "1px solid " + C.border }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: C.gold + "12", border: "1px solid " + C.gold + "30", padding: "3px 10px", borderRadius: 18, marginBottom: 9 }}>
              <Flame size={10} color={C.gold} /><span style={{ color: C.gold, fontSize: 9, fontWeight: 800, letterSpacing: 2 }}>MENÚ OFICIAL</span>
            </div>
            <h2 style={{ color: C.text, fontSize: "clamp(18px, 5vw, 27px)", fontWeight: 900, margin: "0 0 5px", fontFamily: "Impact, sans-serif", letterSpacing: 1 }}>
              El sabor que te<br /><span style={{ background: "linear-gradient(135deg, " + C.gold + ", #F0D060)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>hace volver</span>
            </h2>
            <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>{CONFIG.restaurante.instagram} · {CONFIG.restaurante.nequi}</p>
          </div>

          {/* Tabs categorías */}
          <div style={{ display: "flex", gap: 6, padding: "10px 11px", overflowX: "auto", background: "#111", borderBottom: "1px solid #1a1a1a", position: "sticky", top: 56, zIndex: 50, scrollbarWidth: "none" }}>
            {CONFIG.categorias.map(cat => (
              <button key={cat.id} onClick={() => setCatActiva(cat.id)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 20, border: "none", background: catActiva === cat.id ? "linear-gradient(135deg, " + C.gold + ", " + C.goldDk + ")" : "#1e1e1e", color: catActiva === cat.id ? "#000" : C.muted, fontWeight: 800, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s", boxShadow: catActiva === cat.id ? "0 3px 12px " + C.goldBg : "none" }}>
                {cat.icono} {cat.nombre}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ maxWidth: 768, margin: "0 auto", padding: "13px 10px 100px" }}>
            <h2 style={{ color: C.text, margin: "0 0 12px", fontWeight: 900, fontSize: 17, display: "flex", alignItems: "center", gap: 6, fontFamily: "Impact, sans-serif", letterSpacing: 1 }}>
              {categoria?.icono} {categoria?.nombre?.toUpperCase()}
              <span style={{ color: "#333", fontSize: 11, fontWeight: 400, fontFamily: "sans-serif" }}>({categoria?.items.length})</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 275px), 1fr))", gap: 12 }}>
              {categoria?.items.map(item => <ProductCard key={item.id} item={item} onAdd={addToCart} />)}
            </div>
          </div>
        </>
      )}

      {/* FAB */}
      {totalItems > 0 && !cartOpen && (
        <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 200 }}>
          <button onClick={() => setCartOpen(true)} style={{ background: "linear-gradient(135deg, " + C.gold + ", " + C.goldDk + ")", border: "none", borderRadius: 30, padding: "11px 20px", color: "#000", fontWeight: 900, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 5px 24px " + C.goldBg, whiteSpace: "nowrap" }}>
            <ShoppingCart size={16} /> Ver pedido ({totalItems}) · {formatCOP(cart.reduce((s, i) => s + i.precio * i.qty, 0))}
          </button>
        </div>
      )}

      {cartOpen && <CartDrawer cart={cart} setCart={setCart} onCheckout={handleCheckout} onClose={() => setCartOpen(false)} />}
    </div>
  );
}
