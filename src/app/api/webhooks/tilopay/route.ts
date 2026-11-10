import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyTilopayWebhookHash, isTilopayDemoMode } from '@/lib/tilopay';

function getOptionalSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey || isTilopayDemoMode()) {
    return null;
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/**
 * Dispara la confirmación con Voucher QR por WhatsApp Cloud API y Email (Resend)
 */
async function sendInstantVoucherNotifications(params: {
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  qrToken: string;
}) {
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const voucherUrl = `${appBaseUrl}/reserva-confirmada?reference=${params.bookingReference}&token=${params.qrToken}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    voucherUrl
  )}`;

  // 1. Notificación por WhatsApp Cloud API (si está configurada)
  if (process.env.WHATSAPP_CLOUD_TOKEN && process.env.WHATSAPP_PHONE_ID) {
    await fetch(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: params.customerPhone.replace(/[^0-9]/g, ''),
          type: 'template',
          template: {
            name: 'catamaran_tucan_voucher_confirmado',
            language: { code: 'es' },
            components: [
              {
                type: 'header',
                parameters: [{ type: 'image', image: { link: qrImageUrl } }],
              },
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: params.customerName },
                  { type: 'text', text: params.bookingReference },
                  { type: 'text', text: voucherUrl },
                ],
              },
            ],
          },
        }),
      }
    ).catch((err) => console.error('[WHATSAPP_NOTIFY_ERROR]:', err));
  }

  // 2. Notificación por Email con Voucher Digital y Código QR (Resend API)
  if (process.env.RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Concierge Catamarán Tucán Arenal <reservas@catamarantucanarenalcr.com>',
        to: [params.customerEmail],
        subject: `⛵ Tu Pase de Abordar QR (${params.bookingReference}) — Catamarán Tucán Arenal`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0c1917;color:#f5f5f4;padding:32px;border-radius:16px;">
            <p style="color:#fbbf24;text-transform:uppercase;letter-spacing:2px;font-size:12px;margin:0;">Reserva Confirmada</p>
            <h1 style="margin:8px 0 16px;font-size:24px;">¡Bienvenido a bordo, ${params.customerName}!</h1>
            <p style="color:#d6d3d1;line-height:1.6;">Tu reserva <strong>${params.bookingReference}</strong> en el Lago Arenal ha sido confirmada. Presenta este código QR en el muelle 20 minutos antes del zarpe:</p>
            <div style="text-align:center;margin:24px 0;background:#ffffff;padding:16px;border-radius:12px;display:inline-block;">
              <img src="${qrImageUrl}" alt="Voucher QR ${params.bookingReference}" width="220" height="220" />
            </div>
            <p><a href="${voucherUrl}" style="display:inline-block;background:#fbbf24;color:#090d0c;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Abrir Voucher Digital</a></p>
          </div>
        `,
      }),
    }).catch((err) => console.error('[EMAIL_NOTIFY_ERROR]:', err));
  }
}

/**
 * Webhook Server-to-Server (POST) enviado por Tilopay tras procesar la tarjeta
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const orderNumber = String(payload.orderNumber || payload.order || 'DEMO-TUC-001');
    const responseCode = String(payload.code || payload.responseCode || '1');
    const transactionId = String(payload.tpt || payload.transactionId || 'DEMO-TX');
    const authCode = String(payload.auth || payload.authCode || 'DEMO-AUTH');
    const amount = String(payload.amount || '0.00');
    const currency = String(payload.currency || 'USD');
    const receivedHash = payload.OrderHash || payload.hash || req.headers.get('x-tilopay-signature');

    // Verificar firma HMAC de Tilopay
    const isValidSignature = verifyTilopayWebhookHash({
      orderNumber,
      amount,
      currency,
      responseCode,
      receivedHash,
    });

    if (!isValidSignature && process.env.NODE_ENV === 'production' && !isTilopayDemoMode()) {
      return NextResponse.json({ error: 'Firma de webhook inválida' }, { status: 401 });
    }

    const supabase = getOptionalSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json({
        status: 'CONFIRMED_DEMO',
        bookingReference: orderNumber,
      });
    }

    if (responseCode === '1') {
      const { data, error } = await supabase.rpc('confirm_booking_payment', {
        p_booking_reference: orderNumber,
        p_tilopay_tx_id: transactionId,
        p_auth_code: authCode,
        p_raw_payload: payload,
      });

      if (error) {
        throw new Error(`Error confirmando reserva en BD: ${error.message}`);
      }

      const confirmedRow = Array.isArray(data) ? data[0] : data;
      if (confirmedRow) {
        await sendInstantVoucherNotifications({
          bookingReference: orderNumber,
          customerName: confirmedRow.customer_name,
          customerEmail: confirmedRow.customer_email,
          customerPhone: confirmedRow.customer_phone,
          qrToken: confirmedRow.qr_token,
        });
      }

      return NextResponse.json({ status: 'CONFIRMED', bookingReference: orderNumber });
    }

    await supabase
      .from('payment_transactions')
      .update({
        status: 'DECLINED',
        tilopay_transaction_id: transactionId,
        raw_webhook_payload: payload,
      })
      .eq('tilopay_order_id', orderNumber);

    return NextResponse.json({ status: 'DECLINED', bookingReference: orderNumber });
  } catch (error: unknown) {
    console.error('[TILOPAY_WEBHOOK_POST_ERROR]:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}

/**
 * Callback GET de retorno del navegador del usuario desde Tilopay HPP / 3DS
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code') || '1';
  const orderNumber =
    searchParams.get('order') ||
    searchParams.get('orderNumber') ||
    searchParams.get('reference') ||
    'DEMO-TUC-001';
  const transactionId = searchParams.get('tpt') || 'DEMO-TX';
  const authCode = searchParams.get('auth') || 'DEMO-AUTH';
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (code === '1' && orderNumber) {
    const supabase = getOptionalSupabaseAdmin();
    let qrToken = 'demo-qr-token-verified';

    if (supabase) {
      try {
        const { data } = await supabase.rpc('confirm_booking_payment', {
          p_booking_reference: orderNumber,
          p_tilopay_tx_id: transactionId,
          p_auth_code: authCode,
          p_raw_payload: Object.fromEntries(searchParams.entries()),
        });

        const confirmedRow = Array.isArray(data) ? data[0] : data;
        if (confirmedRow?.qr_token) {
          qrToken = confirmedRow.qr_token;
        }
      } catch (e) {
        console.error('[TILOPAY_REDIRECT_ERROR]:', e);
      }
    }

    return NextResponse.redirect(
      `${appBaseUrl}/reserva-confirmada?reference=${encodeURIComponent(
        orderNumber
      )}&token=${encodeURIComponent(qrToken)}`
    );
  }

  return NextResponse.redirect(
    `${appBaseUrl}/?payment=declined&reference=${encodeURIComponent(orderNumber)}#reservar`
  );
}
