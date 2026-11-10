'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  QrCode,
  Calendar,
  Clock,
  Users,
  MapPin,
  Sparkles,
  MessageCircle,
  Mail,
  Download,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();

  const reference =
    searchParams.get('reference') || searchParams.get('ref') || 'DEMO-TUC-001';
  const guestName = searchParams.get('name') || 'Valeria Morales (Demo VIP)';
  const email = searchParams.get('email') || 'info@catamarantucanarenalcr.com';
  const phone = searchParams.get('phone') || '+506 8471-9595';
  const tourTitle =
    searchParams.get('tour') ||
    'Tour Regular Fin de Semana (Sábados y Domingos)';
  const date =
    searchParams.get('date') ||
    new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const guests = searchParams.get('guests') || '2';
  const amount = searchParams.get('amount') || '146.90';
  const currency = searchParams.get('currency') || 'USD';
  const isDemo =
    searchParams.get('mode') === 'demo' || reference.startsWith('DEMO-');

  const qrPayload = encodeURIComponent(
    `https://catamarantucanarenalcr.com/voucher/${reference}?guest=${guestName}&date=${date}&pax=${guests}`
  );
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=12&data=${qrPayload}`;

  return (
    <main className="min-h-screen bg-[#07110e] text-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navegación superior con Logo Original */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-300 hover:text-amber-300 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>

          <div className="flex items-center gap-2.5">
            <img
              src="/images/tucan/logo.webp"
              alt="Logo Catamarán Tucán Arenal"
              className="w-9 h-9 rounded-lg bg-white p-0.5 object-contain"
            />
            <span className="font-serif text-sm tracking-wider text-white">
              CATAMARÁN TUCÁN ARENAL
            </span>
          </div>
        </div>

        {/* Banner de Modo Demo si está activo */}
        {isDemo && (
          <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-200">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Modo Demo Activo:</strong> Simulación completa de pago aprobado en Tilopay y generación instantánea de Voucher QR.
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-400 text-stone-950 font-bold uppercase tracking-wider text-[10px] self-start sm:self-auto">
              Sandbox Preview
            </span>
          </div>
        )}

        {/* Encabezado de Éxito */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold block">
            Pago Aprobado · Reserva Confirmada
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-white">
            ¡Estamos listos para zarpar, {guestName.split(' ')[0]}!
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto">
            Hemos enviado una copia de tu pase de abordar digital al WhatsApp{' '}
            <span className="text-white font-medium">{phone}</span> y al correo{' '}
            <span className="text-white font-medium">{email}</span>.
          </p>
        </div>

        {/* Tarjeta Boarding Pass / Voucher Digital con QR y Foto Real */}
        <div className="rounded-3xl bg-stone-900/90 border border-white/15 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6 border-b md:border-b-0 md:border-r border-dashed border-white/15">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/tucan/logo.webp"
                    alt="Catamarán Tucán Arenal"
                    className="w-7 h-7 rounded bg-white p-0.5 object-contain"
                  />
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Pase de Abordar Oficial
                  </span>
                </div>
                <span className="text-xs font-mono text-stone-400">
                  REF: <strong className="text-amber-400 text-sm">{reference}</strong>
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-serif text-white">
                  {tourTitle}
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Incluye: Almuerzo, Toboganes, Rampas de Clavados, Kayaks, Banana, Música con DJ y Karaoke (3.5 horas aprox.)
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-white/10">
                  <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Fecha de Zarpe
                  </span>
                  <span className="text-sm font-bold text-white block mt-1">
                    {date}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-white/10">
                  <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Salida Oficial
                  </span>
                  <span className="text-sm font-bold text-white block mt-1">
                    10:00 AM (Muelle)
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" /> Pasajeros
                  </span>
                  <span className="text-sm font-bold text-white block mt-1">
                    {guests} Personas
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">
                    Punto de Embarque: Puerto San Luis, Tilarán, Guanacaste
                  </span>
                  <span className="text-stone-400">
                    Lago Arenal · Consultas y WhatsApp: +506 8471-9595 / 8393-9411
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-stone-400 block">Total Pagado (Tilopay)</span>
                <span className="text-lg font-bold text-amber-400">
                  {currency === 'CRC'
                    ? `₡${Number(amount).toLocaleString('es-CR')} CRC`
                    : `$${amount} USD`}
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Código QR de Abordaje (4 cols) */}
          <div className="md:col-span-4 p-6 sm:p-8 bg-stone-950/60 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-3 bg-white rounded-2xl shadow-xl">
              <img
                src={qrImageUrl}
                alt={`Código QR Reserva ${reference}`}
                className="w-44 h-44 object-contain"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                <QrCode className="w-4 h-4" /> Escaneo en Puerto San Luis
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                Presenta este código QR desde tu teléfono antes de abordar el Catamarán Tucán.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones rápidas post-reserva */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="py-3.5 px-5 rounded-2xl bg-stone-900 border border-white/15 hover:border-amber-400/50 text-xs font-semibold text-white flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Descargar / Imprimir Voucher PDF
          </button>

          <a
            href={`https://wa.me/50684719595?text=${encodeURIComponent(
              `¡Hola Catamarán Tucán Arenal! Mi reserva confirmada es la ${reference} a nombre de ${guestName} para el ${date} en Puerto San Luis, Tilarán.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="py-3.5 px-5 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-200 flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            WhatsApp Oficial (+506 8471-9595)
          </a>

          <Link
            href="/"
            className="py-3.5 px-5 rounded-2xl bg-amber-400 text-stone-950 hover:bg-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Mail className="w-4 h-4" />
            Hacer otra reserva
          </Link>
        </div>

        <div className="text-center text-xs text-stone-500 flex items-center justify-center gap-2 pt-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Catamarán Tucán Arenal · info@catamarantucanarenalcr.com · Puerto San Luis, Tilarán, Guanacaste
          </span>
        </div>
      </div>
    </main>
  );
}

export default function ReservaConfirmadaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07110e] text-stone-200 flex items-center justify-center text-sm">
          Generando tu Voucher Digital con Código QR...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
