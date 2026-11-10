export type TourId = 'SUNSET_EXPERIENCE' | 'MORNING_BREEZE' | 'PRIVATE_CHARTER';

export type CurrencyCode = 'USD' | 'CRC';

export interface TourOption {
  id: TourId;
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  schedule: string;
  duration: string;
  adultPriceUsd: number;
  childPriceUsd: number;
  isPrivateCharter?: boolean;
  flatRateUsd?: number;
  maxIncludedGuests?: number;
  extraGuestPriceUsd?: number;
  maxCapacity: number;
  highlights: string[];
  image: string;
}

export interface AddonOption {
  id: string;
  code: string;
  name: string;
  description: string;
  priceUsd: number;
  pricingType: 'PER_BOOKING' | 'PER_PERSON';
  badge?: string;
  category: 'ROMANCE' | 'TRANSPORT' | 'GASTRONOMY' | 'PHOTO';
}

export interface DateAvailability {
  date: string; // YYYY-MM-DD
  spotsLeft: number;
  status: 'AVAILABLE' | 'FEW_LEFT' | 'SOLD_OUT';
  weatherForecast?: string;
}

export interface PassengerDetails {
  fullName: string;
  email: string;
  whatsappPhone: string;
  pickupHotel: string;
  dietaryRequirements: string;
  specialOccasion?: 'NONE' | 'HONEYMOON' | 'ANNIVERSARY' | 'BIRTHDAY' | 'PROPOSAL';
}

export interface BookingPayload {
  tourId: TourId;
  date: string;
  adults: number;
  children: number;
  selectedAddonIds: string[];
  passenger: PassengerDetails;
  currency: CurrencyCode;
}

export interface TilopayCreateSessionResponse {
  success: boolean;
  bookingReference: string;
  paymentUrl: string;
  totalCharged: number;
  currency: CurrencyCode;
}
