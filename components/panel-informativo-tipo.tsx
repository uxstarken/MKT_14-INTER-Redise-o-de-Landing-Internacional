"use client"

import { useState, useEffect } from "react"
import { CreditCard, ShieldCheck, Ruler, Clock, Sparkles, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { TIPO_LABEL } from "@/lib/types"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { FiltroTipo } from "./filtros-tipo"

interface PanelInformativoTipoProps {
  tipo: FiltroTipo
}

interface ItemCaracteristica {
  icon: React.ComponentType<{ className?: string }>
  text: string
}

const INFO_TIPOS: Record<
  Exclude<FiltroTipo, "todas" | "24/7">,
  {
    claseBorde: string
    claseFondo: string
    claseIcono: string
    items: ItemCaracteristica[]
  }
> = {
  tradicional: {
    claseBorde: "border-l-[#1e7e45] border-border",
    claseFondo: "bg-[#E6F4ED]/40 border-[#1e7e45]/15",
    claseIcono: "text-[#1e7e45]",
    items: [
      {
        icon: CreditCard,
        text: "Pago en starken.cl o en sucursal (al contado o por pagar)",
      },
      {
        icon: ShieldCheck,
        text: "Valor declarado máx. $3.000.000 — sobre $50.000 requiere documento de respaldo",
      },
      {
        icon: Ruler,
        text: "Dimensiones máx. 150×150×150 cm · hasta 200 kg",
      },
      {
        icon: Clock,
        text: "Lunes a viernes 09:00–18:30 · Sábados 09:00–13:00",
      },
      {
        icon: Sparkles,
        text: "Venta de embalaje disponible",
      },
    ],
  },
  "soy-starken": {
    claseBorde: "border-l-[#c4621d] border-border",
    claseFondo: "bg-[#FEF0E6]/40 border-[#c4621d]/15",
    claseIcono: "text-[#c4621d]",
    items: [
      {
        icon: CreditCard,
        text: "Pago solo en starken.cl (al contado o por pagar)",
      },
      {
        icon: ShieldCheck,
        text: "Valor declarado máx. $100.000 — sobre $50.000 requiere documento de respaldo",
      },
      {
        icon: Ruler,
        text: "Dimensiones máx. 50×50×50 cm · hasta 20 kg",
      },
      {
        icon: Clock,
        text: "Horario según comercio adherido",
      },
    ],
  },
  "red-alianzas": {
    claseBorde: "border-l-[#c0392b] border-border",
    claseFondo: "bg-[#FDECEA]/40 border-[#c0392b]/15",
    claseIcono: "text-[#c0392b]",
    items: [
      {
        icon: CreditCard,
        text: "Pago solo en starken.cl (al contado o por pagar)",
      },
      {
        icon: ShieldCheck,
        text: "Valor declarado máx. $100.000 — sobre $50.000 requiere documento de respaldo",
      },
      {
        icon: Ruler,
        text: "Dimensiones máx. 50×50×50 cm · hasta 20 kg",
      },
      {
        icon: Clock,
        text: "Horario según cada tienda",
      },
    ],
  },
}

export function PanelInformativoTipo({ tipo }: PanelInformativoTipoProps) {
  // Para "todas" o "24/7" no mostramos panel
  if (tipo === "todas" || tipo === "24/7") return null

  const info = INFO_TIPOS[tipo]
  const esMobile = useMediaQuery("(max-width: 1023px)")
  const [isExpanded, setIsExpanded] = useState(true)

  // Sincronizar el estado por defecto del diseño responsive
  useEffect(() => {
    setIsExpanded(!esMobile)
  }, [esMobile])

  const labelTipo = TIPO_LABEL[tipo] || tipo

  return (
    <div
      className={cn(
        "rounded-xl border-l-4 border-y border-r p-3.5 shadow-sm transition-all duration-300",
        info.claseBorde,
        info.claseFondo,
      )}
    >
      {/* Cabecera colapsable */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between text-left text-xs font-bold text-[#414745] hover:text-primary transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5 uppercase tracking-wide font-[family-name:var(--font-exo)] font-bold">
          Condiciones de Punto {labelTipo}
        </span>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
          <span>{isExpanded ? "Ver menos" : "Ver más información"}</span>
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Cuerpo colapsable */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded
            ? "max-h-[350px] opacity-100 mt-3.5"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <ul className="flex flex-col gap-2 border-t border-border/10 pt-3">
          {info.items.map((item, index) => {
            const Icon = item.icon
            return (
              <li
                key={index}
                className="flex items-start gap-2 text-[12px] leading-relaxed text-foreground/80"
              >
                <Icon className={`mt-0.5 size-4 shrink-0 ${info.claseIcono}`} />
                <span className="font-medium">{item.text}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
