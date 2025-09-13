import type {Metadata} from 'next';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster"
import { ApiKeyProvider } from './api-key-provider';

export const metadata: Metadata = {
  title: 'EnviroWatch',
  description: 'Real-time Environmental Monitoring',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null;

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ApiKeyProvider apiKey={apiKey}>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </ApiKeyProvider>
      </body>
    </html>
  );
}
