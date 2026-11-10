'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sun,
  Sunset,
  Crown,
  Calendar as CalendarIcon,
  Users,
  Sparkles,
  Wine,
  Car,
  Camera,
  Utensils,
  ShieldCheck,
  Clock,
  Mountain,
  Check,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Lock,
  Phone,
  Mail,
  User,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  TourId,
  TourOption,
  AddonOption,
  DateAvailability,
  CurrencyCode,
  PassengerDetails,
} from '@/types/booking';

// Tipo de cambio referencial BCCR (1 USD = 515 CRC) e IVA Turismo Costa Rica (13%)
const EXCHANGE_RATE_CRC = 515;
const COSTA_RICA_IVA_RATE = 0.13;

export const TOURS_CATALOG: TourOption[] = [
  {
    id: 'SUNSET_EXPERIENCE',
    slug: 'atardecer-volcan-arenal',
    title: 'Sunset Volcano Experience',
    subtitle: 'Navegación dorada al atardecer frente al coloso Arenal',
    badge: 'Más reservado',
    schedule: '3:30 PM – 6:30 PM',
    duration: '3 horas',
    adultPriceUsd: 89,
    childPriceUsd: 55,
    maxCapacity: 32,
    highlights: [
      'Open bar de coctelería tropical & vinos seleccionados',
      'Tabla gourmet de quesos, frutas exóticas y bocadillos',
      'Parada en bahía tranquila con vista panorámica al Volcán',
    ],
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'MORNING_BREEZE',
    slug: 'brisa-matutina-lago-arenal',
    title: 'Morning Emerald Breeze',
    subtitle: 'Aguas serenas, avistamiento de aves y claridad volcánica',
    schedule: '9:00 AM – 12:00 PM',
    duration: '3 horas',
    adultPriceUsd: 79,
    childPriceUsd: 49,
    maxCapacity: 32,
    highlights: [
      'Café de especialidad de altura, mimosas y jugos naturales',
      'Equipo de paddleboard y kayak incluido en bahía',
      'Mayor probabilidad de cumbre despejada del Volcán Arenal',
    ],
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'PRIVATE_CHARTER',
    slug: 'charter-privado-lujo',
    title: 'Exclusive Private Charter',
    subtitle: 'El catamarán completo en exclusividad para tu grupo o celebración',
    badge: 'Ultra Luxury',
    schedule: 'Horario flexible a elección',
    duration: '3.5 horas',
    adultPriceUsd: 0,
    childPriceUsd: 0,
    isPrivateCharter: true,
    flatRateUsd: 1150,
    maxIncludedGuests: 12,
    extraGuestPriceUsd: 75,
    maxCapacity: 30,
    highlights: [
      'Capitán, bartender y anfitrión dedicados exclusivamente a tu grupo',
      'Menú de autor personalizable y barra premium ilimitada',
      'Ruta a medida por las islas y bahías secretas del Lago Arenal',
    ],
    image:
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=85',
  },
];

export const ADDONS_CATALOG: AddonOption[] = [
  {
    id: 'addon-champagne',
    code: 'CHAMPAGNE_RESERVE',
    name: 'Botella Champagne Moët & Chandon + Fresas',
    description: 'Servida fría en cubitera privada al caer el sol frente al volcán.',
    priceUsd: 110,
    pricingType: 'PER_BOOKING',
    badge: 'Favorito parejas',
    category: 'ROMANCE',
  },
  {
    id: 'addon-transfer',
    code: 'PRIVATE_SUV_TRANSFER',
    name: 'Transporte Privado Ida y Vuelta (La Fortuna)',
    description: 'Recogida puerta a puerta en SUV de lujo con A/C y Wi-Fi desde tu hotel.',
    priceUsd: 65,
    pricingType: 'PER_BOOKING',
    category: 'TRANSPORT',
  },
  {
    id: 'addon-lobster',
    code: 'GOURMET_CEVICHE_BOARD',
    name: 'Upgrade Gastronómico Mar & Tierra',
    description: 'Ceviche costarricense de corvina, camarones jumbo y cortes madurados.',
    priceUsd: 28,
    pricingType: 'PER_PERSON',
    category: 'GASTRONOMY',
  },
  {
    id: 'addon-drone',
    code: 'DRONE_PHOTO_PACKAGE',
    name: 'Sesión Fotográfica Profesional + Video Dron 4K',
    description: 'Entrega digital el mismo día con 25 fotos editadas y reel aéreo 4K.',
    priceUsd: 95,
    pricingType: 'PER_BOOKING',
    category: 'PHOTO',
  },
];

// Generador de disponibilidad simulada en tiempo real para los próximos 14 días
function generateUpcomingDates(): DateAvailability[] {
  const result: DateAvailability[] = [];
  const today = new Date();

  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    // Disponibilidad determinista según día
    const spotsLeft = i % 7 === 0 ? 0 : i % 3 === 0 ? 4 : 18;
    result.push({
      date: iso,
      spotsLeft,
      status: spotsLeft === 0 ? 'SOLD_OUT' : spotsLeft <= 6 ? 'FEW_LEFT' : 'AVAILABLE',
      weatherForecast: i % 2 === 0 ? 'Despejado · 27°C' : 'Brisa cálida · 26°C',
    });
  }
  return result;
}

const STEPS = [
  { id: 1, label: 'Experiencia' },
  { id: 2, label: 'Fecha y Huéspedes' },
  { id: 3, label: 'Upgrades' },
  { id: 4, label: 'Pasajero' },
  { id: 5, label: 'Pago Seguro' },
];

export default function BookingWizard() {
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // Estado de la reserva
  const [selectedTourId, setSelectedTourId] = useState<TourId>('SUNSET_EXPERIENCE');
  const upcomingDates = useMemo(() => generateUpcomingDates(), []);
  const [selectedDate, setSelectedDate] = useState<string>(
    upcomingDates.find((d) => d.status !== 'SOLD_OUT')?.date || upcomingDates[0].date
  );
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [passenger, setPassenger] = useState<PassengerDetails>({
    fullName: '',
    email: '',
    whatsappPhone: '',
    pickupHotel: '',
    dietaryRequirements: '',
    specialOccasion: 'NONE',
  });

  // Estado de procesamiento de pago Tilopay
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedTour = useMemo(
    () => TOURS_CATALOG.find((t) => t.id === selectedTourId) || TOURS_CATALOG[0],
    [selectedTourId]
  );

  const selectedDateObj = useMemo(
    () => upcomingDates.find((d) => d.date === selectedDate),
    [upcomingDates, selectedDate]
  );

  // Cálculos financieros en vivo (USD y CRC con IVA 13%)
  const pricing = useMemo(() => {
    const totalGuests = adults + children;
    let baseExperienceUsd = 0;

    if (selectedTour.isPrivateCharter && selectedTour.flatRateUsd) {
      const extraGuests = Math.max(
        0,
        totalGuests - (selectedTour.maxIncludedGuests || 12)
      );
      baseExperienceUsd =
        selectedTour.flatRateUsd +
        extraGuests * (selectedTour.extraGuestPriceUsd || 75);
    } else {
      baseExperienceUsd =
        adults * selectedTour.adultPriceUsd +
        children * selectedTour.childPriceUsd;
    }

    const addonsUsd = selectedAddons.reduce((acc, addonId) => {
      const addon = ADDONS_CATALOG.find((a) => a.id === addonId);
      if (!addon) return acc;
      return (
        acc +
        (addon.pricingType === 'PER_PERSON'
          ? addon.priceUsd * totalGuests
          : addon.priceUsd)
      );
    }, 0);

    const subtotalUsd = baseExperienceUsd + addonsUsd;
    const ivaTaxUsd = Math.round(subtotalUsd * COSTA_RICA_IVA_RATE * 100) / 100;
    const totalUsd = Math.round((subtotalUsd + ivaTaxUsd) * 100) / 100;

    const totalCrc = Math.round(totalUsd * EXCHANGE_RATE_CRC);
    const subtotalCrc = Math.round(subtotalUsd * EXCHANGE_RATE_CRC);
    const ivaTaxCrc = Math.round(ivaTaxUsd * EXCHANGE_RATE_CRC);

    return {
      totalGuests,
      baseExperienceUsd,
      addonsUsd,
      subtotalUsd,
      ivaTaxUsd,
      totalUsd,
      subtotalCrc,
      ivaTaxCrc,
      totalCrc,
    };
  }, [selectedTour, adults, children, selectedAddons]);

  const formatMoney = (amountUsd: number, targetCurrency: CurrencyCode = currency) => {
    if (targetCurrency === 'CRC') {
      const crc = Math.round(amountUsd * EXCHANGE_RATE_CRC);
      return `₡${crc.toLocaleString('es-CR')}`;
    }
    return `$${amountUsd.toLocaleString('en-US', {
      minimumFractionDigits: amountUsd % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })} USD`;
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const goToStep = (nextStep: number) => {
    setErrorMsg(null);
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  const canContinueStep = useMemo(() => {
    if (step === 1) return Boolean(selectedTourId);
    if (step === 2) {
      const available = selectedDateObj?.spotsLeft ?? 0;
      return (
        Boolean(selectedDate) &&
        adults >= 1 &&
        pricing.totalGuests <= available
      );
    }
    if (step === 3) return true;
    if (step === 4) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email.trim());
      const phoneOk = passenger.whatsappPhone.trim().length >= 8;
      const nameOk = passenger.fullName.trim().length >= 3;
      return emailOk && phoneOk && nameOk;
    }
    return true;
  }, [step, selectedTourId, selectedDate, selectedDateObj, adults, pricing.totalGuests, passenger]);

  const handleCheckoutWithTilopay = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/checkout/tilopay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: selectedTourId,
          date: selectedDate,
          adults,
          children,
          selectedAddonIds: selectedAddons,
          passenger,
          currency,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.paymentUrl) {
        throw new Error(
          data.error || 'No se pudo iniciar la sesión segura con Tilopay.'
        );
      }

      // Redirección al formulario seguro HPP / 3DS de Tilopay
      window.location.href = data.paymentUrl;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error inesperado al conectar con Tilopay.';
      setErrorMsg(message);
      setIsSubmitting(false);
    }
  };

  const getAddonIcon = (category: AddonOption['category']) => {
    switch (category) {
      case 'ROMANCE':
        return <Wine className="w-5 h-5 text-amber-400" />;
      case 'TRANSPORT':
        return <Car className="w-5 h-5 text-emerald-400" />;
      case 'GASTRONOMY':
        return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'PHOTO':
        return <Camera className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <section
      id="reservar"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-stone-100"
    >
      {/* Cabecera de Confianza + Selector de Moneda */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold mb-2">
            <Compass className="w-4 h-4" /> Reserva Directa · Confirmación Inmediata
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-white">
            Diseña tu travesía en el Lago Arenal
          </h2>
        </div>

        {/* Conmutador de Moneda USD / CRC */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-stone-900/90 p-1.5 rounded-full border border-white/10">
          <span className="text-xs text-stone-400 pl-3">Moneda:</span>
          {(['USD', 'CRC'] as CurrencyCode[]).map((curr) => (
            <button
              key={curr}
              type="button"
              onClick={() => setCurrency(curr)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currency === curr
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              {curr === 'USD' ? '$ USD' : '₡ CRC'}
            </button>
          ))}
        </div>
      </div>

      {/* Stepper de Progreso */}
      <div className="mb-8">
        <div className="grid grid-cols-5 gap-2">
          {STEPS.map((s) => {
            const isActive = s.id === step;
            const isCompleted = s.id < step;
            return (
              <button
                key={s.id}
                type="button"
                disabled={s.id > step}
                onClick={() => s.id < step && goToStep(s.id)}
                className={`group flex flex-col items-start text-left p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-emerald-950/80 border-amber-400/70 shadow-lg shadow-amber-500/5'
                    : isCompleted
                    ? 'bg-stone-900/60 border-emerald-500/30 hover:border-emerald-400/60 cursor-pointer'
                    : 'bg-stone-900/30 border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isActive
                        ? 'text-amber-400'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-stone-500'
                    }`}
                  >
                    Paso 0{s.id}
                  </span>
                  {isCompleted && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium text-stone-200 truncate w-full">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout Principal: Wizard Izquierda (8 cols) + Resumen Vivo Derecha (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-stone-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            {/* PASO 1: EXPERIENCIA Y HORARIO */}
            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 0.99, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-serif text-white">
                    1. Elige tu experiencia a bordo
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Cada zarpe incluye barra libre selecta, gastronomía local y vistas ininterrumpidas al Volcán Arenal.
                  </p>
                </div>

                <div className="space-y-4">
                  {TOURS_CATALOG.map((tour) => {
                    const isSelected = tour.id === selectedTourId;
                    return (
                      <div
                        key={tour.id}
                        onClick={() => setSelectedTourId(tour.id)}
                        className={`relative overflow-hidden rounded-2xl border transition-all cursor-pointer group ${
                          isSelected
                            ? 'border-amber-400 bg-gradient-to-r from-emerald-950/90 via-stone-900 to-stone-900 ring-1 ring-amber-400/50'
                            : 'border-white/10 bg-stone-950/60 hover:border-white/25'
                        }`}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-12">
                          <div className="sm:col-span-4 relative h-48 sm:h-auto overflow-hidden">
                            <img
                              src={tour.image}
                              alt={tour.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                            {tour.badge && (
                              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-400 text-stone-950 shadow">
                                {tour.badge}
                              </span>
                            )}
                          </div>

                          <div className="sm:col-span-8 p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
                                  {tour.id === 'SUNSET_EXPERIENCE' && (
                                    <Sunset className="w-4 h-4 text-amber-400" />
                                  )}
                                  {tour.id === 'MORNING_BREEZE' && (
                                    <Sun className="w-4 h-4 text-amber-300" />
                                  )}
                                  {tour.id === 'PRIVATE_CHARTER' && (
                                    <Crown className="w-4 h-4 text-amber-400" />
                                  )}
                                  <span>{tour.schedule}</span>
                                  <span>·</span>
                                  <span>{tour.duration}</span>
                                </div>

                                <div className="text-right">
                                  {tour.isPrivateCharter ? (
                                    <div>
                                      <span className="text-lg font-bold text-amber-400">
                                        {formatMoney(tour.flatRateUsd || 1150)}
                                      </span>
                                      <span className="block text-[11px] text-stone-400">
                                        Hasta {tour.maxIncludedGuests} personas
                                      </span>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="text-lg font-bold text-white">
                                        {formatMoney(tour.adultPriceUsd)}
                                      </span>
                                      <span className="text-xs text-stone-400"> / adulto</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <h4 className="text-xl font-serif text-white mt-1">
                                {tour.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                                {tour.subtitle}
                              </p>

                              <ul className="mt-3 space-y-1.5">
                                {tour.highlights.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center gap-2 text-xs text-stone-300"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* PASO 2: FECHA Y PASAJEROS */}
            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 0.99, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-serif text-white">
                    2. Selecciona fecha y número de pasajeros
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Disponibilidad verificada en tiempo real para{' '}
                    <span className="text-amber-300 font-medium">{selectedTour.title}</span>.
                  </p>
                </div>

                {/* Selector de Calendario Dinámico */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-amber-400" /> Próximas salidas disponibles
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                    {upcomingDates.map((item) => {
                      const d = new Date(`${item.date}T12:00:00`);
                      const dayName = d.toLocaleDateString('es-CR', { weekday: 'short' });
                      const dayNum = d.getDate();
                      const monthName = d.toLocaleDateString('es-CR', { month: 'short' });
                      const isSelected = selectedDate === item.date;
                      const isSoldOut = item.status === 'SOLD_OUT';

                      return (
                        <button
                          key={item.date}
                          type="button"
                          disabled={isSoldOut}
                          onClick={() => setSelectedDate(item.date)}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                            isSoldOut
                              ? 'border-white/5 bg-stone-950/30 opacity-40 cursor-not-allowed'
                              : isSelected
                              ? 'border-amber-400 bg-emerald-950/90 text-white shadow-lg ring-1 ring-amber-400'
                              : 'border-white/10 bg-stone-950/60 hover:border-white/30 text-stone-200'
                          }`}
                        >
                          <span className="text-[11px] uppercase text-stone-400">
                            {dayName}
                          </span>
                          <span className="text-xl font-bold my-0.5">{dayNum}</span>
                          <span className="text-[11px] capitalize text-stone-300">
                            {monthName}
                          </span>
                          <span
                            className={`mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              isSoldOut
                                ? 'bg-red-950 text-red-300'
                                : item.status === 'FEW_LEFT'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {isSoldOut ? 'Agotado' : `${item.spotsLeft} cupos`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selector de Pasajeros */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-stone-950/70 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span className="font-medium text-white">Adultos</span>
                      </div>
                      <span className="text-xs text-stone-400 block mt-0.5">
                        12+ años ·{' '}
                        {selectedTour.isPrivateCharter
                          ? 'Incluido en base'
                          : formatMoney(selectedTour.adultPriceUsd)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-lg hover:bg-white/10"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-lg">{adults}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setAdults(
                            Math.min(
                              (selectedDateObj?.spotsLeft || 20) - children,
                              adults + 1
                            )
                          )
                        }
                        className="w-9 h-9 rounded-full border border-amber-400/60 bg-amber-400/10 text-amber-300 flex items-center justify-center text-lg hover:bg-amber-400/20"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-stone-950/70 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-white block">Niños (4 – 11 años)</span>
                      <span className="text-xs text-stone-400 block mt-0.5">
                        Menores de 4 años viajan gratis ·{' '}
                        {selectedTour.isPrivateCharter
                          ? 'Incluido en base'
                          : formatMoney(selectedTour.childPriceUsd)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-lg hover:bg-white/10"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-lg">{children}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setChildren(
                            Math.min(
                              (selectedDateObj?.spotsLeft || 20) - adults,
                              children + 1
                            )
                          )
                        }
                        className="w-9 h-9 rounded-full border border-amber-400/60 bg-amber-400/10 text-amber-300 flex items-center justify-center text-lg hover:bg-amber-400/20"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PASO 3: EXTRAS / UPGRADES (UPSELLING CON UN CLIC) */}
            {step === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 0.99, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-serif text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                    3. Eleva tu experiencia (Opcional)
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Añade detalles memorables con un solo clic. Todo estará listo antes de abordar.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ADDONS_CATALOG.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-400 bg-emerald-950/70 ring-1 ring-amber-400/50'
                            : 'border-white/10 bg-stone-950/60 hover:border-white/25'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="p-2.5 rounded-xl bg-stone-900 border border-white/10">
                              {getAddonIcon(addon.category)}
                            </div>
                            {addon.badge && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                {addon.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-white mt-3 text-base">
                            {addon.name}
                          </h4>
                          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                            {addon.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-amber-300">
                              +{formatMoney(addon.priceUsd)}
                            </span>
                            <span className="text-[11px] text-stone-400 ml-1">
                              {addon.pricingType === 'PER_PERSON'
                                ? '/ por persona'
                                : '/ por reserva'}
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-amber-400 text-stone-950'
                                : 'bg-white/10 text-stone-200'
                            }`}
                          >
                            {isSelected ? 'Añadido ✓' : '+ Añadir'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* PASO 4: DATOS DEL PASAJERO PRINCIPAL */}
            {step === 4 && (
              <motion.div
                key="step-4"
                custom={direction}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 0.99, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-serif text-white">
                    4. Datos del Pasajero Principal
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Enviaremos tu pase de abordar digital con código QR por WhatsApp y correo electrónico.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2">
                      Nombre completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Ej. Valeria Morales"
                        value={passenger.fullName}
                        onChange={(e) =>
                          setPassenger({ ...passenger, fullName: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-950 border border-white/15 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2">
                      WhatsApp (con código de país) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+506 8888 8888"
                        value={passenger.whatsappPhone}
                        onChange={(e) =>
                          setPassenger({ ...passenger, whatsappPhone: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-950 border border-white/15 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2">
                      Correo electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="valeria@ejemplo.com"
                        value={passenger.email}
                        onChange={(e) =>
                          setPassenger({ ...passenger, email: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-950 border border-white/15 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2">
                      Hotel en La Fortuna / Arenal (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Nayara Springs / Tabacón"
                      value={passenger.pickupHotel}
                      onChange={(e) =>
                        setPassenger({ ...passenger, pickupHotel: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-white/15 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2">
                      Requerimientos dietéticos o alergias
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Vegetariano, sin gluten, alergia a mariscos"
                      value={passenger.dietaryRequirements}
                      onChange={(e) =>
                        setPassenger({
                          ...passenger,
                          dietaryRequirements: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-white/15 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* PASO 5: RESUMEN FINAL Y CHECKOUT TILOPAY */}
            {step === 5 && (
              <motion.div
                key="step-5"
                custom={direction}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 0.99, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-serif text-white">
                    5. Verificación y Pago Seguro con Tilopay
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Revisa los detalles de tu reserva antes de proceder al cobro encriptado con 3D-Secure.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-950/90 border border-white/10 space-y-4">
                  <div className="flex flex-wrap justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs text-amber-400 uppercase tracking-wider">
                        Experiencia Seleccionada
                      </span>
                      <h4 className="text-lg font-serif text-white">
                        {selectedTour.title}
                      </h4>
                      <p className="text-xs text-stone-400">
                        Fecha: {selectedDate} · Horario: {selectedTour.schedule}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">Pasajeros</span>
                      <span className="font-semibold text-white">
                        {adults} Adultos{children > 0 ? `, ${children} Niños` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-300">
                    <div>
                      <span className="text-stone-500 block">Titular de Reserva:</span>
                      <span className="font-medium text-white">{passenger.fullName}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Entrega de Voucher QR:</span>
                      <span className="font-medium text-white">
                        {passenger.whatsappPhone} · {passenger.email}
                      </span>
                    </div>
                    {passenger.dietaryRequirements && (
                      <div className="sm:col-span-2">
                        <span className="text-stone-500 block">Notas de Cocina / Dieta:</span>
                        <span className="text-amber-300">{passenger.dietaryRequirements}</span>
                      </div>
                    )}
                  </div>

                  {/* Equivalencia transparente en ambas monedas */}
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-emerald-300 font-medium block">
                        Total con IVA (13%) incluido
                      </span>
                      <span className="text-xs text-stone-400">
                        Tipo de cambio oficial referencial: ₡{EXCHANGE_RATE_CRC} / $1 USD
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-white block">
                        ${pricing.totalUsd.toFixed(2)} USD
                      </span>
                      <span className="text-xs text-amber-300 font-medium">
                        Equivalente a ₡{pricing.totalCrc.toLocaleString('es-CR')} CRC
                      </span>
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center gap-3 text-xs text-red-200">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCheckoutWithTilopay}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 font-bold text-base shadow-xl shadow-amber-500/20 hover:brightness-105 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generando sesión segura en Tilopay...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>
                        Pagar {formatMoney(pricing.totalUsd, currency)} con Tarjeta (Tilopay)
                      </span>
                    </>
                  )}
                </button>

                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400 pt-2">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-400" /> Visa · Mastercard · AMEX
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Encriptación PCI-DSS 3DS
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Barra de Navegación Inferior del Wizard */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => goToStep(step - 1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-xs sm:text-sm font-medium text-stone-200 hover:bg-white/5 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Paso anterior
              </button>
            ) : (
              <div />
            )}

            {step < 5 && (
              <button
                type="button"
                disabled={!canContinueStep}
                onClick={() => goToStep(step + 1)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-stone-950 font-semibold text-xs sm:text-sm shadow-lg shadow-amber-400/10 hover:bg-amber-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Continuar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN EN VIVO STICKY */}
        <aside className="lg:col-span-4 lg:sticky lg:top-8 space-y-4">
          <div className="rounded-3xl bg-stone-900/90 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="relative h-36">
              <img
                src={selectedTour.image}
                alt={selectedTour.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
              <div className="absolute bottom-3 left-5 right-5">
                <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                  Catamarán Tucán Arenal
                </span>
                <h4 className="text-lg font-serif text-white leading-snug">
                  {selectedTour.title}
                </h4>
              </div>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="space-y-2 text-xs text-stone-300 pb-4 border-b border-white/10">
                <div className="flex justify-between">
                  <span className="text-stone-400">Fecha de salida:</span>
                  <span className="font-medium text-white">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Horario:</span>
                  <span className="font-medium text-white">{selectedTour.schedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Huéspedes:</span>
                  <span className="font-medium text-white">
                    {adults} adulto{adults > 1 ? 's' : ''}
                    {children > 0 ? ` + ${children} niño${children > 1 ? 's' : ''}` : ''}
                  </span>
                </div>
              </div>

              {/* Desglose de Precios en Vivo */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span>
                    {selectedTour.isPrivateCharter
                      ? `Chárter Privado (${pricing.totalGuests} pax)`
                      : `Experiencia base (${pricing.totalGuests} pax)`}
                  </span>
                  <span className="font-medium text-white">
                    {formatMoney(pricing.baseExperienceUsd)}
                  </span>
                </div>

                {selectedAddons.map((id) => {
                  const addon = ADDONS_CATALOG.find((a) => a.id === id);
                  if (!addon) return null;
                  const addonTotal =
                    addon.pricingType === 'PER_PERSON'
                      ? addon.priceUsd * pricing.totalGuests
                      : addon.priceUsd;
                  return (
                    <div key={id} className="flex justify-between text-emerald-300">
                      <span className="truncate pr-2">+ {addon.name}</span>
                      <span className="font-medium shrink-0">
                        {formatMoney(addonTotal)}
                      </span>
                    </div>
                  );
                })}

                <div className="flex justify-between text-stone-400 pt-2 border-t border-white/10">
                  <span>Subtotal</span>
                  <span>{formatMoney(pricing.subtotalUsd)}</span>
                </div>

                <div className="flex justify-between text-stone-400">
                  <span>IVA Turismo Costa Rica (13%)</span>
                  <span>{formatMoney(pricing.ivaTaxUsd)}</span>
                </div>

                <div className="pt-3 border-t border-white/15 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">Total</span>
                    <span className="text-[11px] text-stone-400">
                      {currency === 'USD'
                        ? `≈ ₡${pricing.totalCrc.toLocaleString('es-CR')} CRC`
                        : `≈ $${pricing.totalUsd.toFixed(2)} USD`}
                    </span>
                  </div>
                  <span className="text-2xl font-serif font-bold text-amber-400">
                    {formatMoney(pricing.totalUsd)}
                  </span>
                </div>
              </div>

              {/* Badges de Confianza */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] text-stone-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Puntualidad garantizada y cancelación flexible 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wine className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Bebidas ilimitadas y snacks gourmet incluidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Vistas panorámicas 360° al Volcán Arenal</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
