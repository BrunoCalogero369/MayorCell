"use client";

import { useState } from "react";
import { Minus, Plus, Send, ShoppingCart, Trash2, X } from "lucide-react";
import { useCarrito } from "../context/CarritoContext";

const NUMERO_WHATSAPP = "3417120309";

function formatearPesos(valor: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function BotonCarrito({ className = "" }: { className?: string }) {
  const { totalItems, setAbierto } = useCarrito();

  return (
    <button
      type="button"
      onClick={() => setAbierto(true)}
      aria-label="Abrir carrito de repuestos"
      className={`inline-flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/15 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 ${className}`}
    >
      <ShoppingCart className="w-4 h-4 text-blue-400" />
      <span></span>
      <span className="min-w-5 h-5 px-1.5 rounded-full bg-blue-500 text-white text-[11px] font-bold flex items-center justify-center">
        {totalItems}
      </span>
    </button>
  );
}

export default function CarritoDrawer() {
  const {
    items,
    abierto,
    setAbierto,
    cambiarCantidad,
    quitarItem,
    vaciarCarrito,
    subtotalConPrecio,
    tieneItemsSinPrecio,
  } = useCarrito();

  const [nombreCliente, setNombreCliente] = useState("");
  const [nota, setNota] = useState("");

  if (!abierto) return null;

  const construirTicketWhatsApp = () => {
    const lineas: string[] = [
      "Hola MAYORCELL! Quiero consultar/pedir estos repuestos:",
      "",
    ];

    if (nombreCliente.trim()) {
      lineas.push(`Cliente: ${nombreCliente.trim()}`);
    }

    for (const item of items) {
      const precioTexto =
        typeof item.precio === "number"
          ? `${formatearPesos(item.precio * item.cantidad)} (${formatearPesos(item.precio)} c/u)`
          : "A consultar";
      lineas.push(`• ${item.cantidad}x ${item.nombre} — ${precioTexto}`);
    }

    lineas.push("");
    if (subtotalConPrecio > 0) {
      lineas.push(
        `Subtotal estimado: ${formatearPesos(subtotalConPrecio)}${
          tieneItemsSinPrecio ? " (+ ítems a consultar)" : ""
        }`
      );
    } else {
      lineas.push("Total: A consultar");
    }

    if (nota.trim()) {
      lineas.push(`Nota: ${nota.trim()}`);
    }

    return lineas.join("\n");
  };

  const enviarPorWhatsApp = () => {
    if (items.length === 0) return;
    const texto = construirTicketWhatsApp();
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-neutral-950 border-l border-white/10 h-full flex flex-col justify-between p-5 text-white shadow-2xl">
        {/* CABECERA */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold">Tu pedido / ticket</h2>
          </div>
          <button
            type="button"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar carrito"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LISTA DE ÍTEMS */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-neutral-400 text-sm">
              Todavía no agregaste repuestos al ticket.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {item.nombre}
                  </p>
                  <p className="text-xs text-blue-400 font-medium mt-0.5">
                    {typeof item.precio === "number"
                      ? formatearPesos(item.precio * item.cantidad)
                      : "Consultar"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(item.id, -1)}
                    aria-label="Restar unidad"
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold">
                    {item.cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(item.id, 1)}
                    aria-label="Sumar unidad"
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => quitarItem(item.id)}
                    aria-label="Eliminar ítem"
                    className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center ml-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DATOS OPCIONALES + RESUMEN + ENVIAR */}
        {items.length > 0 && (
          <div className="border-t border-white/10 pt-4 space-y-3">
            <input
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              placeholder="Tu nombre o local (opcional)"
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/60"
            />
            <input
              type="text"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Aclaración o envío (opcional)"
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/60"
            />

            <div className="flex items-center justify-between text-sm pt-1">
              <span className="text-neutral-400">Subtotal estimado</span>
              <span className="font-bold text-white">
                {subtotalConPrecio > 0
                  ? `${formatearPesos(subtotalConPrecio)}${
                      tieneItemsSinPrecio ? " + consultar" : ""
                    }`
                  : "Consultar"}
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={vaciarCarrito}
                className="px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 cursor-pointer"
              >
                Vaciar
              </button>
              <button
                type="button"
                onClick={enviarPorWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-neutral-950 font-bold text-sm py-3 px-4 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Mandar ticket por WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}