import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";

export const metadata: Metadata = {
  title: "Mhami | Healing Space",
  description: "A safe space to find answers and positive energy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <GlobalErrorBoundary>
          <Providers>
            <div className="bokeh-bg"></div>
            <Navigation />
            {/* Add padding top to account for fixed navigation */}
            <div style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <div style={{ flex: 1 }}>
                {children}
              </div>
              <Footer />
            </div>
          </Providers>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
