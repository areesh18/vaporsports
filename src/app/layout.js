import { Geist } from "next/font/google";
import "./globals.css";
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});
/* const sfProBold = localFont({
  src: "./fonts/SFPRODISPLAYBOLD.woff2",
  variable: "--font-sf-pro",
  display: "swap",
});

const sfProMedium = localFont({
  src: "./fonts/SFPRODISPLAYMEDIUM.woff2",
  variable: "--font-sf-pro-med",
  display: "swap",
}); */
export const metadata = {
  title:
    "Vapor Sports® | OEM & Custom Apparel Manufacturer to bring complex technical apparel concepts to market.",
  description:
    "Vapor Sports® is an OEM and custom apparel manufacturer specializing in performance sportswear, technical outerwear, and custom garments. We partner with independent labels and athletic brands to manage complete production runs - handling pattern development, low-minimum sampling, specialized print techniques, and white-label finishing. Our focus remains on structural quality, fit precision, and reliable manufacturing to bring complex technical apparel concepts to market.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} `}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
