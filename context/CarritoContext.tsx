"use client";

import { createContext, useContext, useMemo, useState } from "react";

export interface ItemCarrito {
  id: string;
  nombre: string;
  precio: number | null; // null => "Consultar"
  cantidad: number;
}

interface CarritoContextValue {
  items: ItemCarrito[];
  abierto: boolean;
  setAbierto: (abierto: boolean) => void;
  agregarItem: (producto: { id: string; nombre: string; precio?: number | null }) => void;
  cambiarCantidad: (id: string, delta: number) => void;
  quitarItem: (id: string) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  subtotalConPrecio: number;
  tieneItemsSinPrecio: boolean;
}

const CarritoContext = createContext<CarritoContextValue | null>(null);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [abierto, setAbierto] = useState(false);

  const agregarItem = (producto: {
    id: string;
    nombre: string;
    precio?: number | null;
  }) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio ?? null,
          cantidad: 1,
        },
      ];
    });
  };

  const cambiarCantidad = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + delta } : i))
        .filter((i) => i.cantidad > 0)
    );
  };

  const quitarItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const vaciarCarrito = () => setItems([]);

  const { totalItems, subtotalConPrecio, tieneItemsSinPrecio } = useMemo(() => {
    let total = 0;
    let subtotal = 0;
    let sinPrecio = false;

    for (const item of items) {
      total += item.cantidad;
      if (typeof item.precio === "number") {
        subtotal += item.precio * item.cantidad;
      } else {
        sinPrecio = true;
      }
    }

    return {
      totalItems: total,
      subtotalConPrecio: subtotal,
      tieneItemsSinPrecio: sinPrecio,
    };
  }, [items]);

  return (
    <CarritoContext.Provider
      value={{
        items,
        abierto,
        setAbierto,
        agregarItem,
        cambiarCantidad,
        quitarItem,
        vaciarCarrito,
        totalItems,
        subtotalConPrecio,
        tieneItemsSinPrecio,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) {
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  }
  return ctx;
}