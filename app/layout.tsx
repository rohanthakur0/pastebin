// app/layout.tsx
import React from 'react';

export const metadata = {
  title: 'Pastebin Lite',
  description: 'A minimal pastebin clone',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
