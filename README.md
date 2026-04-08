# Q'Pocoton Food & Drink — MVP v4.0

## ¿Qué hay de nuevo en v4?

| Cambio | Detalle |
|--------|---------|
| 🗺️ Geolocalización GPS | Tarifa de domicilio calculada automáticamente por distancia real |
| ❌ Sin zonas manuales | Eliminado Sur / Norte / Oriente / Occidente |
| 🛵 Categoría "Domicilio" | Nueva sección en el menú con tarifas, tiempos y cobertura |
| 📊 Exportar a Excel | Al confirmar pedido con comprobante → descarga automática de .csv abierto en Excel |
| 🌐 Listo para Netlify | Proyecto Vite + React con `netlify.toml` incluido |

---

## Despliegue en Netlify (3 pasos)

### Opción A — Drag & Drop (más fácil)
1. Ejecuta localmente: `npm install && npm run build`
2. Ve a [netlify.com](https://netlify.com) → "Add new site" → "Deploy manually"
3. Arrastra la carpeta `dist/` generada

### Opción B — GitHub + Netlify (recomendado para actualizaciones)
1. Sube este proyecto a un repositorio GitHub
2. En Netlify: "Add new site" → "Import from Git" → selecciona el repo
3. Netlify detecta automáticamente el `netlify.toml`
4. Cada push a `main` redespliega automáticamente

---

## Desarrollo local

```bash
npm install
npm run dev
# Abre http://localhost:5173
```

---

## Configuración del restaurante

Edita el objeto `CONFIG` al inicio de `src/App.jsx`:

```js
CONFIG.restaurante = {
  lat: 10.3910,   // ← Coordenadas REALES del restaurante
  lng: -75.4794,  // ← (Google Maps → click derecho → "¿Qué hay aquí?")
  whatsapp: "573164216819",
  nequi: "316 421 6819",
  ...
}
```

### Tarifas de domicilio por distancia
```js
CONFIG.tarifasDomicilio = [
  { hasta: 1.5,  precio: 3000,  label: "Muy cerca · <1.5 km" },
  { hasta: 3.0,  precio: 4000,  label: "Cerca · 1.5-3 km" },
  { hasta: 5.0,  precio: 5000,  label: "Zona media · 3-5 km" },
  { hasta: 8.0,  precio: 6500,  label: "Zona lejana · 5-8 km" },
  { hasta: 12.0, precio: 8000,  label: "Zona extendida · 8-12 km" },
]
```

---

## Cómo funciona el Excel

Cuando un cliente confirma un pedido con comprobante (Nequi/Daviplata):
1. Se abre WhatsApp automáticamente con el resumen del pedido
2. **Se descarga un archivo `.csv`** con todos los datos del pedido
3. El archivo se abre directamente en Excel (doble clic)
4. Incluye: fecha, nombre, teléfono, dirección, distancia km, productos, totales y nota de comprobante

**Para acumular todos los pedidos en un solo Excel:**
- Usa el Panel Admin → tab "Pedidos" → botón "Exportar Excel"
- Esto descarga TODOS los pedidos en un solo archivo

---

## Panel Admin
Accede en: `https://tu-sitio.netlify.app/#admin`
