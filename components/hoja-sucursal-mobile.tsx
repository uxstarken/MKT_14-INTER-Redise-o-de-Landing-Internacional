"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, X } from "lucide-react"
import { TarjetaSucursal } from "@/components/tarjeta-sucursal"
import type { SucursalConDistancia } from "@/lib/search"

interface HojaSucursalMobileProps {
  sucursal: SucursalConDistancia
  onCerrar: () => void
}

/**
 * Bottom sheet (solo mobile) que cubre el 70% inferior de la pantalla.
 * Sube desde abajo con slide-up (300ms ease-out) y baja con el mismo timing.
 * Muestra la card de la sucursal completamente desplegada (igual a desktop).
 */
export function HojaSucursalMobile({ sucursal, onCerrar }: HojaSucursalMobileProps) {
  // visible controla la animación de entrada/salida.
  const [visible, setVisible] = useState(false)

  // Entrada: activa el slide-up en el siguiente frame.
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Salida: baja la hoja y luego desmonta tras la transición (300ms).
  const cerrar = useCallback(() => {
    setVisible(false)
    const t = setTimeout(onCerrar, 300)
    return () => clearTimeout(t)
  }, [onCerrar])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") cerrar()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [cerrar])

  return (
    <div className="fixed inset-0 z-[1100]">
      {/* Overlay oscuro sobre el 30% visible del mapa */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={cerrar}
        className="absolute inset-0 bg-foreground/40 transition-opacity duration-300 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* Hoja inferior: 70% de la altura, slide-up */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${sucursal.nombre}`}
        className="absolute inset-x-0 bottom-0 flex h-[70%] flex-col rounded-t-2xl border-t border-border bg-card shadow-2xl transition-transform duration-300 ease-out"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Header con flecha atrás y cerrar */}
        <div className="flex items-center justify-between border-b border-border px-2 py-1">
          <button
            type="button"
            onClick={cerrar}
            aria-label="Volver"
            className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Contenido con scroll: card completamente desplegada */}
        <div className="flex-1 overflow-y-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul>
            <TarjetaSucursal
              sucursal={sucursal}
              activa
              expandida
              onSeleccionar={() => {}}
              onToggleExpandir={() => {}}
            />
          </ul>
        </div>
      </div>
    </div>
  )
}
