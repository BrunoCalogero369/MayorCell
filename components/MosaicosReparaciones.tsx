"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, Smartphone, Wrench, X } from "lucide-react";
import { MODELOS_REPARACIONES } from "../data/reparaciones";

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function MosaicosReparaciones() {
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({});
  const [busqueda, setBusqueda] = useState("");
  const [lineaActiva, setLineaActiva] = useState("Todos");

  const lineas = useMemo(() => {
    const unicas = Array.from(
      new Set(MODELOS_REPARACIONES.map((item) => item.linea))
    );
    return ["Todos", ...unicas];
  }, []);

  const modelosFiltrados = useMemo(() => {
    const consulta = normalizarTexto(busqueda);

    return MODELOS_REPARACIONES.filter((item) => {
      const coincideLinea =
        lineaActiva === "Todos" || item.linea === lineaActiva;
      const coincideTexto =
        !consulta ||
        normalizarTexto(`${item.modelo} ${item.linea}`).includes(consulta);

      return coincideLinea && coincideTexto;
    });
  }, [busqueda, lineaActiva]);

  const toggleMosaico = (id: string) => {
    setAbiertos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(precio);
  };

  return (
    <section
      id="reparaciones"
      className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto"
    >
      {/* ENCABEZADO */}
      <div className="mb-8 sm:mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          Servicio Técnico Especializado
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
          Reparaciones por modelo
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl">
          Tocá la flecha en el modelo de tu iPhone para desplegar las
          reparaciones más comunes.
        </p>
      </div>

      {/* BUSCADOR + FILTRO POR SERIE */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscá tu modelo... ej: iPhone 14 Pro, 11, XR, 15 Pro Max"
            className="w-full bg-neutral-900/90 border border-white/10 focus:border-blue-500/60 focus:outline-none rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base text-white placeholder:text-neutral-500 transition-colors"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda("")}
              aria-label="Limpiar búsqueda de modelo"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {lineas.map((linea) => {
            const activa = linea === lineaActiva;
            return (
              <button
                key={linea}
                type="button"
                onClick={() => setLineaActiva(linea)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activa
                    ? "bg-white text-neutral-950 shadow-md"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-white/10"
                }`}
              >
                {linea}
              </button>
            );
          })}
        </div>
      </div>

      {/* MOSAICOS DESPLEGABLES */}
      {modelosFiltrados.length === 0 ? (
        <div className="text-center py-14 px-4 rounded-3xl bg-neutral-900/50 border border-white/10">
          <p className="text-neutral-300 font-medium">
            No encontramos ese modelo en la lista.
          </p>
          <button
            type="button"
            onClick={() => {
              setBusqueda("");
              setLineaActiva("Todos");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm text-white transition-colors"
          >
            Ver todos los modelos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {modelosFiltrados.map((item) => {
            const estaAbierto = !!abiertos[item.id];

            return (
              <article
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  estaAbierto
                    ? "bg-neutral-900 border-blue-500/40 shadow-xl shadow-black/40"
                    : "bg-neutral-900/70 border-white/10 hover:border-white/25"
                }`}
              >
                {/* CABECERA DEL MOSAICO CON FLECHITA HACIA ABAJO */}
                <button
                  type="button"
                  onClick={() => toggleMosaico(item.id)}
                  aria-expanded={estaAbierto}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-medium text-neutral-400 block">
                        {item.linea}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white truncate">
                        {item.modelo}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      estaAbierto ? "rotate-180 bg-blue-500/15 border-blue-500/30 text-blue-300" : "text-neutral-300"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </button>

                {/* CONTENIDO QUE SE ESTIRA AL TOCAR LA FLECHA */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    estaAbierto
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-white/10 space-y-2.5">
                      {item.reparaciones.map((rep) => (
                        <div
                          key={rep.servicio}
                          className="flex items-center justify-between gap-3 py-2 px-3 rounded-xl bg-neutral-950/70 border border-white/5 text-xs sm:text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Wrench className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <div className="truncate">
                              <span className="text-neutral-200 font-medium">
                                {rep.servicio}
                              </span>
                              {rep.demora && (
                                <span className="text-[11px] text-neutral-500 ml-2">
                                  ({rep.demora})
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="font-bold text-blue-400 shrink-0">
                            {rep.precio !== null
                              ? formatearPrecio(rep.precio)
                              : "Consultar"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}