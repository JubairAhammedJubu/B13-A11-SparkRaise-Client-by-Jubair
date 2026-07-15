import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TokenSync from "@/components/TokenSync";
import { Toaster } from 'react-hot-toast';
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SparkRaise | Crowdfunding Platform",
  description:
    "Raise funds for the projects, causes, and products you care about.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="#6366f1" showSpinner={false} />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1d24',
              color: '#f1f5f9',
              border: '1px solid #374151',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <Navbar />
        <TokenSync />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
