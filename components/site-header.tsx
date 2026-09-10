"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react"
import Image from "next/image"

const TOP_LINKS = ["Personas", "Emprendedores", "Empresas", "Internacional"]

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="relative z-50 font-[family-name:var(--font-exo)] shadow-lg shadow-black/15">
        {/* Barra superior oscura #1a1a1a */}
        <div className="bg-[#1a1a1a] text-white">
          <div className="flex h-8 lg:h-9 items-center justify-between px-3 md:pl-5 lg:pl-8 lg:pr-4">
            <nav className="flex w-full items-center justify-between lg:w-auto lg:justify-start lg:gap-6 text-[12px] md:text-[13px] font-medium">
              {TOP_LINKS.map((l, i) => (
                <a
                  key={l}
                  href="#"
                  className={
                    i === 0
                      ? "text-[#1e7e45]"
                      : "text-white/85 transition-colors hover:text-white"
                  }
                >
                  {l}
                </a>
              ))}
            </nav>
            <button
              type="button"
              className="hidden lg:block rounded-sm bg-[#1e7e45] px-6 py-1.5 text-[13px] font-semibold text-white transition-colors hover:brightness-110"
            >
              Ingresa
            </button>
          </div>
        </div>

        {/* Barra principal */}
        <div className="relative flex h-[48px] lg:h-[56px] items-stretch bg-white lg:bg-[#ececec]">
          {/* Zona verde con corte diagonal tipo cuña */}
          <div
            className="relative flex items-center bg-[#1e7e45] pl-4 pr-16 lg:pl-8 lg:pr-32"
            style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 60px) 100%, 0 100%)" }}
          >
            <a href="#" className="flex items-center" aria-label="Starken inicio">
              <Image
                src="/starken-logo.png"
                alt="Starken"
                width={180}
                height={48}
                priority
                className="h-6 lg:h-8 w-auto"
              />
            </a>
          </div>

          {/* Icono de hamburguesa (Mobile) */}
          <div className="ml-auto flex items-center pr-4 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex flex-col gap-1.5 p-2"
              aria-label="Abrir menú"
            >
              <span className="block h-1 w-6 rounded-full bg-[#1e7e45]"></span>
              <span className="block h-1 w-6 rounded-full bg-[#1e7e45]"></span>
              <span className="block h-1 w-6 rounded-full bg-[#1e7e45]"></span>
            </button>
          </div>

          {/* Zona gris con links a la derecha (Desktop) */}
          <nav className="ml-auto hidden items-center gap-12 pr-5 text-[15px] font-medium text-[#333] lg:flex lg:pr-8">
            <a href="#" className="flex items-center gap-1 transition-colors hover:text-[#1e7e45]">
              Envíos
              <ChevronDown className="size-4" aria-hidden="true" />
            </a>
            <a href="#" className="font-[family-name:var(--font-exo)] text-[#414745] transition-colors hover:text-[#1e7e45]">
              Puntos Red Starken
            </a>
            <a href="#" className="transition-colors hover:text-[#1e7e45]">
              Nuestras tarifas
            </a>
            <a href="#" className="transition-colors hover:text-[#1e7e45]">
              Centro de Ayuda
            </a>
          </nav>
        </div>
      </header>

      {/* Menú Mobile Full Screen Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-white font-[family-name:var(--font-exo)]">
          {/* Header del overlay (Logo verde + Cerrar) */}
          <div className="flex h-[60px] items-center justify-between border-b border-gray-100 px-4">
            <Image
              src="/starken-logo-green.png"
              alt="Starken"
              width={140}
              height={40}
              className="h-7 w-auto"
            />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-[#333]"
              aria-label="Cerrar menú"
            >
              <X className="size-8" strokeWidth={1.5} />
            </button>
          </div>

          {/* Contenido del menú */}
          <div className="flex-1 px-4 py-6 flex flex-col gap-3">
            {/* Acordeón Personas */}
            <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden flex">
              <div className="w-1.5 shrink-0 bg-[#1e7e45]" />
              <div className="flex-1">
                <button className="flex w-full items-center justify-between p-4 text-left font-bold text-[#333]">
                  <span>Personas</span>
                </button>
                <div className="flex flex-col border-t border-gray-100 px-4 pb-2">
                  <a href="#" className="flex items-center justify-between py-3 text-[15px] text-[#414745] border-b border-gray-100">
                    Envíos
                    <ChevronRight className="size-4" />
                  </a>
                  <a href="#" className="py-3 text-[15px] text-[#414745] border-b border-gray-100">
                    Puntos Red Starken
                  </a>
                  <a href="#" className="py-3 text-[15px] text-[#414745] border-b border-gray-100">
                    Nuestras tarifas
                  </a>
                  <a href="#" className="py-3 text-[15px] text-[#414745]">
                    Centro de Ayuda
                  </a>
                </div>
              </div>
            </div>

            {/* Emprendedores */}
            <a href="#" className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden flex h-14 items-center">
              <div className="h-full w-1.5 shrink-0 bg-[#63228d]" />
              <span className="px-4 font-bold text-[#333]">Emprendedores</span>
            </a>

            {/* Empresas */}
            <a href="#" className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden flex h-14 items-center">
              <div className="h-full w-1.5 shrink-0 bg-[#4ab4a5]" />
              <span className="px-4 font-bold text-[#333]">Empresas</span>
            </a>

            {/* Internacional */}
            <a href="#" className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden flex h-14 items-center">
              <div className="h-full w-1.5 shrink-0 bg-[#001738]" />
              <span className="px-4 font-bold text-[#333]">Internacional</span>
            </a>
          </div>

          {/* Botón Ingresa al fondo */}
          <div className="p-4 mt-auto mb-4">
            <button className="w-full rounded-md bg-[#414745] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#2d3230]">
              Ingresa
            </button>
          </div>
        </div>
      )}
    </>
  )
}
