-- ============================================================================
-- ESQUEMA DE BASE DE DATOS: CATAMARÁN TUCÁN ARENAL (Supabase / PostgreSQL)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS DE DOMINIO
CREATE TYPE tour_type AS ENUM ('MORNING_BREEZE', 'SUNSET_EXPERIENCE', 'PRIVATE_CHARTER');
CREATE TYPE booking_status AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'EXPIRED', 'REFUNDED');
CREATE TYPE payment_status AS ENUM ('INITIATED', 'APPROVED', 'DECLINED', 'ERROR');
CREATE TYPE currency_code AS ENUM ('USD', 'CRC');

-- 2. CATÁLOGO DE EXPERIENCIAS (TOURS)
CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(64) UNIQUE NOT NULL,
  type tour_type NOT NULL,
  title VARCHAR(120) NOT NULL,
  subtitle VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 180,
  departure_time TIME NOT NULL,
  base_price_adult_usd NUMERIC(10, 2) NOT NULL,
  base_price_child_usd NUMERIC(10, 2) NOT NULL DEFAULT 0,
  flat_rate_usd NUMERIC(10, 2), -- Usado para Chárter Privado
  max_capacity INT NOT NULL DEFAULT 35,
  includes JSONB NOT NULL DEFAULT '[]'::jsonb,
  hero_image_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DISPONIBILIDAD Y SALIDAS POR FECHA (INVENTARIO EN TIEMPO REAL)
CREATE TABLE tour_departures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  departure_date DATE NOT NULL,
  total_capacity INT NOT NULL DEFAULT 35,
  booked_seats INT NOT NULL DEFAULT 0,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  weather_note VARCHAR(255),
   price_override_usd NUMERIC(10, 2),
  UNIQUE (tour_id, departure_date),
  CONSTRAINT valid_capacity CHECK (booked_seats <= total_capacity AND booked_seats >= 0)
);

-- 4. EXTRAS & UPGRADES (UPSELLING)
CREATE TABLE addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price_usd NUMERIC(10, 2) NOT NULL,
  pricing_type VARCHAR(20) NOT NULL CHECK (pricing_type IN ('PER_BOOKING', 'PER_PERSON')),
  category VARCHAR(40) NOT NULL, -- 'GASTRONOMY', 'TRANSPORT', 'PHOTO', 'ROMANCE'
  icon_name VARCHAR(40) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. CLIENTES (PASAJERO PRINCIPAL)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(160) NOT NULL,
  whatsapp_phone VARCHAR(40) NOT NULL,
  country_code VARCHAR(5) DEFAULT 'CR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);

-- 6. RESERVAS (BOOKINGS)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference VARCHAR(16) UNIQUE NOT NULL, -- Ej: TUC-2026-8F4A
  tour_id UUID NOT NULL REFERENCES tours(id),
  departure_id UUID REFERENCES tour_departures(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  booking_date DATE NOT NULL,
  adults_count INT NOT NULL CHECK (adults_count >= 1),
  children_count INT NOT NULL DEFAULT 0 CHECK (children_count >= 0),
  dietary_requirements TEXT,
  pickup_hotel VARCHAR(180),
  
  -- Desglose financiero
  currency currency_code NOT NULL DEFAULT 'USD',
  exchange_rate_crc NUMERIC(10, 2) NOT NULL DEFAULT 515.00,
  subtotal_usd NUMERIC(10, 2) NOT NULL,
  addons_total_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  iva_tax_usd NUMERIC(10, 2) NOT NULL, -- 13% IVA Turismo CR
  total_usd NUMERIC(10, 2) NOT NULL,
  total_charged NUMERIC(12, 2) NOT NULL, -- En la moneda seleccionada (USD o CRC)
  
  -- Estado y Voucher QR
  status booking_status NOT NULL DEFAULT 'PENDING_PAYMENT',
  qr_voucher_token VARCHAR(128) UNIQUE,
  checked_in_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '20 minutes'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_status_date ON bookings(status, booking_date);

-- 7. DETALLE DE EXTRAS POR RESERVA
CREATE TABLE booking_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  addon_id UUID NOT NULL REFERENCES addons(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price_usd NUMERIC(10, 2) NOT NULL,
  total_price_usd NUMERIC(10, 2) NOT NULL
);

-- 8. TRANSACCIONES DE PAGO (TILOPAY)
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider VARCHAR(30) NOT NULL DEFAULT 'TILOPAY',
  tilopay_order_id VARCHAR(100) NOT NULL,
  tilopay_transaction_id VARCHAR(100),
  auth_code VARCHAR(50),
  amount NUMERIC(12, 2) NOT NULL,
  currency currency_code NOT NULL,
  status payment_status NOT NULL DEFAULT 'INITIATED',
  card_brand VARCHAR(30),
  card_last4 VARCHAR(4),
  raw_webhook_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_tilopay_order ON payment_transactions(tilopay_order_id);

-- 9. FUNCIÓN ATÓMICA PARA CONFIRMAR PAGO Y OCUPAR ASIENTOS
CREATE OR REPLACE FUNCTION confirm_booking_payment(
  p_booking_reference VARCHAR,
  p_tilopay_tx_id VARCHAR,
  p_auth_code VARCHAR,
  p_raw_payload JSONB
) RETURNS TABLE (
  booking_id UUID,
  customer_name VARCHAR,
  customer_email VARCHAR,
  customer_phone VARCHAR,
  qr_token VARCHAR
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_booking RECORD;
  v_qr_token VARCHAR;
BEGIN
  SELECT * INTO v_booking
  FROM bookings
  WHERE booking_reference = p_booking_reference
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking % not found', p_booking_reference;
  END IF;

  IF v_booking.status = 'CONFIRMED' THEN
    -- Idempotencia en caso de reintento de webhook
    RETURN QUERY
    SELECT b.id, c.full_name, c.email, c.whatsapp_phone, b.qr_voucher_token
    FROM bookings b
    JOIN customers c ON c.id = b.customer_id
    WHERE b.id = v_booking.id;
    RETURN;
  END IF;

  v_qr_token := encode(gen_random_bytes(24), 'hex');

  UPDATE bookings
  SET status = 'CONFIRMED',
      qr_voucher_token = v_qr_token,
      updated_at = NOW()
  WHERE id = v_booking.id;

  UPDATE payment_transactions
  SET status = 'APPROVED',
      tilopay_transaction_id = p_tilopay_tx_id,
      auth_code = p_auth_code,
      raw_webhook_payload = p_raw_payload,
      updated_at = NOW()
  WHERE booking_id = v_booking.id;

  IF v_booking.departure_id IS NOT NULL THEN
    UPDATE tour_departures
    SET booked_seats = booked_seats + (v_booking.adults_count + v_booking.children_count)
    WHERE id = v_booking.departure_id;
  END IF;

  RETURN QUERY
  SELECT b.id, c.full_name, c.email, c.whatsapp_phone, b.qr_voucher_token
  FROM bookings b
  JOIN customers c ON c.id = b.customer_id
  WHERE b.id = v_booking.id;
END;
$$;
