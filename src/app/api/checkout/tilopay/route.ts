import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { BookingPayload } from '@/types/booking';
import { TOURS_CATALOG, ADDONS_CATALOG } from '@/components/booking/BookingWizard';
import { createTilopayPaymentSession, isTilopayDemoMode } from '@/lib/tilopay';

const EXCHANGE_RATE_CRC = 515;
const COSTA_RICA_IVA_RATE = 0.13;

// Almacenamiento en memoria para fallback cuando Supabase no está configurado
const memoryBookingsStore = new Map<string, Record<string, unknown>>();

function getOptionalSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return null;
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BookingPayload;
    const { tourId, date, adults, children, selectedAddonIds, passenger, currency } = body;

    if (!tourId || !date || adults < 1 || !passenger?.email || !passenger?.fullName) {
      return NextResponse.json(
        { error: 'Datos incompletos para procesar la reserva.' },
        { status: 400 }
      );
    }

    const tour = TOURS_CATALOG.find((t) => t.id === tourId);
    if (!tour) {
      return NextResponse.json({ error: 'Experiencia no encontrada.' }, { status: 404 });
    }

    // 1. Recálculo de precios en servidor (Zero-Trust contra manipulación en cliente)
    const totalGuests = adults + children;
    let baseExperienceUsd = 0;

    if (tour.isPrivateCharter && tour.flatRateUsd) {
      const extraGuests = Math.max(0, totalGuests - (tour.maxIncludedGuests || 12));
      baseExperienceUsd =
        tour.flatRateUsd + extraGuests * (tour.extraGuestPriceUsd || 75);
    } else {
      baseExperienceUsd = adults * tour.adultPriceUsd + children * tour.childPriceUsd;
    }

    const addonsUsd = (selectedAddonIds || []).reduce((acc, addonId) => {
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
    const totalCharged =
      currency === 'CRC' ? Math.round(totalUsd * EXCHANGE_RATE_CRC) : totalUsd;

    // 2. Generar referencia de reserva (DEMO-TUC-001 en modo demo o TUC-YYYY-XXXX en producción)
    const demoActive = isTilopayDemoMode();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingReference = demoActive
      ? 'DEMO-TUC-001'
      : `TUC-${new Date().getFullYear()}-${randomSuffix}`;

    // 3. Persistir en Supabase si está disponible; si no, fallback automático en memoria
    const supabase = getOptionalSupabaseAdmin();
    let persistedInSupabase = false;
    let bookingDbId: string | null = null;

    if (supabase) {
      try {
        const { data: customerRecord, error: customerError } = await supabase
          .from('customers')
          .insert({
            full_name: passenger.fullName.trim(),
            email: passenger.email.trim().toLowerCase(),
            whatsapp_phone: passenger.whatsappPhone.trim(),
          })
          .select('id')
          .single();

        if (!customerError && customerRecord) {
          const { data: tourDbRecord } = await supabase
            .from('tours')
            .select('id')
            .eq('slug', tour.slug)
            .maybeSingle();

          const { data: bookingRecord, error: bookingError } = await supabase
            .from('bookings')
            .insert({
              booking_reference: bookingReference,
              tour_id: tourDbRecord?.id,
              customer_id: customerRecord.id,
              booking_date: date,
              adults_count: adults,
              children_count: children,
              dietary_requirements: passenger.dietaryRequirements || null,
              pickup_hotel: passenger.pickupHotel || null,
              currency,
              exchange_rate_crc: EXCHANGE_RATE_CRC,
              subtotal_usd: subtotalUsd,
              addons_total_usd: addonsUsd,
              iva_tax_usd: ivaTaxUsd,
              total_usd: totalUsd,
              total_charged: totalCharged,
              status: demoActive ? 'CONFIRMED' : 'PENDING_PAYMENT',
            })
            .select('id')
            .single();

          if (!bookingError && bookingRecord) {
            persistedInSupabase = true;
            bookingDbId = bookingRecord.id;
          }
        }
      } catch (dbErr) {
        console.warn('[SUPABASE_FALLBACK_ACTIVE]: Usando memoria local para demo.', dbErr);
      }
    }

    if (!persistedInSupabase) {
      memoryBookingsStore.set(bookingReference, {
        bookingReference,
        tourId,
        tourTitle: tour.title,
        date,
        adults,
        children,
        selectedAddonIds,
        passenger,
        currency,
        totalUsd,
        totalCharged,
        status: 'CONFIRMED_DEMO',
        createdAt: new Date().toISOString(),
      });
    }

    // 4. Crear sesión de pago en Tilopay (o redirección directa a /reserva-confirmada en Modo Demo)
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUrl = `${appBaseUrl}/api/webhooks/tilopay`;

    const tilopaySession = await createTilopayPaymentSession({
      orderNumber: bookingReference,
      amount: totalCharged,
      currency,
      customerName: passenger.fullName,
      customerEmail: passenger.email,
      customerPhone: passenger.whatsappPhone,
      redirectUrl,
      tourTitle: tour.title,
      date,
      guests: totalGuests,
    });

    if (supabase && bookingDbId) {
      await supabase.from('payment_transactions').insert({
        booking_id: bookingDbId,
        provider: 'TILOPAY',
        tilopay_order_id: tilopaySession.tilopayOrderId,
        amount: totalCharged,
        currency,
        status: tilopaySession.isDemo ? 'APPROVED' : 'INITIATED',
      });
    }

    return NextResponse.json({
      success: true,
      demoMode: tilopaySession.isDemo,
      bookingReference,
      paymentUrl: tilopaySession.paymentUrl,
      totalCharged,
      currency,
    });
  } catch (error: unknown) {
    console.error('[TILOPAY_CHECKOUT_ERROR]:', error);
    const message =
      error instanceof Error ? error.message : 'Error interno procesando la orden.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
