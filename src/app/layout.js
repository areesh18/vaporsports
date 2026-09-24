import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vapor Sports",
  description: "Vapor Sports — Performance, engineered.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
