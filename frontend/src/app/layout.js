import './globals.css';

export const metadata = {
  title: 'किसान मित्र - कृषक सेवा पोर्टल',
  description: 'Smart agricultural decision support for Indian farmers'
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Hind:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
