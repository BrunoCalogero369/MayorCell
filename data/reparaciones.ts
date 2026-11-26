export interface OpcionReparacion {
  servicio: string;
  precio: number | null; // null => muestra "Consultar"
  demora?: string;
}

export interface ModeloReparacion {
  id: string;
  modelo: string;
  linea: string;
  reparaciones: OpcionReparacion[];
}

const REPARACIONES_BASE: OpcionReparacion[] = [
  { servicio: "Reparación batería", precio: null, demora: "En el día" },
  { servicio: "Reparación pantalla", precio: null, demora: "En el acto" },
  { servicio: "Cambio de glass", precio: null, demora: "24 hs" },
  { servicio: "Pin de carga / flex", precio: null, demora: "En el día" },
  { servicio: "Cámaras / Face ID", precio: null, demora: "A revisar" },
];

export const MODELOS_REPARACIONES: ModeloReparacion[] = [
  // Línea X / XR / XS
  { id: "iphone-x", modelo: "iPhone X", linea: "Serie X", reparaciones: REPARACIONES_BASE },
  { id: "iphone-xr", modelo: "iPhone XR", linea: "Serie X", reparaciones: REPARACIONES_BASE },
  { id: "iphone-xs", modelo: "iPhone XS", linea: "Serie X", reparaciones: REPARACIONES_BASE },
  { id: "iphone-xs-max", modelo: "iPhone XS Max", linea: "Serie X", reparaciones: REPARACIONES_BASE },

  // Línea 11
  { id: "iphone-11", modelo: "iPhone 11", linea: "Serie 11", reparaciones: REPARACIONES_BASE },
  { id: "iphone-11-pro", modelo: "iPhone 11 Pro", linea: "Serie 11", reparaciones: REPARACIONES_BASE },
  { id: "iphone-11-pro-max", modelo: "iPhone 11 Pro Max", linea: "Serie 11", reparaciones: REPARACIONES_BASE },

  // Línea 12
  { id: "iphone-12-mini", modelo: "iPhone 12 Mini", linea: "Serie 12", reparaciones: REPARACIONES_BASE },
  { id: "iphone-12", modelo: "iPhone 12", linea: "Serie 12", reparaciones: REPARACIONES_BASE },
  { id: "iphone-12-pro", modelo: "iPhone 12 Pro", linea: "Serie 12", reparaciones: REPARACIONES_BASE },
  { id: "iphone-12-pro-max", modelo: "iPhone 12 Pro Max", linea: "Serie 12", reparaciones: REPARACIONES_BASE },

  // Línea 13
  { id: "iphone-13-mini", modelo: "iPhone 13 Mini", linea: "Serie 13", reparaciones: REPARACIONES_BASE },
  { id: "iphone-13", modelo: "iPhone 13", linea: "Serie 13", reparaciones: REPARACIONES_BASE },
  { id: "iphone-13-pro", modelo: "iPhone 13 Pro", linea: "Serie 13", reparaciones: REPARACIONES_BASE },
  { id: "iphone-13-pro-max", modelo: "iPhone 13 Pro Max", linea: "Serie 13", reparaciones: REPARACIONES_BASE },

  // Línea 14
  { id: "iphone-14", modelo: "iPhone 14", linea: "Serie 14", reparaciones: REPARACIONES_BASE },
  { id: "iphone-14-plus", modelo: "iPhone 14 Plus", linea: "Serie 14", reparaciones: REPARACIONES_BASE },
  { id: "iphone-14-pro", modelo: "iPhone 14 Pro", linea: "Serie 14", reparaciones: REPARACIONES_BASE },
  { id: "iphone-14-pro-max", modelo: "iPhone 14 Pro Max", linea: "Serie 14", reparaciones: REPARACIONES_BASE },

  // Línea 15
  { id: "iphone-15", modelo: "iPhone 15", linea: "Serie 15", reparaciones: REPARACIONES_BASE },
  { id: "iphone-15-plus", modelo: "iPhone 15 Plus", linea: "Serie 15", reparaciones: REPARACIONES_BASE },
  { id: "iphone-15-pro", modelo: "iPhone 15 Pro", linea: "Serie 15", reparaciones: REPARACIONES_BASE },
  { id: "iphone-15-pro-max", modelo: "iPhone 15 Pro Max", linea: "Serie 15", reparaciones: REPARACIONES_BASE },

  // Línea 16
  { id: "iphone-16", modelo: "iPhone 16", linea: "Serie 16", reparaciones: REPARACIONES_BASE },
  { id: "iphone-16-plus", modelo: "iPhone 16 Plus", linea: "Serie 16", reparaciones: REPARACIONES_BASE },
  { id: "iphone-16-pro", modelo: "iPhone 16 Pro", linea: "Serie 16", reparaciones: REPARACIONES_BASE },
  { id: "iphone-16-pro-max", modelo: "iPhone 16 Pro Max", linea: "Serie 16", reparaciones: REPARACIONES_BASE },
];