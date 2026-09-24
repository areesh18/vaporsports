import localFont from "next/font/local";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});
const sfPro = localFont({
  src: "./fonts/SFPRODISPLAYREGULAR.woff2", 
  weight: "500",
  variable: "--font-sf",
  display: "swap",
});
export const metadata = {
  title: "Vapor Sports",
  description: "Vapor Sports — Performance, engineered.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} ${sfPro.variable}`} >
      <body className="antialiased">{children}</body>
    </html>
  );
}
