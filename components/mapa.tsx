"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import L from "leaflet"
import { TIPO_LABEL, type Sucursal } from "@/lib/types"
import { comunasDisponibles } from "@/lib/sucursales"
import { distanciaKm } from "@/lib/search"

const TIPO_PIN: Record<string, string> = {
  tradicional: "/pins/pin-tradicional.png",
  "24/7": "/pins/pin-247.png",
  "soy-starken": "/pins/pin-soy-starken.png",
  "red-alianzas": "/pins/pin-alianzas.png",
}

function makeIcon(tipo: string, active: boolean) {
  const src = TIPO_PIN[tipo] ?? TIPO_PIN.tradicional
  return L.divIcon({
    className: `starken-pin${active ? " is-active" : ""}`,
    html: `<img src="${src}" alt="" />`,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -42],
  })
}

function popupHtml(s: Sucursal) {
  const estadoColor = s.estado === "abierto" ? "#2c8a3d" : "#c0392b"
  const estadoLabel = s.estado === "abierto" ? "ABIERTO" : "CERRADO"
  return `
  <div style="padding:14px 16px;font-family:inherit;">
    <div style="display:inline-block;font-size:11px;font-weight:600;color:#2c8a3d;background:#e8f3ea;border-radius:999px;padding:2px 8px;margin-bottom:8px;">${TIPO_LABEL[s.tipo]}</div>
    <div style="font-size:14px;font-weight:700;color:#2b2b2b;line-height:1.3;">${s.nombre}</div>
    <div style="font-size:12px;color:#6b6b6b;margin-top:4px;line-height:1.4;">${s.direccion}</div>
    <div style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:12px;font-weight:700;letter-spacing:0.02em;color:${estadoColor};">
      <span style="width:8px;height:8px;border-radius:999px;background:${estadoColor};display:inline-block;"></span>${estadoLabel}
    </div>
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid #eee;text-align:center;">
      <a href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}" target="_blank" rel="noopener noreferrer" style="color:#1e7e45;text-decoration:none;font-weight:600;font-size:13px;display:inline-flex;align-items:center;gap:4px;">
        Cómo llegar
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
      </a>
    </div>
  </div>`
}

interface MapaProps {
  sucursales: Sucursal[]
  sucursalActivaId: string | null
  onPinClick: (id: string) => void
  isDefaultView?: boolean
  referencia?: { lat: number; lng: number } | null
  referenciaLabel?: string | null
}

const SANTIAGO_CENTER: [number, number] = [-33.45, -70.66]

export default function Mapa({
  sucursales,
  sucursalActivaId,
  onPinClick,
  isDefaultView = false,
  referencia = null,
  referenciaLabel = null,
}: MapaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const referenceMarkerRef = useRef<L.Marker | null>(null)
  const onPinClickRef = useRef(onPinClick)
  onPinClickRef.current = onPinClick

  // Inicializa el mapa una sola vez.
  useEffect(() => {
    if (map || !containerRef.current) return
    const mapInstance = L.map(containerRef.current, {
      center: SANTIAGO_CENTER,
      zoom: 10,
      zoomControl: false,
      attributionControl: true,
    })
    L.control.zoom({ position: "bottomright" }).addTo(mapInstance)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(mapInstance)
    setMap(mapInstance)

    return () => {
      mapInstance.remove()
      setMap(null)
    }
  }, [])

  // Sincroniza el marcador de referencia (dirección buscada o ubicación GPS).
  useEffect(() => {
    if (!map || !map.getContainer()) return

    // Eliminar marcador anterior si existe
    if (referenceMarkerRef.current) {
      referenceMarkerRef.current.remove()
      referenceMarkerRef.current = null
    }

    if (referencia) {
      const isComuna = referenciaLabel && comunasDisponibles.some(
        (c) => c.toLowerCase().trim() === referenciaLabel.toLowerCase().trim(),
      )
      const title = referenciaLabel
        ? isComuna
          ? `Comuna: ${referenciaLabel}`
          : `Dirección: ${referenciaLabel}`
        : "Tu ubicación actual"

      const refIcon = L.divIcon({
        className: "custom-reference-pin",
        html: `
          <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 14px; height: 14px; background-color: #3b82f6; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 2;"></div>
            <div class="animate-ping" style="position: absolute; width: 22px; height: 22px; background-color: rgba(59, 130, 246, 0.4); border-radius: 50%; z-index: 1;"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([referencia.lat, referencia.lng], { icon: refIcon })
        .bindPopup(`<div style="padding:10px 12px; font-weight:600; font-size:12px; color:#2b2b2b; font-family:inherit;">${title}</div>`)
        .addTo(map)

      referenceMarkerRef.current = marker
    }

    return () => {
      if (referenceMarkerRef.current) {
        referenceMarkerRef.current.remove()
        referenceMarkerRef.current = null
      }
    }
  }, [map, referencia, referenciaLabel])

  const sucursalesKey = useMemo(
    () => sucursales.map((s) => s.id).join(","),
    [sucursales],
  )

  // Sincroniza marcadores cuando cambian las sucursales y ajusta el zoom.
  useEffect(() => {
    if (!map || !map.getContainer()) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current.clear()

    sucursales.forEach((s) => {
      const marker = L.marker([s.lat, s.lng], {
        icon: makeIcon(s.tipo, false),
      })
      marker.bindPopup(popupHtml(s), { closeButton: true })
      marker.on("click", () => onPinClickRef.current(s.id))
      marker.addTo(map)
      markersRef.current.set(s.id, marker)
    })

    // Asegurar que Leaflet recalcule el tamaño del contenedor
    map.invalidateSize()

    // --- Comportamiento clave del spec: fitBounds sobre todos los pins ---
    if (isDefaultView) {
      const rmPoints = sucursales.filter((s) => s.region === "Región Metropolitana")
      if (rmPoints.length > 0) {
        const bounds = L.latLngBounds(
          rmPoints.map((s) => [s.lat, s.lng] as [number, number]),
        )
        map.fitBounds(bounds, { padding: [40, 40], animate: true })
      } else {
        map.setView(SANTIAGO_CENTER, 10, { animate: true })
      }
    } else if (sucursales.length === 0) {
      // Caso borde: 0 sucursales -> centrar en referencia si existe, de lo contrario centro de Santiago.
      if (referencia) {
        map.setView([referencia.lat, referencia.lng], 13, { animate: true })
      } else {
        map.setView(SANTIAGO_CENTER, 11, { animate: true })
      }
    } else if (sucursales.length === 1) {
      // Caso borde: 1 sucursal -> zoom máximo nivel 14. Si hay referencia, encuadrar ambos.
      if (referencia) {
        const bounds = L.latLngBounds([
          [sucursales[0].lat, sucursales[0].lng],
          [referencia.lat, referencia.lng],
        ])
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true })
      } else {
        map.setView([sucursales[0].lat, sucursales[0].lng], 14, { animate: true })
      }
    } else {
      let pointsToFit = sucursales
      if (referencia) {
        // Tomar solo las 10 más cercanas para calcular el zoom (fitBounds)
        const sorted = [...sucursales].sort((a, b) => {
          const distA = distanciaKm(referencia.lat, referencia.lng, a.lat, a.lng)
          const distB = distanciaKm(referencia.lat, referencia.lng, b.lat, b.lng)
          return distA - distB
        })
        pointsToFit = sorted.slice(0, 10)
      }

      const points = pointsToFit.map((s) => [s.lat, s.lng] as [number, number])
      if (referencia) {
        points.push([referencia.lat, referencia.lng])
      }
      const bounds = L.latLngBounds(points)
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16, animate: true })
    }
  }, [map, sucursalesKey, sucursales, isDefaultView, referencia])

  // Resalta el pin activo y abre su popup.
  useEffect(() => {
    if (!map || !map.getContainer()) return

    sucursales.forEach((s) => {
      const marker = markersRef.current.get(s.id)
      if (!marker) return
      const active = s.id === sucursalActivaId
      marker.setIcon(makeIcon(s.tipo, active))
    })

    if (sucursalActivaId) {
      const activa = sucursales.find((s) => s.id === sucursalActivaId)
      const marker = markersRef.current.get(sucursalActivaId)
      if (activa && marker) {
        map.panTo([activa.lat, activa.lng], { animate: true })
        marker.openPopup()
      }
    }
  }, [map, sucursalActivaId, sucursales])

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="application"
      aria-label="Mapa de sucursales Starken"
    />
  )
}
