"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { AlertTriangle, LocateFixed, Search, SearchX, Wifi } from "lucide-react"
import { FiltrosTipo, type FiltroTipo } from "@/components/filtros-tipo"
import { FormularioBusqueda } from "@/components/formulario-busqueda"
import { TarjetaSucursal } from "@/components/tarjeta-sucursal"
import { PanelInformativoTipo } from "@/components/panel-informativo-tipo"
import { HojaSucursalMobile } from "@/components/hoja-sucursal-mobile"
import { comunasDisponibles, sucursales } from "@/lib/sucursales"
import { buscarSucursales, normalizar } from "@/lib/search"
import type { SugerenciaBusqueda } from "@/lib/types"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useDebounce } from "@/hooks/use-debounce"

const Mapa = dynamic(() => import("@/components/mapa"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <span className="text-sm text-muted-foreground">Cargando mapa…</span>
    </div>
  ),
})

export interface BuscadorSucursalesProps {
  /** Si es true, oculta el banner superior con el título y la descripción. */
  hideHeader?: boolean
}

export function BuscadorSucursales({ hideHeader = false }: BuscadorSucursalesProps) {
  const [inputComuna, setInputComuna] = useState("")
  const [comunaBuscada, setComunaBuscada] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<FiltroTipo>("todas")
  const [referencia, setReferencia] = useState<{ lat: number; lng: number } | null>(
    null,
  )
  const [activaId, setActivaId] = useState<string | null>(null)
  const [expandidaId, setExpandidaId] = useState<string | null>(null)
  const [sugerencias, setSugerencias] = useState<SugerenciaBusqueda[]>([])
  const [busquedaRealizada, setBusquedaRealizada] = useState(true)
  /** Mensaje de advertencia / geo-fallback (no es un error bloqueante). */
  const [geoAviso, setGeoAviso] = useState<string | null>(null)
  /** Error bloqueante de geolocalización (permiso denegado explícitamente). */
  const [geoError, setGeoError] = useState<string | null>(null)
  /** Simula un estado de carga — se activará con la integración real de API. */
  const [isLoading, setIsLoading] = useState(false)
  // En mobile, al tocar un pin se abre la bottom sheet con esta sucursal.
  const [hojaId, setHojaId] = useState<string | null>(null)

  const esMobile = useMediaQuery("(max-width: 1023px)")
  const debouncedInput = useDebounce(inputComuna, 1000)
  const skipSugerenciasRef = useRef(false)

  useEffect(() => {
    async function fetchSugerencias() {
      if (skipSugerenciasRef.current) {
        skipSugerenciasRef.current = false
        return
      }

      const q = normalizar(debouncedInput)
      if (q.length === 0) {
        setSugerencias([])
        return
      }

      // 1. Sugerencias locales (comunas)
      const locales: SugerenciaBusqueda[] = comunasDisponibles
        .filter((c) => normalizar(c).includes(q))
        .slice(0, 5)
        .map((c) => ({ texto: c, tipo: "comuna" }))

      // 2. Si hay más de 3 letras, buscamos en la API de Nominatim
      if (q.length >= 3) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              debouncedInput + ", Chile"
            )}&format=json&limit=4&addressdetails=1`,
            {
              headers: {
                "User-Agent": "StarkenStoreFinder/1.0",
              },
            }
          )
          const data = await res.json()
          if (data && data.length > 0) {
            const apiSuggs: SugerenciaBusqueda[] = data.map((d: any) => {
              // Acortar el texto de Nominatim tomando solo las primeras 2 partes (ej: "Avenida Providencia, Providencia")
              const partes = d.display_name.split(",")
              const textoCorto = partes.slice(0, 2).join(",").trim()
              return {
                texto: textoCorto,
                tipo: "direccion",
                lat: parseFloat(d.lat),
                lng: parseFloat(d.lon),
              }
            })
            // Combinar locales y de API
            setSugerencias([...locales, ...apiSuggs])
            return
          }
        } catch (error) {
          console.error("Error fetching address suggestions", error)
        }
      }
      
      setSugerencias(locales)
    }

    fetchSugerencias()
  }, [debouncedInput])

  const resultados = useMemo(() => {
    if (!busquedaRealizada) return []
    // Si hay una referencia de ubicación, no filtramos por texto de comuna
    const queryComuna = referencia ? undefined : (comunaBuscada ?? undefined)
    return buscarSucursales(sucursales, {
      comuna: queryComuna,
      tipo: filtro,
      referencia: referencia ?? undefined,
    })
  }, [busquedaRealizada, comunaBuscada, filtro, referencia])

  async function ejecutarBusqueda(queryText: string) {
    const limpia = queryText.trim()
    if (!limpia) {
      setComunaBuscada(null)
      setReferencia(null)
      setBusquedaRealizada(true)
      setActivaId(null)
      setExpandidaId(null)
      setHojaId(null)
      setSugerencias([])
      setGeoAviso(null)
      setGeoError(null)
      return
    }

    setActivaId(null)
    setExpandidaId(null)
    setHojaId(null)
    setSugerencias([])
    setGeoAviso(null)
    setGeoError(null)

    // Comprobar si coincide con una comuna disponible (búsqueda tolerante)
    const match = comunasDisponibles.find(
      (c) => normalizar(c) === normalizar(limpia),
    )

    if (match) {
      const branchesInComuna = sucursales.filter(
        (s) => normalizar(s.comuna) === normalizar(match),
      )
      if (branchesInComuna.length > 0) {
        const lat =
          branchesInComuna.reduce((acc, s) => acc + s.lat, 0) /
          branchesInComuna.length
        const lng =
          branchesInComuna.reduce((acc, s) => acc + s.lng, 0) /
          branchesInComuna.length
        setReferencia({ lat, lng })
      } else {
        setReferencia(null)
      }
      setComunaBuscada(match)
      setBusquedaRealizada(true)
    } else {
      setIsLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            limpia + ", Chile",
          )}&format=json&limit=1`,
          {
            headers: {
              "User-Agent": "StarkenStoreFinder/1.0",
            },
          },
        )
        const data = await res.json()
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat)
          const lon = parseFloat(data[0].lon)
          setReferencia({ lat, lng: lon })
          setComunaBuscada(limpia)
          setBusquedaRealizada(true)
        } else {
          setComunaBuscada(limpia)
          setReferencia(null)
          setBusquedaRealizada(true)
          setGeoAviso(
            `No encontramos la dirección "${limpia}". Mostrando todos los puntos.`,
          )
        }
      } catch (err) {
        console.error("Geocoding error:", err)
        setComunaBuscada(limpia)
        setReferencia(null)
        setBusquedaRealizada(true)
        setGeoAviso(
          "Ocurrió un problema de conexión al buscar la dirección.",
        )
      } finally {
        setIsLoading(false)
      }
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    ejecutarBusqueda(inputComuna)
  }

  function onChangeInput(valor: string) {
    setInputComuna(valor)
    if (valor.trim().length === 0) {
      setSugerencias([])
      setComunaBuscada(null)
      setReferencia(null)
      setActivaId(null)
      setExpandidaId(null)
      setHojaId(null)
      setGeoAviso(null)
      setGeoError(null)
    }
  }

  function onSeleccionarSugerencia(sugerencia: SugerenciaBusqueda) {
    skipSugerenciasRef.current = true
    setInputComuna(sugerencia.texto)
    setSugerencias([])
    
    if (sugerencia.tipo === "direccion" && sugerencia.lat && sugerencia.lng) {
      // Evitamos llamar a la API de nuevo
      setReferencia({ lat: sugerencia.lat, lng: sugerencia.lng })
      setComunaBuscada(sugerencia.texto)
      setBusquedaRealizada(true)
      setActivaId(null)
      setExpandidaId(null)
      setHojaId(null)
      setGeoAviso(null)
      setGeoError(null)
    } else {
      ejecutarBusqueda(sugerencia.texto)
    }
  }

  function usarMiUbicacion() {
    setGeoAviso(null)
    setGeoError(null)
    setIsLoading(true)

    if (!navigator.geolocation) {
      setIsLoading(false)
      setGeoError(
        "Tu navegador no permite acceder a la ubicación. Puedes buscar tu comuna en el campo de arriba.",
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ref = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setReferencia(ref)
        setComunaBuscada(null)
        setInputComuna("")
        setBusquedaRealizada(true)
        setActivaId(null)
        setExpandidaId(null)
        setHojaId(null)
        setSugerencias([])
        setIsLoading(false)
      },
      (err) => {
        setIsLoading(false)
        // Permiso denegado explícitamente
        if (err.code === 1) {
          setGeoError(
            "Bloqueaste el acceso a tu ubicación. Si cambias de opinión, puedes habilitarlo en la configuración de tu navegador y buscar nuevamente.",
          )
          return
        }
        // Fallback silencioso para cualquier otro error (timeout, posición no disponible)
        const ref = { lat: -33.4372, lng: -70.6506 }
        setReferencia(ref)
        setComunaBuscada(null)
        setInputComuna("")
        setBusquedaRealizada(true)
        setSugerencias([])
        setGeoAviso(
          "No logramos acceder a tu ubicación, pero te mostramos sucursales en Santiago para que puedas orientarte. Prueba ingresando tu comuna para resultados más precisos.",
        )
      },
    )
  }

  function seleccionar(id: string) {
    setActivaId(id)
    setExpandidaId(id)
    
    // Usamos setTimeout para esperar a que React renderice la tarjeta expandida 
    // antes de calcular su nueva altura total para el scroll
    setTimeout(() => {
      const el = document.getElementById(`tarjeta-${id}`)
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, 100)
  }

  function onPinClick(id: string) {
    setActivaId(id)
    if (esMobile) {
      setHojaId(id)
    } else {
      seleccionar(id)
    }
  }

  const tituloResultados = referencia
    ? comunaBuscada
      ? `Sucursales cercanas a "${comunaBuscada}"`
      : "Sucursales cercanas a tu ubicación"
    : comunaBuscada
      ? `Sucursales en ${comunaBuscada}`
      : "Todas las sucursales"

  const hojaSucursal = hojaId
    ? resultados.find((s) => s.id === hojaId) ?? null
    : null

  const isDefaultView = !comunaBuscada && !referencia

  /* ---------------------- LAYOUT MOBILE ---------------------- */
  if (esMobile) {
    return (
      <div className="flex flex-1 flex-col pb-8">
        {/* Banner de Cabecera Horizontal Compacto */}
        {!hideHeader && (
          <div className="bg-gradient-to-r from-[#e8f3ea]/70 via-card to-card border-b border-border px-4 py-3 flex flex-col gap-0.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold text-primary tracking-wide uppercase">
                Red Starken
              </span>
            </div>
            <h1 className="text-base font-black tracking-tight text-foreground font-[family-name:var(--font-exo)] leading-tight">
              Encuentra tu Punto de Envío o Retiro
            </h1>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Ubica sucursales, buzones 24/7 y alianzas en todo Chile.
            </p>
          </div>
        )}

        {/* Input de búsqueda arriba del mapa */}
        <div className="relative z-[1000] px-4 pt-3 pb-2">
          <FormularioBusqueda
            inputComuna={inputComuna}
            sugerencias={sugerencias}
            onChangeInput={onChangeInput}
            onSubmit={onSubmit}
            onSeleccionarSugerencia={onSeleccionarSugerencia}
          />
        </div>

        {/* Mapa cuadrado 100vw con padding */}
        <div className="p-4 pt-0">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border">
            <Mapa
              sucursales={resultados}
              sucursalActivaId={activaId}
              onPinClick={onPinClick}
              isDefaultView={isDefaultView}
              referencia={referencia}
              referenciaLabel={comunaBuscada}
            />
            {/* Filtros flotantes sobre el mapa en mobile */}
            <div 
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              className="absolute top-3 left-3 right-3 z-[500] pointer-events-auto py-0.5"
            >
              <FiltrosTipo activo={filtro} onCambiar={setFiltro} scrollable />
            </div>
            {/* Botón flotante de geolocalización estilo Google Maps */}
            <button
              type="button"
              onClick={usarMiUbicacion}
              aria-label="Usar mi ubicación"
              className="absolute bottom-[84px] right-3 z-[500] flex size-11 items-center justify-center rounded-full bg-card text-muted-foreground shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-colors hover:text-primary"
            >
              <LocateFixed className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Panel informativo animado */}
        <div className="px-4">
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              filtro !== "todas" && filtro !== "24/7"
                ? "max-h-[300px] opacity-100 mt-3"
                : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <PanelInformativoTipo tipo={filtro} />
          </div>
        </div>

        {/* Avisos de geolocalización */}
        {(geoError || geoAviso) && (
          <div className="mt-3 px-4">
            <BannerAviso
              tipo={geoError ? "error" : "aviso"}
              mensaje={(geoError ?? geoAviso)!}
            />
          </div>
        )}

        {/* Lista de resultados con scroll interno */}
        <div className="mt-4 px-4">
          <div className="max-h-[45vh] overflow-y-auto rounded-xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ListaResultados
              busquedaRealizada={busquedaRealizada}
              isLoading={isLoading}
              resultados={resultados}
              tituloResultados={tituloResultados}
              activaId={activaId}
              expandidaId={expandidaId}
              onSeleccionarItem={(id) => {
                setActivaId(id)
                setExpandidaId((prev) => (prev === id ? prev : id))
              }}
              onToggleExpandir={(id) =>
                setExpandidaId((prev) => (prev === id ? null : id))
              }
            />
          </div>
        </div>

        {/* Bottom sheet al tocar un pin */}
        {hojaSucursal && (
          <HojaSucursalMobile
            sucursal={hojaSucursal}
            onCerrar={() => setHojaId(null)}
          />
        )}
      </div>
    )
  }

  /* ---------------------- LAYOUT DESKTOP ---------------------- */
  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      {/* Banner de Cabecera Horizontal Completo */}
      {!hideHeader && (
        <div className="bg-gradient-to-r from-[#e8f3ea]/70 via-card to-card border-b border-border px-6 py-4 flex flex-col gap-0.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary tracking-wide uppercase">
              Red Starken
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground font-[family-name:var(--font-exo)] leading-tight">
            Encuentra tu Punto de Envío o Retiro
          </h1>
          <p className="text-xs text-muted-foreground">
            Ubica sucursales tradicionales, buzones 24/7 y puntos de alianza en todo Chile.
          </p>
        </div>
      )}

      {/* Resultados: lista + mapa */}
      <div className="grid w-full flex-1 grid-cols-1 lg:grid-cols-[460px_1fr] min-h-0">
        {/* Lista de resultados (panel izquierdo) */}
        <aside className="flex flex-col border-b border-border bg-card lg:border-b-0 lg:border-r h-full min-h-0 overflow-hidden">
          {/* Cabecera del panel izquierdo: buscador */}
          <div className="flex flex-col gap-3 border-b border-border p-4 shrink-0 bg-card">
            <div className="w-full">
              <FormularioBusqueda
                inputComuna={inputComuna}
                sugerencias={sugerencias}
                onChangeInput={onChangeInput}
                onSubmit={onSubmit}
                onSeleccionarSugerencia={onSeleccionarSugerencia}
              />
            </div>

            {/* Panel informativo animado */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                filtro !== "todas" && filtro !== "24/7"
                  ? "max-h-[300px] opacity-105 mt-2"
                  : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              <PanelInformativoTipo tipo={filtro} />
            </div>
          </div>

          {/* Listado de cards de sucursales */}
          <div className="flex-1 overflow-y-auto relative">
            <ListaResultados
              busquedaRealizada={busquedaRealizada}
              isLoading={isLoading}
              resultados={resultados}
              tituloResultados={tituloResultados}
              activaId={activaId}
              expandidaId={expandidaId}
              onSeleccionarItem={seleccionar}
              onToggleExpandir={(id) =>
                setExpandidaId((prev) => (prev === id ? null : id))
              }
            />

            {/* Avisos de geolocalización (solo desktop) */}
            {(geoError || geoAviso) && (
              <div className="mt-4 px-5 pb-5">
                <BannerAviso
                  tipo={geoError ? "error" : "aviso"}
                  mensaje={(geoError ?? geoAviso)!}
                />
              </div>
            )}
          </div>
        </aside>

        {/* Panel derecho: mapa */}
        <div className="relative h-[420px] lg:h-full">
          <Mapa
            sucursales={resultados}
            sucursalActivaId={activaId}
            onPinClick={onPinClick}
            isDefaultView={isDefaultView}
            referencia={referencia}
            referenciaLabel={comunaBuscada}
          />
          
          {/* Filtros flotantes sobre el mapa */}
          <div 
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 lg:left-16 z-[500] pointer-events-auto bg-card/90 backdrop-blur-sm p-1.5 rounded-full border border-border shadow-md"
          >
            <FiltrosTipo activo={filtro} onCambiar={setFiltro} />
          </div>

          {/* Botón flotante de geolocalización estilo Google Maps */}
          <button
            type="button"
            onClick={usarMiUbicacion}
            aria-label="Usar mi ubicación"
            className="absolute bottom-[84px] right-3 z-[500] flex size-11 items-center justify-center rounded-full bg-card text-muted-foreground shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-colors hover:text-primary pointer-events-auto cursor-pointer"
          >
            <LocateFixed className="size-5" aria-hidden="true" />
          </button>

          {busquedaRealizada && resultados.length === 0 && !isLoading && (
            <div className="pointer-events-none absolute left-1/2 top-20 z-[400] -translate-x-1/2 rounded-full bg-card px-4 py-2 text-sm font-medium text-card-foreground shadow-md">
              Sin resultados en esta zona. Prueba ampliando tu búsqueda.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ======================== Sub-componentes ======================== */

interface ListaResultadosProps {
  busquedaRealizada: boolean
  isLoading: boolean
  resultados: ReturnType<typeof buscarSucursales>
  tituloResultados: string
  activaId: string | null
  expandidaId: string | null
  onSeleccionarItem: (id: string) => void
  onToggleExpandir: (id: string) => void
}

function ListaResultados({
  busquedaRealizada,
  isLoading,
  resultados,
  tituloResultados,
  activaId,
  expandidaId,
  onSeleccionarItem,
  onToggleExpandir,
}: ListaResultadosProps) {
  if (isLoading) {
    return <EstadoCargando />
  }

  if (!busquedaRealizada) {
    return (
      <EstadoVacio
        icon={<Search className="size-6" aria-hidden="true" />}
        titulo="¿Dónde necesitas enviar o retirar?"
        detalle="Ingresa tu comuna o dirección y te mostraremos las opciones más cercanas para ti."
      />
    )
  }

  if (resultados.length === 0) {
    return (
      <EstadoVacio
        icon={<SearchX className="size-6" aria-hidden="true" />}
        titulo="No encontramos puntos en esta zona todavía"
        detalle="Puedes intentar con una comuna cercana o quitar algún filtro para ampliar la búsqueda."
      />
    )
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex items-baseline justify-between bg-card px-5 py-4 border-b border-border/50 shadow-sm">
        <h2 className="text-sm font-bold text-foreground text-pretty">
          {tituloResultados}
        </h2>
        <span className="text-xs text-muted-foreground">
          {resultados.length}{" "}
          {resultados.length === 1 ? "sucursal" : "sucursales"}
        </span>
      </div>
      <ul className="flex flex-col gap-3 px-5 pt-3 pb-5">
        {resultados.map((s) => (
          <div key={s.id} id={`tarjeta-${s.id}`} className="scroll-mt-[60px]">
            <TarjetaSucursal
              sucursal={s}
              activa={activaId === s.id}
              expandida={expandidaId === s.id}
              onSeleccionar={() => onSeleccionarItem(s.id)}
              onToggleExpandir={() => onToggleExpandir(s.id)}
            />
          </div>
        ))}
      </ul>
    </>
  )
}

function EstadoVacio({
  icon,
  titulo,
  detalle,
}: {
  icon: React.ReactNode
  titulo: string
  detalle: string
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground text-balance">
        {titulo}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">
        {detalle}
      </p>
    </div>
  )
}

function EstadoCargando() {
  return (
    <div className="flex flex-col gap-3 px-1 py-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-start gap-3">
            <div className="size-11 shrink-0 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
              <div className="h-3 w-1/4 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function BannerAviso({
  tipo,
  mensaje,
}: {
  tipo: "aviso" | "error"
  mensaje: string
}) {
  const isError = tipo === "error"
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-lg px-3 py-3 text-xs ${
        isError
          ? "bg-destructive/10 text-destructive"
          : "bg-accent text-accent-foreground"
      }`}
    >
      {isError ? (
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      ) : (
        <Wifi className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      )}
      <p className="leading-relaxed">{mensaje}</p>
    </div>
  )
}
