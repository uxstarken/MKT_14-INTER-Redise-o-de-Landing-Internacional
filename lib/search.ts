import type { Sucursal, SucursalTipo } from "./types"

/** Normaliza texto: minúsculas y sin acentos, para búsqueda tolerante. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

/** Distancia Haversine en kilómetros entre dos coordenadas. */
export function distanciaKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export interface SucursalConDistancia extends Sucursal {
  distancia?: number
}

/**
 * Filtra sucursales por comuna (búsqueda tolerante) y tipo, y las ordena por
 * cercanía a un punto de referencia si se entrega.
 */
export function buscarSucursales(
  todas: Sucursal[],
  opciones: {
    comuna?: string
    tipo?: SucursalTipo | "todas"
    referencia?: { lat: number; lng: number }
  },
): SucursalConDistancia[] {
  const { comuna, tipo = "todas", referencia } = opciones
  const q = comuna ? normalizar(comuna) : ""

  let resultado: SucursalConDistancia[] = todas.filter((s) => {
    const coincideComuna = q ? normalizar(s.comuna).includes(q) : true
    const coincideTipo = tipo === "todas" ? true : s.tipo === tipo
    return coincideComuna && coincideTipo
  })

  if (referencia) {
    resultado = resultado.map((s) => ({
      ...s,
      distancia: distanciaKm(referencia.lat, referencia.lng, s.lat, s.lng),
    }))
    resultado.sort((a, b) => (a.distancia ?? 0) - (b.distancia ?? 0))
  } else if (q) {
    // Centro de la comuna como referencia para ordenar por cercanía interna.
    const enComuna = resultado
    if (enComuna.length > 0) {
      const centroLat =
        enComuna.reduce((acc, s) => acc + s.lat, 0) / enComuna.length
      const centroLng =
        enComuna.reduce((acc, s) => acc + s.lng, 0) / enComuna.length
      resultado = enComuna
        .map((s) => ({
          ...s,
          distancia: distanciaKm(centroLat, centroLng, s.lat, s.lng),
        }))
        .sort((a, b) => (a.distancia ?? 0) - (b.distancia ?? 0))
    }
  }

  return resultado
}

export function formatDistancia(km?: number): string | null {
  if (km == null) return null
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}
