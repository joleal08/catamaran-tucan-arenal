import crypto from 'crypto';
import { CurrencyCode } from '@/types/booking';

const TILOPAY_BASE_URL = process.env.TILOPAY_BASE_URL || 'https://app.tilopay.com/api/v1';

export interface TilopayOrderInput {
  orderNumber: string;
  amount: number;
  currency: CurrencyCode;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  redirectUrl: string;
  tourTitle?: string;
  date?: string;
  guests?: number;
}

/**
 * Determina si el sistema debe operar en Modo Demo / Mock
 * (cuando NEXT_PUBLIC_DEMO_MODE=true o cuando faltan credenciales de Tilopay)
 */
export function isTilopayDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return true;
  }
  return !(
    process.env.TILOPAY_API_KEY &&
    process.env.TILOPAY_API_USER &&
    process.env.TILOPAY_API_PASSWORD
  );
}

/**
 * Obtiene el Bearer Token efímero desde Tilopay API v1
 */
export async function getTilopayBearerToken(): Promise<string> {
  if (isTilopayDemoMode()) {
    return 'demo-mock-bearer-token-tilopay';
  }

  const apiUser = process.env.TILOPAY_API_USER!;
  const apiPassword = process.env.TILOPAY_API_PASSWORD!;

  const response = await fetch(`${TILOPAY_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      apiuser: apiUser,
      password: apiPassword,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error autenticando con Tilopay (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error('Tilopay no devolvió un access_token válido.');
  }

  return data.access_token;
}

/**
 * Crea la sesión de pago segura en Tilopay o simula el flujo en Modo Demo
 */
export async function createTilopayPaymentSession(input: TilopayOrderInput): Promise<{
  paymentUrl: string;
  tilopayOrderId: string;
  isDemo: boolean;
}> {
  if (isTilopayDemoMode()) {
    const params = new URLSearchParams({
      reference: input.orderNumber || 'DEMO-TUC-001',
      name: input.customerName || 'Huésped VIP',
      email: input.customerEmail || 'vip@catamarantucanarenalcr.com',
      phone: input.customerPhone || '+506 8888-8888',
      amount: input.amount.toFixed(2),
      currency: input.currency,
      tour: input.tourTitle || 'Sunset Volcano Experience',
      date: input.date || new Date().toISOString().split('T')[0],
      guests: String(input.guests || 2),
      mode: 'demo',
    });

    return {
      paymentUrl: `/reserva-confirmada?${params.toString()}`,
      tilopayOrderId: `DEMO-ORDER-${Date.now()}`,
      isDemo: true,
    };
  }

  const apiKey = process.env.TILOPAY_API_KEY!;
  const token = await getTilopayBearerToken();
  const [firstName, ...lastNameParts] = input.customerName.trim().split(/\s+/);
  const lastName = lastNameParts.length > 0 ? lastNameParts.join(' ') : 'Huésped';

  const payload = {
    redirect: input.redirectUrl,
    key: apiKey,
    amount: input.amount.toFixed(2),
    currency: input.currency,
    orderNumber: input.orderNumber,
    capture: '1',
    subscription: '0',
    platform: 'nextjs-catamaran-tucan-arenal',
    billToFirstName: firstName,
    billToLastName: lastName,
    billToAddress: 'La Fortuna, San Carlos',
    billToAddress2: 'Lago Arenal',
    billToCity: 'Alajuela',
    billToState: 'CR-A',
    billToZipPostCode: '21007',
    billToCountry: 'CR',
    billToTelephone: input.customerPhone,
    billToEmail: input.customerEmail,
    shipToFirstName: firstName,
    shipToLastName: lastName,
    shipToAddress: 'Muelle Lago Arenal',
    shipToAddress2: 'Catamarán Tucán Arenal',
    shipToCity: 'La Fortuna',
    shipToState: 'CR-A',
    shipToZipPostCode: '21007',
    shipToCountry: 'CR',
    shipToTelephone: input.customerPhone,
    returnData: Buffer.from(
      JSON.stringify({ bookingReference: input.orderNumber })
    ).toString('base64'),
  };

  const response = await fetch(`${TILOPAY_BASE_URL}/processPayment`, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear sesión Tilopay (${response.status}): ${errorText}`);
  }

  const result = (await response.json()) as {
    url?: string;
    urlPaymentForm?: string;
    id?: string | number;
  };

  const paymentUrl = result.url || result.urlPaymentForm;
  if (!paymentUrl) {
    throw new Error('Tilopay no retornó una URL de pago válida.');
  }

  return {
    paymentUrl,
    tilopayOrderId: String(result.id || input.orderNumber),
    isDemo: false,
  };
}

/**
 * Verifica la autenticidad del Webhook / Callback de Tilopay mediante HMAC-SHA256
 */
export function verifyTilopayWebhookHash(params: {
  orderNumber: string;
  amount: string;
  currency: string;
  responseCode: string;
  receivedHash?: string | null;
}): boolean {
  if (isTilopayDemoMode()) {
    return true;
  }

  const secret = process.env.TILOPAY_WEBHOOK_SECRET || process.env.TILOPAY_API_PASSWORD;
  if (!secret || !params.receivedHash) {
    return false;
  }

  const canonicalString = `${params.orderNumber}|${params.amount}|${params.currency}|${params.responseCode}`;
  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(canonicalString)
    .digest('hex');

  const a = Buffer.from(expectedHash, 'utf8');
  const b = Buffer.from(params.receivedHash, 'utf8');
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}
