"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SucursalTipo } from "@/lib/types"

export type FiltroTipo = SucursalTipo | "todas"

const FILTROS: { valor: Exclude<FiltroTipo, "todas">; label: string; icon?: string }[] = [
  { valor: "tradicional", label: "Tradicional", icon: "/icons/card-tradicional.png" },
  { valor: "24/7", label: "Sucursal 24/7", icon: "/icons/card-247.png" },
  { valor: "soy-starken", label: "Soy Starken", icon: "/icons/card-soy-starken.png" },
  { valor: "red-alianzas", label: "Red de Alianzas", icon: "/icons/card-alianzas-ap.png" },
]

const ACTIVO_CLASES: Record<FiltroTipo, string> = {
  todas: "border-[#4a4a4a] bg-[#F0F0F0] text-[#4a4a4a]",
  tradicional: "border-[#1e7e45] bg-[#E6F4ED] text-[#1e7e45]",
  "24/7": "border-[#1a6fa8] bg-[#E6F3FC] text-[#1a6fa8]",
  "soy-starken": "border-[#c4621d] bg-[#FEF0E6] text-[#c4621d]",
  "red-alianzas": "border-[#c0392b] bg-[#FDECEA] text-[#c0392b]",
}

interface FiltrosTipoProps {
  activo: FiltroTipo
  onCambiar: (valor: FiltroTipo) => void
  /** En mobile los pills van en una sola fila con scroll horizontal. */
  scrollable?: boolean
}

export function FiltrosTipo({ activo, onCambiar, scrollable = false }: FiltrosTipoProps) {
  return (
    <div
      className={cn(
        "gap-2 flex items-center",
        scrollable
          ? "flex-nowrap overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "flex-wrap",
      )}
      role="group"
      aria-label="Filtrar por tipo de sucursal"
    >
      {FILTROS.map((f) => {
        const seleccionado = activo === f.valor
        return (
          <button
            key={f.valor}
            type="button"
            aria-pressed={seleccionado}
            onClick={() => onCambiar(seleccionado ? "todas" : f.valor)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
              scrollable && "shrink-0 whitespace-nowrap",
              seleccionado
                ? ACTIVO_CLASES[f.valor]
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {f.icon && (
              <Image
                src={f.icon || "/placeholder.svg"}
                alt=""
                width={18}
                height={18}
                className={cn(
                  "size-[18px] rounded-full object-contain",
                  seleccionado && "bg-card",
                )}
              />
            )}
            <span>{f.label}</span>
            {seleccionado && scrollable && (
              <X className="size-3.5 ml-1 shrink-0 opacity-70 hover:opacity-100 transition-opacity" />
            )}
          </button>
        )
      })}

      {activo !== "todas" && !scrollable && (
        <button
          type="button"
          onClick={() => onCambiar("todas")}
          className={cn(
            "flex items-center gap-1 rounded-full border border-transparent bg-[#414745] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#2d3230] transition-colors cursor-pointer shadow-sm",
            scrollable && "shrink-0 whitespace-nowrap"
          )}
          title="Limpiar filtro"
        >
          Limpiar ✕
        </button>
      )}
    </div>
  )
}
