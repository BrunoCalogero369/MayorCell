"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Wrench,
  Smartphone,
  ArrowRight,
  Home as HomeIcon,
  MapPin,
} from "lucide-react";
import CatalogoRepuestos from "../components/CatalogoRepuestos";
import BannerWhatsApp from "../components/BannerWhatsApp";
import MosaicosReparaciones from "../components/MosaicosReparaciones";
import { CarritoProvider } from "../context/CarritoContext";
import CarritoDrawer, { BotonCarrito } from "../components/CarritoDrawer";

const HERO_IMAGES = [
  "/images/IMG_8238.jpeg",
  "/images/IMG_8650.PNG",
  "/images/IMG_8649.PNG",
];

type Seccion = "inicio" | "reparaciones" | "repuestos";

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [seccionActiva, setSeccionActiva] = useState<Seccion>("inicio");

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const irASeccion = (nuevaSeccion: Seccion) => {
    setSeccionActiva(nuevaSeccion);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <CarritoProvider>
      <main className="min-h-screen bg-neutral-950 text-white selection:bg-blue-500 selection:text-white">
        {/* NAVBAR CONTEXTUAL (solo visible fuera de inicio) */}
        <header
          className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
            seccionActiva !== "inicio"
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3">
            <div className="bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-2 shadow-2xl">
              <button
                type="button"
                onClick={() => irASeccion("inicio")}
                className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-200 hover:text-white transition-colors cursor-pointer"
              >
                <HomeIcon className="w-4 h-4 text-blue-400" />
                <span>Inicio</span>
              </button>

              <nav className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-medium">
                <button
                  type="button"
                  onClick={() => irASeccion("reparaciones")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    seccionActiva === "reparaciones"
                      ? "bg-white text-neutral-950"
                      : "text-neutral-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Reparaciones
                </button>
                <button
                  type="button"
                  onClick={() => irASeccion("repuestos")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    seccionActiva === "repuestos"
                      ? "bg-white text-neutral-950"
                      : "text-neutral-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Repuestos
                </button>
                <BotonCarrito />
              </nav>
            </div>
          </div>
        </header>

        {/* HERO SECTION (PANTALLA DE INICIO) */}
        {seccionActiva === "inicio" && (
          <section
            id="inicio"
            className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden"
          >
            {/* Carrusel de fotos de fondo */}
            <div className="absolute inset-0 z-0 bg-neutral-950">
              {HERO_IMAGES.map((src, index) => {
                const isActive = index === currentImageIndex;

                return (
                  <Image
                    key={`${src}-${index}`}
                    src={src}
                    alt={`Foto del local Mayorcell ${index + 1}`}
                    fill
                    className={`object-cover object-center scale-105 transition-opacity duration-1000 ${
                      isActive ? "opacity-50 z-10" : "opacity-0 z-0"
                    }`}
                    priority={index === 0}
                  />
                );
              })}
              <div className="absolute inset-0 z-20 bg-gradient-to-b from-neutral-950/85 via-neutral-950/60 to-neutral-950" />
            </div>

            {/* CABECERA SUPERIOR DEL INICIO: LOGO + CARRITO */}
            <div className="relative z-40 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 flex items-start justify-between gap-4">
              <button
                type="button"
                onClick={() => irASeccion("inicio")}
                className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border border-white/15 shadow-2xl block shrink-0 bg-neutral-900/50 cursor-pointer"
              >
                <Image
                  src="/images/logo.png"
                  alt="Mayorcell"
                  fill
                  className="object-cover"
                  priority
                />
              </button>

              <BotonCarrito />
            </div>

            {/* CONTENIDO CENTRAL DEL HERO */}
            <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:my-auto w-full">
              <div className="max-w-2xl space-y-5 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
                  Servicio Técnico Especializado Apple
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.12]">
                  Tu iPhone como nuevo,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">
                    en el día y con garantía.
                  </span>
                </h1>

                <p className="text-sm sm:text-lg text-neutral-400 max-w-xl leading-relaxed">
                  Reparaciones express con repuestos de calidad original y venta
                  directa al público. Elegí tu modelo y consultá los valores al
                  instante.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => irASeccion("reparaciones")}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-neutral-950 hover:bg-neutral-200 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg shadow-white/5 cursor-pointer"
                  >
                    <Wrench className="w-4 h-4 shrink-0" />
                    Ver precios de reparación
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => irASeccion("repuestos")}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-800 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base backdrop-blur-md transition-all cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-neutral-400 shrink-0" />
                    Catálogo de repuestos
                  </button>
                </div>
              </div>
            </div>

            {/* BARRA INFERIOR */}
            <div className="relative z-40 border-t border-white/10 bg-neutral-950/65 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-neutral-400">
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-6">
                  <span>⚡ Reparaciones en el acto</span>
                  <span>🛡️ Garantía en todos nuestros trabajos</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 lg:pt-0">
                  <a
                    href="https://www.instagram.com/mayorcell1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de Mayorcell"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-400" />
                    <span>Instagram</span>
                  </a>

                  <a
                    href="https://tiktok.com/@mayorcell1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok de Mayorcell"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 transition-colors"
                  >
                    <TikTokIcon className="w-4 h-4 text-cyan-300" />
                    <span>TikTok</span>
                  </a>

                  <a
                    href="https://share.google/nn0fmDXY6OSxnuaN3"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Dónde estamos"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Dónde estamos</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN REPUESTOS */}
        {seccionActiva === "repuestos" && (
          <div className="pt-16">
            <CatalogoRepuestos />
          </div>
        )}

        {/* SECCIÓN REPARACIONES */}
        {seccionActiva === "reparaciones" && (
          <div className="pt-16">
            <MosaicosReparaciones />
          </div>
        )}

        <CarritoDrawer />
        <BannerWhatsApp />
      </main>
    </CarritoProvider>
  );
}