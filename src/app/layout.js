import localFont from "next/font/local";
import "./globals.css";


const sfPro = localFont({
  src: "./fonts/SFPRODISPLAYREGULAR.woff2", 
  variable: "--font-sf",
  display: "swap",
});
export const metadata = {
  title: "Vapor Sports® | B2B Custom Merch Tool For Startups",
  description: "Vapor Sports",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sfPro.variable}`} >
      <body className="antialiased">{children}</body>
    </html>
  );
}
