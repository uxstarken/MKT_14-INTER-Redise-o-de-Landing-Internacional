"use client"

import { useState, useRef, useEffect } from "react"
import { Info, X } from "lucide-react"

export function AlertaInformativa() {
  const [visible, setVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  // Mensaje actual (puede ser modificado en el futuro para recibirlo como prop)
  const mensaje = "Informamos que nuestra sucursal Laja no se encuentra operativa por motivos de fuerza mayor."

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        setIsOverflowing(textRef.current.scrollWidth > containerRef.current.clientWidth)
      }
    }
    
    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [mensaje])

  if (!visible) return null

  return (
    <div className="bg-banner text-banner-foreground">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <Info className="size-4 shrink-0" aria-hidden="true" />
        
        <div 
          className="flex-1 overflow-hidden relative flex items-center h-5" 
          ref={containerRef}
        >
          <div 
            className={`flex whitespace-nowrap ${
              isOverflowing 
                ? "animate-[marquee-seamless_15s_linear_infinite] hover:[animation-play-state:paused]" 
                : ""
            }`}
          >
            <p ref={textRef} className="text-[13px] font-medium pr-12">
              {mensaje}
            </p>
            {isOverflowing && (
              <p className="text-[13px] font-medium pr-12" aria-hidden="true">
                {mensaje}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setVisible(false)}
          className="shrink-0 rounded-sm p-1 transition-colors hover:bg-black/10"
          aria-label="Cerrar aviso"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
