import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/providers/Toaster";

const inter = Inter({ subsets: ["latin"] });

// SEO Configuration – Kingdom Recovery Church
const siteConfig = {
  name: "Kingdom Recovery Church",
  title: "Kingdom Recovery Church – Admin Portal",
  description: "Kingdom Recovery Church ministry admin. Manage sermons, events, members, devotionals, and community.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://your-church-admin.com",
  /** Logo used for favicon, Open Graph, Twitter Cards, and JSON-LD. Use absolute path; metadataBase resolves it for sharing. */
  logo: "/church-home-icon.png",
  ogImage: "/church-home-icon.png",
  keywords: [
    "Kingdom Recovery Church",
    "church management",
    "church admin",
    "ministry management",
    "church portal",
    "sermon management",
    "event management",
    "member management",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.name,
    },
  ],
  creator: siteConfig.name,
  manifest: "/manifest.json",
  
  // Open Graph metadata for social sharing (Facebook, LinkedIn, WhatsApp, etc.)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 512,
        height: 512,
        alt: `${siteConfig.name} – Church logo`,
        type: "image/png",
      },
    ],
  },
  
  // Twitter Card metadata (Twitter/X, etc.)
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: {
      url: siteConfig.ogImage,
      alt: `${siteConfig.name} – Church logo`,
      width: 512,
      height: 512,
    },
    creator: "@yourchurch", // Update with your Twitter handle
  },
  
  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
    startupImage: [
      {
        url: siteConfig.ogImage,
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Icons (browser tab, bookmarks, PWA) – logo for SEO and recognition when shared
  icons: {
    icon: siteConfig.logo,
    shortcut: siteConfig.logo,
    apple: siteConfig.logo,
  },
  
  // Additional metadata
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // For devices with notches
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#4f46e5" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured data for Organization (JSON-LD) – helps search engines and social platforms show logo + name
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: siteConfig.logo.startsWith("http") ? siteConfig.logo : `${siteConfig.url}${siteConfig.logo}`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    sameAs: [
      // Add your social media links here for richer SEO
      // "https://www.facebook.com/yourchurch",
      // "https://www.instagram.com/yourchurch",
      // "https://www.youtube.com/yourchurch",
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* iOS Safari specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
