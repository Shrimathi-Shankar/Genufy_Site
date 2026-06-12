import QrCode from '../../src/views/QrCode.jsx';

export const metadata = {
  title: 'QR Code Generator',
  description:
    'Free advanced QR code generator by Genufy TechWorks - create QR codes for URLs, text, WiFi, email, and contacts with custom colors, styles, and PNG/JPEG/SVG export.',
  alternates: { canonical: '/qr-code' },
};

export default function Page() {
  return <QrCode />;
}
