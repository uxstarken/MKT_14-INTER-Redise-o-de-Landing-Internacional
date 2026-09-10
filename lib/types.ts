export interface SugerenciaBusqueda {
  texto: string
  tipo: "comuna" | "direccion"
  lat?: number
  lng?: number
}

export type SucursalTipo =
  | "tradicional"
  | "24/7"
  | "soy-starken"
  | "red-alianzas"

export type SucursalEstado = "abierto" | "cerrado"

export interface HorarioDia {
  dia: string
  apertura: string
  cierre: string
}

export interface Sucursal {
  id: string
  nombre: string
  direccion: string
  comuna: string
  region: string
  lat: number
  lng: number
  tipo: SucursalTipo
  estado: SucursalEstado
  horario: HorarioDia[]
  modalidades: string[]
  dimensionesMax: string
  ultimoRetiro: string
  telefono?: string
}

export const TIPO_LABEL: Record<SucursalTipo, string> = {
  tradicional: "Tradicional",
  "24/7": "24/7",
  "soy-starken": "Soy Starken",
  "red-alianzas": "Red de Alianzas",
}
