"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  PackageCheck,
  PackageX,
  ShoppingCart,
  Check,
  X,
} from "lucide-react";
import { REPUESTOS } from "../data/repuestos";
import { useCarrito } from "../context/CarritoContext";

const ITEMS_POR_PAGINA = 10;

export default function CatalogoRepuestos() {
  const { agregarItem, setAbierto } = useCarrito();

  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [agregadoId, setAgregadoId] = useState<string | null>(null);

  // Extrae categorías únicas automáticamente
  const categorias = useMemo(() => {
    const unicas = Array.from(new Set(REPUESTOS.map((item) => item.categoria)));
    return ["Todos", ...unicas];
  }, []);

  // Normalizar texto sin tildes ni mayúsculas
  function normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // Filtra según búsqueda, categoría y stock
  const repuestosFiltrados = useMemo(() => {
    const consultaNormalizada = normalizarTexto(busqueda);

    return REPUESTOS.filter((item) => {
      const coincideCategoria =
        categoriaActiva === "Todos" || item.categoria === categoriaActiva;
      const coincideStock = !soloDisponibles || item.disponibles > 0;

      const textoItemNormalizado = normalizarTexto(
        `${item.nombre} ${item.categoria} ${item.codigo ?? ""}`
      );

      const coincideTexto =
        !consultaNormalizada ||
        textoItemNormalizado.includes(consultaNormalizada);

      return coincideCategoria && coincideStock && coincideTexto;
    });
  }, [busqueda, categoriaActiva, soloDisponibles]);

  // Cálculo de paginación (10 por página)
  const totalPaginas = Math.max(
    1,
    Math.ceil(repuestosFiltrados.length / ITEMS_POR_PAGINA)
  );
  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const indiceInicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const repuestosPagina = repuestosFiltrados.slice(
    indiceInicio,
    indiceInicio + ITEMS_POR_PAGINA
  );

  const handleCambioFiltro = (
    nuevoTexto: string,
    nuevaCategoria: string,
    nuevoStock: boolean
  ) => {
    setBusqueda(nuevoTexto);
    setCategoriaActiva(nuevaCategoria);
    setSoloDisponibles(nuevoStock);
    setPaginaActual(1);
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(precio);
  };

  const irAPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
    const seccion = document.getElementById("repuestos");
    if (seccion) {
      seccion.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAgregarAlCarrito = (item: (typeof REPUESTOS)[number]) => {
    agregarItem({
      id: item.id,
      nombre: item.codigo ? `${item.nombre} (${item.codigo})` : item.nombre,
      precio: item.precio,
    });
    setAgregadoId(item.id);
    window.setTimeout(() => {
      setAgregadoId((prev) => (prev === item.id ? null : prev));
    }, 1100);
  };

  return (
    <section
      id="repuestos"
      className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10"
    >
      {/* ENCABEZADO DE SECCIÓN */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Venta al gremio y público
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
            Catálogo de Repuestos
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl">
            Buscá por modelo de iPhone, tipo de pieza o código. Mostrando{" "}
            {repuestosPagina.length} de {repuestosFiltrados.length} repuestos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Toggle solo en stock */}
          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none bg-neutral-900 border border-white/10 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-neutral-300 hover:border-white/20 transition-colors">
            <input
              type="checkbox"
              checked={soloDisponibles}
              onChange={(e) =>
                handleCambioFiltro(busqueda, categoriaActiva, e.target.checked)
              }
              className="rounded border-neutral-700 bg-neutral-800 text-blue-500 focus:ring-blue-500"
            />
            <span>Mostrar solo con stock disponible</span>
          </label>

          {/* Acceso directo al ticket */}
          <button
            type="button"
            onClick={() => setAbierto(true)}
            className="inline-flex items-center gap-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Ver ticket</span>
          </button>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA + PILLS DE CATEGORÍA */}
      <div className="space-y-4 mb-8">
        {/* Buscador */}
        <div className="relative">
          <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) =>
              handleCambioFiltro(e.target.value, categoriaActiva, soloDisponibles)
            }
            placeholder="Ej: iPhone 14 Pro, Módulo OLED, Glass, Batería, Flex..."
            className="w-full bg-neutral-900/90 border border-white/10 focus:border-blue-500/60 focus:outline-none rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base text-white placeholder:text-neutral-500 transition-colors"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() =>
                handleCambioFiltro("", categoriaActiva, soloDisponibles)
              }
              aria-label="Limpiar búsqueda"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtros por categoría (scroll horizontal cómodo en celular) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categorias.map((cat) => {
            const activa = cat === categoriaActiva;
            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  handleCambioFiltro(busqueda, cat, soloDisponibles)
                }
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activa
                    ? "bg-white text-neutral-950 shadow-md"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* GRILLA DE MOSAICOS (10 POR PÁGINA) */}
      {repuestosPagina.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-neutral-900/50 border border-white/10">
          <p className="text-neutral-300 font-medium">
            No encontramos repuestos con esa búsqueda.
          </p>
          <button
            type="button"
            onClick={() => handleCambioFiltro("", "Todos", false)}
            className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm text-white transition-colors"
          >
            Ver todos los repuestos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {repuestosPagina.map((item) => {
            const hayStock = item.disponibles > 0;
            const recienAgregado = agregadoId === item.id;

            return (
              <article
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl bg-neutral-900/70 border border-white/10 hover:border-white/25 overflow-hidden transition-all duration-300"
              >
                <div>
                  {/* ESPACIO PARA LA FOTO DEL REPUESTO */}
                  <div className="relative aspect-square w-full bg-neutral-950 border-b border-white/5 overflow-hidden">
                    {item.imagen ? (
                      <Image
                        src={item.imagen}
                        alt={item.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-neutral-900 to-neutral-950">
                        <ImageOff className="w-7 h-7 text-neutral-700 mb-2" />
                        <span className="text-[11px] font-medium text-neutral-600">
                          Foto pendiente
                        </span>
                      </div>
                    )}

                    {/* Etiqueta de categoría */}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-white/10 text-[11px] font-medium text-neutral-300">
                      {item.categoria}
                    </span>
                  </div>

                  {/* DETALLE DEL REPUESTO */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-neutral-100 leading-snug line-clamp-3">
                      {item.nombre}
                    </h3>
                    {item.codigo && (
                      <p className="text-[11px] text-neutral-500 mt-1.5 font-mono">
                        Cód: {item.codigo}
                      </p>
                    )}
                  </div>
                </div>

                {/* PIE DE TARJETA: STOCK, PRECIO Y AGREGAR AL CARRITO */}
                <div className="px-4 pb-4 pt-2 border-t border-white/5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs">
                    {hayStock ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <PackageCheck className="w-3.5 h-3.5" />
                        {item.disponibles} disp.
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-400/90 font-medium">
                        <PackageX className="w-3.5 h-3.5" />
                        Consultar ingreso
                      </span>
                    )}

                    {item.notaPrecio && (
                      <span className="text-[10px] text-neutral-400">
                        {item.notaPrecio}
                      </span>
                    )}
                  </div>

                  <div>
                    {item.precio !== null ? (
                      <span className="text-xl font-extrabold text-white tracking-tight">
                        {formatearPrecio(item.precio)}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-blue-400">
                        Consultar precio
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAgregarAlCarrito(item)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      recienAgregado
                        ? "bg-emerald-500 text-neutral-950"
                        : "bg-white/10 hover:bg-white text-white hover:text-neutral-950 border border-white/10"
                    }`}
                  >
                    {recienAgregado ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Agregado al ticket</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Agregar al carrito</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* PAGINACIÓN (10 POR PÁGINA) */}
      {totalPaginas > 1 && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <p className="text-xs sm:text-sm text-neutral-400">
            Página <span className="text-white font-semibold">{paginaSegura}</span>{" "}
            de <span className="text-white font-semibold">{totalPaginas}</span>
          </p>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => irAPagina(paginaSegura - 1)}
              disabled={paginaSegura === 1}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs sm:text-sm text-neutral-200 hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => irAPagina(num)}
                className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  num === paginaSegura
                    ? "bg-white text-neutral-950"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-white/10"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={() => irAPagina(paginaSegura + 1)}
              disabled={paginaSegura === totalPaginas}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs sm:text-sm text-neutral-200 hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}