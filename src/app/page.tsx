import React from 'react';
import BookingWizard from '@/components/booking/BookingWizard';
import { ShieldCheck, Wine, Mountain, Star, Anchor } from 'lucide-react';

export default function CatamaranTucanHomePage() {
  return (
    <main className="min-h-screen bg-[#07110e] text-stone-100 selection:bg-amber-400 selection:text-stone-950">
      {/* HERO A PANTALLA COMPLETA — ESTÉTICA TROPICAL DE LUJO */}
      <header className="relative min-h-[88vh] flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1580094687196-cbc2bd0616b0?auto=format&fit=crop&w=2000&q=85"
            alt="Volcán Arenal y Lago Arenal al atardecer desde Catamarán Tucán"
            className="w-full h-full object-cover scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/45 to-[#07110e]" />
        </div>

        {/* Barra de Navegación Minimalista */}
        <nav className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center">
              <Anchor className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-wide text-white block leading-none">
                TUCÁN ARENAL
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300">
                Luxury Catamaran · Costa Rica
              </span>
            </div>
          </div>

          <a
            href="#reservar"
            className="px-5 py-2.5 rounded-full bg-amber-400 text-stone-950 font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition shadow-lg"
          >
            Reservar Zarpe
          </a>
        </nav>

        {/* Copy Principal de Conversión */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-950/70 backdrop-blur-md border border-white/15 text-xs text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.95 ★ Experiencia #1 en el Lago Arenal · La Fortuna</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white leading-[1.06] tracking-tight">
              Navega hacia el atardecer frente al{' '}
              <span className="italic text-amber-300">Volcán Arenal</span>.
            </h1>

            <p className="text-base sm:text-lg text-stone-200 max-w-2xl leading-relaxed">
              Descubre la travesía más exclusiva de Costa Rica a bordo del Catamarán Tucán. Coctelería de autor, gastronomía local y vistas panorámicas inigualables sobre aguas esmeralda.
            </p>

            {/* Badges de Confianza */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-950/70 backdrop-blur-md border border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-stone-200">
                  Puntualidad garantizada
                </span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-950/70 backdrop-blur-md border border-white/10">
                <Wine className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs font-medium text-stone-200">
                  Bebidas y snacks incluidos
                </span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-950/70 backdrop-blur-md border border-white/10">
                <Mountain className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="text-xs font-medium text-stone-200">
                  Vistas panorámicas del Volcán
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* WIZARD INTERACTIVO DE RESERVA */}
      <BookingWizard />
    </main>
  );
}
