import React from 'react';
import BookingWizard from '@/components/booking/BookingWizard';
import {
  ShieldCheck,
  Utensils,
  Mountain,
  Star,
  MapPin,
  Clock,
  Music,
  Waves,
  Users,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle2,
  Play,
} from 'lucide-react';

const GALLERY_IMAGES = [
  {
    src: '/images/tucan/galeria-1.webp',
    alt: 'Catamarán Tucán Arenal navegando en el Lago Arenal',
    caption: 'Navegación panorámica en el Lago Arenal',
  },
  {
    src: '/images/tucan/catamaran-aerial.webp',
    alt: 'Vista aérea con dron DJI del Catamarán Tucán Arenal',
    caption: 'Vista aérea en aguas del Lago Arenal, Tilarán',
  },
  {
    src: '/images/tucan/galeria-3.webp',
    alt: 'Toboganes y rampas de clavados en el Catamarán Tucán',
    caption: 'Toboganes acuáticos y rampas de clavados',
  },
  {
    src: '/images/tucan/galeria-4.webp',
    alt: 'Kayaks y banana acuática en el Lago Arenal',
    caption: 'Kayaks y banana acuática incluidos',
  },
  {
    src: '/images/tucan/galeria-5.webp',
    alt: 'Ambiente familiar y música con DJ a bordo',
    caption: 'Música con DJ, karaoke y ambiente familiar',
  },
  {
    src: '/images/tucan/galeria-7.webp',
    alt: 'Cubierta principal con capacidad para 150 pasajeros',
    caption: 'Amplias áreas para hasta 150 pasajeros',
  },
  {
    src: '/images/tucan/galeria-8.webp',
    alt: 'Embarcación Catamarán Tucán Arenal en Puerto San Luis',
    caption: 'Zarpe desde Puerto San Luis, Tilarán',
  },
  {
    src: '/images/tucan/galeria-9.webp',
    alt: 'Paisaje montañoso de Tilarán y Lago Arenal',
    caption: 'Vistas panorámicas del paisaje montañoso',
  },
  {
    src: '/images/tucan/galeria-10.webp',
    alt: 'Actividades acuáticas en el Lago Arenal',
    caption: 'Diversión segura con chalecos salvavidas',
  },
  {
    src: '/images/tucan/galeria-11.webp',
    alt: 'Recorrido de 3.5 horas por el Lago Arenal',
    caption: '3.5 horas de recorrido inolvidable',
  },
  {
    src: '/images/tucan/galeria-13.webp',
    alt: 'Grupos y excursiones a bordo del Catamarán Tucán',
    caption: 'Ideal para familias, excursiones y grupos',
  },
  {
    src: '/images/tucan/galeria-14.webp',
    alt: 'Experiencia Catamarán Tucán Arenal en Guanacaste',
    caption: 'Tilarán, Guanacaste, Costa Rica',
  },
];

const TOUR_INCLUSIONS = [
  'Uso de Toboganes acuáticos integrados',
  'Uso de Rampas de Clavados',
  'Uso de Kayaks y Banana acuática',
  'Música en vivo con DJ a bordo',
  'Karaoke y animación',
  'Almuerzo completo incluido',
  '*Venta de bebidas a bordo',
];

const FAQS = [
  {
    q: '¿De dónde zarpa el Catamarán Tucán Arenal y cuánto dura el recorrido?',
    a: 'El tour inicia en Puerto San Luis de Tilarán, Guanacaste, y tiene una duración aproximada de 3.5 horas navegando por el Lago Arenal.',
  },
  {
    q: '¿Cuáles son los horarios de salida abiertos al público y para grupos?',
    a: 'Sábados y Domingos salimos de Puerto San Luis, Tilarán a las 10:00 AM (abierto al público). De Lunes a Viernes salimos exclusivamente con Grupos Programados o chárter privado.',
  },
  {
    q: '¿Qué incluye exactamente la tarifa del tour?',
    a: 'Incluye el recorrido de 3.5 horas en el catamarán, uso de toboganes, uso de rampas de clavados, uso de kayaks y banana, música con DJ, karaoke y almuerzo. Además contamos con venta de bebidas a bordo.',
  },
  {
    q: '¿Cuál es la capacidad máxima del Catamarán Tucán Arenal?',
    a: 'Nuestra embarcación cuenta con amplias áreas techadas y al aire libre con capacidad para transportar cómodamente hasta 150 pasajeros.',
  },
];

export default function CatamaranTucanHomePage() {
  return (
    <main className="min-h-screen bg-[#07110e] text-stone-100 selection:bg-amber-400 selection:text-stone-950">
      {/* HERO A PANTALLA COMPLETA CON IMAGEN REAL DEL CATAMARÁN TUCÁN ARENAL */}
      <header className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/tucan/hero.jpg"
            alt="Catamarán Tucán Arenal en Puerto San Luis, Tilarán, Lago Arenal"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/55 to-[#07110e]" />
        </div>

        {/* Barra de Navegación con Logo Oficial */}
        <nav className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3.5 group">
            <img
              src="/images/tucan/logo.webp"
              alt="Logo Oficial Catamarán Tucán Arenal"
              className="w-14 h-14 rounded-2xl bg-white/95 p-1.5 object-contain shadow-lg group-hover:scale-105 transition"
            />
            <div>
              <span className="font-serif text-lg sm:text-xl tracking-wide text-white block leading-none">
                CATAMARÁN TUCÁN ARENAL
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-amber-300 mt-1 block">
                Puerto San Luis · Tilarán, Guanacaste
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest text-stone-200">
            <a href="#sobre-el-tour" className="hover:text-amber-300 transition">
              Sobre el Tour
            </a>
            <a href="#horarios" className="hover:text-amber-300 transition">
              Horarios
            </a>
            <a href="#galeria" className="hover:text-amber-300 transition">
              Galería y Vídeos
            </a>
            <a href="#reservar" className="hover:text-amber-300 transition">
              Reservar
            </a>
            <a href="#como-llegar" className="hover:text-amber-300 transition">
              Cómo Llegar
            </a>
            <a href="#contacto" className="hover:text-amber-300 transition">
              Contacto
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/50684719595"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900/80 border border-white/15 text-xs font-medium text-emerald-300 hover:border-emerald-400/50 transition"
            >
              <Phone className="w-3.5 h-3.5" /> 8471-9595
            </a>
            <a
              href="#reservar"
              className="px-5 py-2.5 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition shadow-lg"
            >
              Reservar Ahora
            </a>
          </div>
        </nav>

        {/* Copy Oficial de Bienvenida */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-14 md:py-20">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-950/75 backdrop-blur-md border border-white/15 text-xs text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>¡Estamos listos para zarpar! · Puerto San Luis, Tilarán, Guanacaste</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white leading-[1.06] tracking-tight">
              Una experiencia única en el corazón del{' '}
              <span className="italic text-amber-300">Lago Arenal</span>.
            </h1>

            <p className="text-base sm:text-lg text-stone-200 max-w-2xl leading-relaxed">
              El <strong>Catamarán Tucán Arenal</strong> cuenta con capacidad para hasta{' '}
              <strong>150 pasajeros</strong> y 3.5 horas de diversión con{' '}
              <strong>
                toboganes, rampas de clavados, kayaks, banana, música con DJ, karaoke y almuerzo incluido
              </strong>
              .
            </p>

            {/* Badges de Confianza Reales */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-950/75 backdrop-blur-md border border-white/10">
                <Waves className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-stone-200">
                  Toboganes, Kayaks, Banana y Clavados
                </span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-950/75 backdrop-blur-md border border-white/10">
                <Utensils className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs font-medium text-stone-200">
                  Almuerzo incluido + Venta de bebidas
                </span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-950/75 backdrop-blur-md border border-white/10">
                <Music className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="text-xs font-medium text-stone-200">
                  Música con DJ en vivo & Karaoke
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SECCIÓN OFICIAL: SOBRE EL CATAMARÁN Y NUESTRO TOUR */}
      <section
        id="sobre-el-tour"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-white/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
              Sobre Nosotros · Tilarán, Guanacaste
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white">
              Catamarán Tucán Arenal — Nuestro Tour
            </h2>
            <p className="text-stone-300 leading-relaxed text-sm sm:text-base">
              El Catamarán Tucán Arenal es una impresionante embarcación que ofrece una experiencia única en el corazón de Costa Rica, propiamente en{' '}
              <strong>Tilarán, Guanacaste</strong>. Este catamarán cuenta con amplias áreas, así como una variedad de comodidades y servicios que aseguran una experiencia inolvidable en el Lago Arenal.
            </p>
            <p className="text-stone-300 leading-relaxed text-sm sm:text-base">
              Con su capacidad para transportar hasta <strong>150 pasajeros</strong>, el Catamarán Tucán Arenal es una excelente opción para disfrutar de la naturaleza y las vistas panorámicas del paisaje montañoso mientras se navega por el impresionante Lago Arenal. Normalmente operamos{' '}
              <strong>sábados y domingos zarpando de Puerto San Luis en Tilarán</strong>, y estamos disponibles entre semana para grupos.
            </p>

            <div className="p-6 rounded-3xl bg-stone-900/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif text-amber-300">
                  Este tour inicia en Puerto San Luis de Tilarán (3.5 horas aprox.) e incluye:
                </h3>
                <img
                  src="/images/tucan/red-icon.svg"
                  alt="Icono Tour"
                  className="w-8 h-8 object-contain"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TOUR_INCLUSIONS.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
              <img
                src="/images/tucan/amenities.webp"
                alt="Amenidades y ambiente del Catamarán Tucán Arenal"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
                    Capacidad Oficial
                  </span>
                  <span className="text-xl font-serif text-white">
                    Hasta 150 pasajeros a bordo
                  </span>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-stone-950 text-xs font-bold">
                  3.5 Horas
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN OFICIAL: HORARIOS */}
      <section
        id="horarios"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-white/10"
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
            Salidas desde Puerto San Luis, Tilarán
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white mt-2">
            Horarios Oficiales de Zarpe
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-stone-900 to-stone-900 border border-amber-400/40 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-stone-950">
                <Clock className="w-3.5 h-3.5" /> Abierto al Público
              </span>
              <h3 className="text-2xl font-serif text-white">Sábados y Domingos</h3>
              <p className="text-sm text-stone-200 leading-relaxed">
                Salimos de <strong>Puerto San Luis, Tilarán, Guanacaste a las 10:00 AM</strong> (abierto al público). Incluye las 3.5 horas de recorrido por el Lago Arenal, almuerzo, toboganes, rampas de clavados, kayaks, banana, música con DJ y karaoke.
              </p>
            </div>
            <div>
              <a
                href="#reservar"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition"
              >
                Reservar Sábado o Domingo
              </a>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-stone-900/80 border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Users className="w-3.5 h-3.5" /> Grupos y Excursiones
              </span>
              <h3 className="text-2xl font-serif text-white">Lunes a Viernes</h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                <strong>Salimos solamente con Grupos Programados.</strong> Ideal para excursiones familiares, empresas, colegios, bodas o celebraciones privadas con capacidad de hasta 150 pasajeros.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#reservar"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/20 transition"
              >
                Reservar Grupo en Línea
              </a>
              <a
                href="https://wa.me/50684719595?text=Hola%20Catamar%C3%A1n%20Tuc%C3%A1n%20Arenal,%20deseo%20cotizar%20un%20grupo%20entre%20semana"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-500/40 text-emerald-300 font-semibold text-xs uppercase tracking-wider hover:bg-emerald-500/10 transition"
              >
                Consultar Grupo por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WIZARD INTERACTIVO DE RESERVA (5 PASOS + TILOPAY) */}
      <BookingWizard />

      {/* GALERÍA REAL Y VÍDEOS OFICIALES */}
      <section
        id="galeria"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10 space-y-14"
      >
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
            Galería Real · Lago Arenal
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white mt-2">
            Así se vive el Catamarán Tucán Arenal
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            Fotografías reales de nuestra embarcación, vistas aéreas y actividades saliendo de Puerto San Luis, Tilarán.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GALLERY_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className="group relative h-60 rounded-2xl overflow-hidden border border-white/10 bg-stone-900"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent opacity-90" />
              <span className="absolute bottom-3 left-3 right-3 text-xs text-stone-200 font-medium">
                {img.caption}
              </span>
            </div>
          ))}
        </div>

        {/* Vídeos Oficiales de YouTube extraídos del sitio */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-serif text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-400" /> Nuestros Vídeos en el Lago Arenal
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl overflow-hidden border border-white/15 aspect-video bg-stone-900 shadow-xl">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/VDpI3i3a4Yw?rel=0"
                title="Catamarán Tucán Arenal Video Oficial 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="rounded-3xl overflow-hidden border border-white/15 aspect-video bg-stone-900 shadow-xl">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/80OeYhuqdK0?rel=0"
                title="Catamarán Tucán Arenal Video Oficial 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-white/10">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
            Información Importante
          </span>
          <h2 className="text-3xl font-serif text-white mt-2">
            Preguntas Frecuentes sobre el Tour
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-stone-900/75 border border-white/10 space-y-2"
            >
              <h4 className="font-semibold text-white text-sm sm:text-base">
                {faq.q}
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO LLEGAR Y CONTACTO OFICIAL */}
      <footer
        id="contacto"
        className="border-t border-white/10 bg-stone-950/90 py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/images/tucan/logo.webp"
                alt="Logo Catamarán Tucán Arenal"
                className="w-12 h-12 rounded-xl bg-white p-1 object-contain"
              />
              <div>
                <h3 className="font-serif text-xl text-white">
                  Catamarán Tucán Arenal
                </h3>
                <p className="text-xs text-amber-300">
                  Puerto San Luis · Tilarán, Guanacaste, Costa Rica
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Si tiene consultas o desea coordinar un grupo entre semana, no dude en contactarnos directamente:
            </p>

            <div className="space-y-3 text-sm text-stone-200">
              <a
                href="mailto:info@catamarantucanarenalcr.com"
                className="flex items-center gap-3 hover:text-amber-300 transition"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>info@catamarantucanarenalcr.com</span>
              </a>
              <a
                href="https://wa.me/50684719595"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-amber-300 transition"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Teléfono + WhatsApp: +506 8471 9595 / +506 8393 9411</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Puerto San Luis, Tilarán, Guanacaste</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <a
                href="https://www.facebook.com/profile.php?id=100057457600036"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white inline-flex items-center gap-1.5 transition"
              >
                Facebook <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.instagram.com/catamarantucanarenal/?hl=es"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white inline-flex items-center gap-1.5 transition"
              >
                Instagram <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.tripadvisor.es/Attraction_Review-g315766-d26844472-Reviews-Catamaran_Tucan_Arenal-Tilaran_Province_of_Guanacaste.html"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-200 inline-flex items-center gap-1.5 transition"
              >
                Reseñas en TripAdvisor <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div id="como-llegar" className="lg:col-span-7">
            <div className="rounded-3xl overflow-hidden border border-white/15 h-72 sm:h-80 bg-stone-900">
              <iframe
                title="Mapa Ubicación Catamarán Tucán Arenal en Puerto San Luis, Tilarán"
                src="https://www.google.com/maps?q=Catamaran+Tucan+Arenal+Puerto+San+Luis+Tilaran&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
