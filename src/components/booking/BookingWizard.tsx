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
  MapPin,
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
    id: 'MORNING_BREEZE',
    slug: 'tour-regular-fin-de-semana-puerto-san-luis',
    title: 'Tour Regular Fin de Semana (Sábados y Domingos)',
    subtitle:
      'Zarpe oficial abierto al público desde Puerto San Luis, Tilarán · 3.5 horas de aventura y naturaleza en el Lago Arenal',
    badge: 'Abierto al Público · 10:00 AM',
    schedule: 'Sábados y Domingos · 10:00 AM – 1:30 PM',
    duration: '3.5 horas aprox.',
    adultPriceUsd: 65,
    childPriceUsd: 45,
    maxCapacity: 150,
    highlights: [
      'Almuerzo completo incluido a bordo + venta de bebidas en barra',
      'Uso de toboganes acuáticos, rampas de clavados, kayaks y banana',
      'Ambiente festivo y familiar con música con DJ en vivo y karaoke',
    ],
    image: '/images/tucan/galeria-1.webp',
  },
  {
    id: 'SUNSET_EXPERIENCE',
    slug: 'grupos-programados-entre-semana',
    title: 'Tour Grupos Programados (Lunes a Viernes)',
    subtitle:
      'Salidas especiales entre semana desde Puerto San Luis para grupos familiares, excursiones y empresas',
    badge: 'Lunes a Viernes',
    schedule: 'Lunes a Viernes · Horario a convenir (10:00 AM o 2:00 PM)',
    duration: '3.5 horas aprox.',
    adultPriceUsd: 65,
    childPriceUsd: 45,
    maxCapacity: 150,
    highlights: [
      'Almuerzo tradicional incluido + barra con venta de bebidas a bordo',
      'Acceso total a toboganes, rampas de clavados, kayaks y banana',
      'Animación con DJ, karaoke y vistas panorámicas del Lago Arenal',
    ],
    image: '/images/tucan/catamaran-aerial.webp',
  },
  {
    id: 'PRIVATE_CHARTER',
    slug: 'charter-privado-catamaran-tucan-150-pax',
    title: 'Chárter Privado Exclusivo (Hasta 150 Pasajeros)',
    subtitle:
      'Reserva la embarcación completa en Puerto San Luis de Tilarán para bodas, eventos corporativos o fiestas privadas',
    badge: 'Capacidad 150 Pax',
    schedule: 'Lunes a Domingo · Horario personalizado',
    duration: '3.5 horas aprox.',
    adultPriceUsd: 0,
    childPriceUsd: 0,
    isPrivateCharter: true,
    flatRateUsd: 1450,
    maxIncludedGuests: 25,
    extraGuestPriceUsd: 48,
    maxCapacity: 150,
    highlights: [
      'Embarcación Catamarán Tucán Arenal en exclusividad (hasta 150 pasajeros)',
      'Almuerzo incluido, DJ en vivo, karaoke, toboganes, kayaks y banana',
      'Atención personalizada saliendo de Puerto San Luis, Tilarán, Guanacaste',
    ],
    image: '/images/tucan/galeria-8.webp',
  },
];

export const ADDONS_CATALOG: AddonOption[] = [
  {
    id: 'addon-drinks-pack',
    code: 'OPEN_BAR_TUCAN_PACK',
    name: 'Paquete de Bebidas Ilimitadas a Bordo',
    description:
      'Añade coctelería, cervezas nacionales, refrescos y bebidas naturales durante las 3.5 horas del recorrido.',
    priceUsd: 25,
    pricingType: 'PER_PERSON',
    badge: 'Más solicitado',
    category: 'ROMANCE',
  },
  {
    id: 'addon-transfer',
    code: 'PRIVATE_TRANSFER_SAN_LUIS',
    name: 'Transporte Privado a Puerto San Luis, Tilarán',
    description:
      'Traslado ida y vuelta en microbús con A/C desde tu hotel en Tilarán, Nuevo Arenal o La Fortuna hasta el muelle.',
    priceUsd: 75,
    pricingType: 'PER_BOOKING',
    category: 'TRANSPORT',
  },
  {
    id: 'addon-celebration',
    code: 'VIP_CELEBRATION_TABLE',
    name: 'Mesa VIP + Queque de Celebración & Decoración',
    description:
      'Ideal para cumpleaños, aniversarios o despedidas a bordo con mención especial del DJ y brindis.',
    priceUsd: 55,
    pricingType: 'PER_BOOKING',
    category: 'GASTRONOMY',
  },
  {
    id: 'addon-drone',
    code: 'DRONE_PHOTO_PACKAGE',
    name: 'Paquete de Fotos y Video Dron en el Lago Arenal',
    description:
      'Cobertura en alta resolución en los toboganes, kayaks, banana y vistas aéreas del catamarán.',
    priceUsd: 85,
    pricingType: 'PER_BOOKING',
    category: 'PHOTO',
  },
];

function generateUpcomingDates(selectedTourId: TourId): DateAvailability[] {
  const result: DateAvailability[] = [];
  const today = new Date();

  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.getDay(); // 0 = Domingo, 6 = Sábado
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const iso = d.toISOString().split('T')[0];

    let spotsLeft = 45;
    if (selectedTourId === 'MORNING_BREEZE' && !isWeekend) {
      // Sábados y domingos abierto al público; entre semana sugerimos modalidad Grupos Programados pero permitimos reservar en demo
      spotsLeft = 25;
    } else if (i % 5 === 0) {
      spotsLeft = 12;
    }

    result.push({
      date: iso,
      spotsLeft,
      status: spotsLeft <= 15 ? 'FEW_LEFT' : 'AVAILABLE',
      weatherForecast: isWeekend
        ? 'Zarpe Público 10:00 AM'
        : 'Grupos Programados',
    });
  }
  return result;
}

const STEPS = [
  { id: 1, label: 'Modalidad y Horario' },
  { id: 2, label: 'Fecha y Personas' },
  { id: 3, label: 'Extras a Bordo' },
  { id: 4, label: 'Tus Datos' },
  { id: 5, label: 'Pago Tilopay' },
];

export default function BookingWizard() {
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  const [selectedTourId, setSelectedTourId] = useState<TourId>('MORNING_BREEZE');
  const upcomingDates = useMemo(
    () => generateUpcomingDates(selectedTourId),
    [selectedTourId]
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    upcomingDates[0]?.date || ''
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

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedTour = useMemo(
    () => TOURS_CATALOG.find((t) => t.id === selectedTourId) || TOURS_CATALOG[0],
    [selectedTourId]
  );

  const selectedDateObj = useMemo(
    () => upcomingDates.find((d) => d.date === selectedDate) || upcomingDates[0],
    [upcomingDates, selectedDate]
  );

  const pricing = useMemo(() => {
    const totalGuests = adults + children;
    let baseExperienceUsd = 0;

    if (selectedTour.isPrivateCharter && selectedTour.flatRateUsd) {
      const extraGuests = Math.max(
        0,
        totalGuests - (selectedTour.maxIncludedGuests || 25)
      );
      baseExperienceUsd =
        selectedTour.flatRateUsd +
        extraGuests * (selectedTour.extraGuestPriceUsd || 48);
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
      return Boolean(selectedDate) && adults >= 1 && pricing.totalGuests <= 150;
    }
    if (step === 3) return true;
    if (step === 4) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email.trim());
      const phoneOk = passenger.whatsappPhone.trim().length >= 8;
      const nameOk = passenger.fullName.trim().length >= 3;
      return emailOk && phoneOk && nameOk;
    }
    return true;
  }, [step, selectedTourId, selectedDate, adults, pricing.totalGuests, passenger]);

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
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-stone-100"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold mb-2">
            <Compass className="w-4 h-4" /> Puerto San Luis, Tilarán, Guanacaste · Reserva Directa
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-white">
            Reserva tu lugar en el Catamarán Tucán Arenal
          </h2>
        </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-stone-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <AnimatePresence mode="wait" custom={direction}>
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
                    1. Selecciona tu modalidad de zarpe
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Todos nuestros recorridos inician en <strong>Puerto San Luis de Tilarán, Guanacaste</strong> (3.5 horas aprox.) e incluyen almuerzo, toboganes, rampas de clavados, kayaks, banana, música con DJ y karaoke.
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
                                </div>

                                <div className="text-right">
                                  {tour.isPrivateCharter ? (
                                    <div>
                                      <span className="text-lg font-bold text-amber-400">
                                        {formatMoney(tour.flatRateUsd || 1450)}
                                      </span>
                                      <span className="block text-[11px] text-stone-400">
                                        Base hasta {tour.maxIncludedGuests} personas
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
                    2. Selecciona fecha y cantidad de pasajeros
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Operamos sábados y domingos a las 10:00 AM abiertos al público y de lunes a viernes para grupos programados (capacidad de hasta 150 pasajeros).
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-amber-400" /> Fechas próximas disponibles
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                    {upcomingDates.map((item) => {
                      const d = new Date(`${item.date}T12:00:00`);
                      const dayName = d.toLocaleDateString('es-CR', { weekday: 'short' });
                      const dayNum = d.getDate();
                      const monthName = d.toLocaleDateString('es-CR', { month: 'short' });
                      const isSelected = selectedDate === item.date;
                      const isWeekend = d.getDay() === 0 || d.getDay() === 6;

                      return (
                        <button
                          key={item.date}
                          type="button"
                          onClick={() => setSelectedDate(item.date)}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                            isSelected
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
                              isWeekend
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {isWeekend ? '10:00 AM' : 'Grupos'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-stone-950/70 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span className="font-medium text-white">Adultos</span>
                      </div>
                      <span className="text-xs text-stone-400 block mt-0.5">
                        Incluye almuerzo y actividades ·{' '}
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
                      <span className="w-8 text-center font-bold text-lg">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(Math.min(150 - children, adults + 1))}
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
                        Incluye chaleco, almuerzo y toboganes ·{' '}
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
                      <span className="w-8 text-center font-bold text-lg">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(Math.min(150 - adults, children + 1))}
                        className="w-9 h-9 rounded-full border border-amber-400/60 bg-amber-400/10 text-amber-300 flex items-center justify-center text-lg hover:bg-amber-400/20"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

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
                    3. Extras y paquetes de bebidas a bordo (Opcional)
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Tu entrada ya incluye almuerzo, toboganes, rampas de clavados, kayaks, banana, música con DJ y karaoke. Añade extras con un clic:
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
                    Enviaremos tu confirmación y código QR de abordaje para presentar en Puerto San Luis de Tilarán.
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
                        placeholder="Su nombre aquí"
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
                      Teléfono / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+506 8471 9595"
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
                        placeholder="correo@ejemplo.com"
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
                      Procedencia u Hotel (Tilarán / Arenal / La Fortuna)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Tilarán centro / Hotel en Arenal"
                      value={passenger.pickupHotel}
                      onChange={(e) =>
                        setPassenger({ ...passenger, pickupHotel: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-white/15 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2">
                      Información adicional o restricciones alimentarias (Almuerzo)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Almuerzo vegetariano, celebración de cumpleaños..."
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
                    5. Confirmación y Pago Seguro con Tilopay
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Verifica los detalles de tu zarpe desde Puerto San Luis, Tilarán antes de completar tu reserva.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-950/90 border border-white/10 space-y-4">
                  <div className="flex flex-wrap justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs text-amber-400 uppercase tracking-wider">
                        Modalidad Seleccionada
                      </span>
                      <h4 className="text-lg font-serif text-white">
                        {selectedTour.title}
                      </h4>
                      <p className="text-xs text-stone-400">
                        Fecha: {selectedDate} · {selectedTour.schedule}
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
                    <div className="sm:col-span-2">
                      <span className="text-stone-500 block">Punto de Zarpe:</span>
                      <span className="text-emerald-300 font-medium">
                        Puerto San Luis, Tilarán, Guanacaste (Lago Arenal)
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-emerald-300 font-medium block">
                        Total con IVA (13%) e inclusiones oficiales
                      </span>
                      <span className="text-xs text-stone-400">
                        Incluye Almuerzo, Toboganes, Rampas de Clavados, Kayaks, Banana, DJ y Karaoke
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
                        Confirmar y Pagar {formatMoney(pricing.totalUsd, currency)} (Tilopay)
                      </span>
                    </>
                  )}
                </button>

                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400 pt-2">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-400" /> Visa · Mastercard · AMEX
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> WhatsApp Soporte: +506 8471-9595
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
            <div className="relative h-40">
              <img
                src={selectedTour.image}
                alt={selectedTour.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
              <div className="absolute top-3 left-4 flex items-center gap-2">
                <img
                  src="/images/tucan/logo.webp"
                  alt="Logo Catamarán Tucán Arenal"
                  className="w-8 h-8 rounded-full bg-white/90 p-0.5 object-contain"
                />
                <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold drop-shadow">
                  Catamarán Tucán Arenal
                </span>
              </div>
              <div className="absolute bottom-3 left-5 right-5">
                <h4 className="text-lg font-serif text-white leading-snug">
                  {selectedTour.title}
                </h4>
              </div>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="space-y-2 text-xs text-stone-300 pb-4 border-b border-white/10">
                <div className="flex justify-between">
                  <span className="text-stone-400">Salida desde:</span>
                  <span className="font-medium text-amber-300">Puerto San Luis, Tilarán</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Fecha seleccionada:</span>
                  <span className="font-medium text-white">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Duración:</span>
                  <span className="font-medium text-white">{selectedTour.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Pasajeros:</span>
                  <span className="font-medium text-white">
                    {adults} adulto{adults > 1 ? 's' : ''}
                    {children > 0 ? ` + ${children} niño${children > 1 ? 's' : ''}` : ''}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span>
                    {selectedTour.isPrivateCharter
                      ? `Chárter Privado (${pricing.totalGuests} pax)`
                      : `Entradas Tour (${pricing.totalGuests} pax)`}
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
                  <span>IVA Costa Rica (13%)</span>
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

              <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] text-stone-300">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Almuerzo incluido + venta de bebidas a bordo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Toboganes, Rampas de Clavados, Kayaks, Banana, DJ y Karaoke</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Puerto San Luis, Tilarán, Guanacaste · Tel: 8471-9595</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
