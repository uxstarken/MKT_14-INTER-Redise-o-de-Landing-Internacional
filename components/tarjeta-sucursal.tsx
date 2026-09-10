"use client"

import Image from "next/image"
import { ChevronDown, MapPin, Phone, Package, Layers, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { TIPO_LABEL, type SucursalTipo } from "@/lib/types"
import { formatDistancia, type SucursalConDistancia } from "@/lib/search"

const DIAS_CORTOS = ["L", "M", "M", "J", "V", "S", "D"]

const TIPO_ICON: Record<SucursalTipo, string> = {
  tradicional: "/icons/card-tradicional.png",
  "24/7": "/icons/card-247.png",
  "soy-starken": "/icons/card-soy-starken.png",
  "red-alianzas": "/icons/card-alianzas-ap.png",
}

interface TarjetaSucursalProps {
  sucursal: SucursalConDistancia
  activa: boolean
  expandida: boolean
  onSeleccionar: () => void
  onToggleExpandir: () => void
}

export function TarjetaSucursal({
  sucursal,
  activa,
  expandida,
  onSeleccionar,
  onToggleExpandir,
}: TarjetaSucursalProps) {
  const abierto = sucursal.estado === "abierto"
  const distancia = formatDistancia(sucursal.distancia)

  return (
    <li
      className={cn(
        "overflow-hidden rounded-xl border bg-card transition-all",
        activa
          ? "border-primary shadow-md ring-1 ring-primary"
          : "border-border hover:border-primary/40 hover:shadow-sm",
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <Image
          src={TIPO_ICON[sucursal.tipo] || "/placeholder.svg"}
          alt=""
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-full object-contain"
        />
        <button
          type="button"
          onClick={onSeleccionar}
          className="flex-1 text-left"
          aria-label={`Seleccionar ${sucursal.nombre}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              {TIPO_LABEL[sucursal.tipo]}
            </span>
            {distancia && (
              <span className="text-xs font-medium text-muted-foreground">
                · {distancia}
              </span>
            )}
          </div>
          <h3 className="mt-1 text-sm font-bold leading-tight text-card-foreground text-pretty">
            {sucursal.nombre}
          </h3>
          <p className="mt-1 flex items-start gap-1 text-xs leading-relaxed text-muted-foreground">
            <MapPin className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
            <span>{sucursal.direccion}</span>
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
            <span
              className={cn(
                "size-2 rounded-full",
                abierto ? "bg-success" : "bg-destructive",
              )}
              aria-hidden="true"
            />
            <span className={abierto ? "text-success" : "text-destructive"}>
              {abierto ? "Abierto ahora" : "Cerrado"}
            </span>
            {/* Mostrar próxima apertura cuando está cerrado */}
            {!abierto && (
              <ProximaApertura horario={sucursal.horario} />
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={onToggleExpandir}
          aria-expanded={expandida}
          aria-label={expandida ? "Ocultar detalle" : "Ver detalle"}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronDown
            className={cn(
              "size-5 transition-transform",
              expandida && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      {expandida && (
        <div className="border-t border-border px-4 py-4 text-xs">
          <HorarioAtencion horario={sucursal.horario} />

          <UltimoRetiro horario={sucursal.horario} ultimoRetiro={sucursal.ultimoRetiro} />

          {/* Tamaño máximo de envío */}
          <div className="mt-4 flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Package className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold text-[#414745]">Tamaño máximo de envío</p>
              <p className="mt-0.5 text-muted-foreground">{sucursal.dimensionesMax}</p>
            </div>
          </div>

          {/* Servicios disponibles */}
          {sucursal.modalidades && sucursal.modalidades.length > 0 && (
            <div className="mt-4 flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Layers className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-[#414745]">Servicios disponibles</p>
                <ul className="mt-1 flex flex-wrap gap-1">
                  {sucursal.modalidades.map((m) => (
                    <li
                      key={m}
                      className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Cómo llegar */}
          <div className="mt-4 flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MapPin className="size-4" aria-hidden="true" />
            </span>
            <div className="pt-2">
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${sucursal.lat},${sucursal.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Cómo llegar (Google Maps) ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

/* -------- Helpers -------- */

function diaActualIndex() {
  // getDay(): 0=Domingo … 6=Sábado -> índice 0=Lunes … 6=Domingo
  const d = new Date().getDay()
  return (d + 6) % 7
}

/**
 * Muestra "· Abre mañana a las HH:MM" o "· Abre el {día} a las HH:MM"
 * tomando el próximo día con horario válido.
 */
function ProximaApertura({
  horario,
}: {
  horario: SucursalConDistancia["horario"]
}) {
  const hoy = diaActualIndex()
  const diasNombre = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]

  for (let offset = 1; offset <= 7; offset++) {
    const idx = (hoy + offset) % 7
    const h = horario[idx]
    if (h && h.apertura !== "Cerrado") {
      const label = offset === 1 ? "mañana" : `el ${diasNombre[idx]}`
      return (
        <span className="text-[10px] font-normal capitalize text-muted-foreground">
          · Abre {label} a las {h.apertura}
        </span>
      )
    }
  }
  return null
}

function HorarioAtencion({ horario }: { horario: SucursalConDistancia["horario"] }) {
  const hoy = diaActualIndex()
  return (
    <section>
      <h4 className="mb-2 text-sm font-bold text-[#414745]">
        Horario de atención
      </h4>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full table-fixed text-center tabular-nums">
          <thead>
            <tr className="bg-muted">
              {DIAS_CORTOS.map((dia, i) => (
                <th
                  key={i}
                  className={cn(
                    "border-r border-border py-1 text-[11px] font-bold last:border-r-0",
                    i === hoy ? "text-success" : "text-[#414745]",
                  )}
                >
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {horario.map((h, i) => (
                <td
                  key={`a-${i}`}
                  className={cn(
                    "border-r border-t border-border py-1 text-[11px] last:border-r-0",
                    i === hoy ? "font-semibold text-success" : "text-muted-foreground",
                  )}
                >
                  {h.apertura === "Cerrado" ? "—" : h.apertura}
                </td>
              ))}
            </tr>
            <tr>
              {horario.map((h, i) => (
                <td
                  key={`c-${i}`}
                  className={cn(
                    "border-r border-t border-border py-1 text-[11px] last:border-r-0",
                    i === hoy ? "font-semibold text-success" : "text-muted-foreground",
                  )}
                >
                  {h.cierre === "Cerrado" ? "—" : h.cierre}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

function UltimoRetiro({
  horario,
  ultimoRetiro,
}: {
  horario: SucursalConDistancia["horario"]
  ultimoRetiro: string
}) {
  const hoyIdx = diaActualIndex()
  const hoyHorario = horario[hoyIdx]

  // Verifica si hoy el punto está cerrado
  const hoyCerrado = !hoyHorario || hoyHorario.apertura === "Cerrado"

  // Cálculo en tiempo real
  const now = new Date()
  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()

  const [retiroHour, retiroMinute] = ultimoRetiro.split(":").map(Number)

  let estadoRetiro: "a-tiempo" | "tarde" | "no-retiro" = "no-retiro"

  if (!hoyCerrado) {
    if (
      currentHours < retiroHour ||
      (currentHours === retiroHour && currentMinutes < retiroMinute)
    ) {
      estadoRetiro = "a-tiempo"
    } else {
      estadoRetiro = "tarde"
    }
  }

  // Cálculo del próximo despacho si es tarde o no hay retiro hoy
  let proximoDespacho = "el lunes"
  for (let offset = 1; offset <= 7; offset++) {
    const idx = (hoyIdx + offset) % 7
    const h = horario[idx]
    if (h && h.apertura !== "Cerrado") {
      const diasNombre = [
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
        "domingo",
      ]
      proximoDespacho = offset === 1 ? "mañana" : `el ${diasNombre[idx]}`
      break
    }
  }

  return (
    <div className="mt-5 flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Clock className="size-4" aria-hidden="true" />
      </span>
      <div>
        <p className="font-bold text-[#414745]">Despacho del día</p>
        <div className="mt-1 text-xs leading-normal">
          {estadoRetiro === "a-tiempo" && (
            <p className="text-emerald-700">
              <span className="font-semibold">¡A tiempo!</span> Envía antes de las{" "}
              <span className="font-semibold">{ultimoRetiro}</span> hoy para que viaje hoy mismo.
            </p>
          )}
          {estadoRetiro === "tarde" && (
            <p className="text-amber-700">
              <span className="font-semibold">Fuera de horario:</span> El retiro de hoy ({ultimoRetiro}) ya fue realizado. Tu envío saldrá <span className="font-semibold">{proximoDespacho}</span>.
            </p>
          )}
          {estadoRetiro === "no-retiro" && (
            <p className="text-slate-600">
              <span className="font-semibold">Sin retiros hoy:</span> Tu envío saldrá{" "}
              <span className="font-semibold">{proximoDespacho}</span> a las {ultimoRetiro}.
            </p>
          )}
        </div>
        <p className="mt-1.5 text-[10px] leading-normal text-muted-foreground/85">
          * Envíos realizados después del último retiro añaden 1 día hábil al tiempo de entrega.
        </p>
      </div>
    </div>
  )
}
