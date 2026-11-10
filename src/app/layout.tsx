import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Catamarán Tucán Arenal | Luxury Lake Experience en La Fortuna, Costa Rica',
  description:
    'Navega hacia el atardecer frente al Volcán Arenal. Coctelería tropical, gastronomía gourmet y vistas panorámicas 360° en el Lago Arenal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#07110e] text-stone-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
