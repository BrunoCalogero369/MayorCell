"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import wa from "@/public/images/icons8-whatsapp-48.png";

export default function Banner() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragState.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragState.current.moved = true;
    }

    setOffset({
      x: dragState.current.originX + dx,
      y: dragState.current.originY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (!dragState.current.moved) {
      // Cambiá el número por el real del local (sin + ni espacios)
      window.open("https://wa.me/3417120309", "_blank", "noreferrer");
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      className="fixed bottom-8 right-6 z-[9999] cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <div className="bg-[#25D366] w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200 active:scale-95">
        <Image
          width={35}
          height={35}
          alt="WhatsApp"
          src={wa}
          className="pointer-events-none select-none"
        />
      </div>
    </div>
  );
}