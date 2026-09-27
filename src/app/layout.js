import localFont from "next/font/local";
import "./globals.css";


/* const sfProBold = localFont({
  src: "./fonts/SFPRODISPLAYBOLD.woff2", 
  variable: "--font-sf-pro",
  display: "swap",
}); */
const sfProBold = localFont({
  src: "./fonts/SF-Pro-Text-Bold.woff2", 
  variable: "--font-sf-pro",
  display: "swap",
});
/* const sfProMedium = localFont({
  src: "./fonts/SFPRODISPLAYMEDIUM.woff2", 
  variable: "--font-sf-pro-med",
  display: "swap",
}); */
const sfProMedium = localFont({
  src: "./fonts/SF-Pro-Text-Medium.woff2", 
  variable: "--font-sf-pro-med",
  display: "swap",
});
export const metadata = {
  title: "Vapor Sports® | B2B Custom Merch Tool For Startups",
  description: "Full-scale custom apparel manufacturing for clothing brands and global labels.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sfProBold.variable} ${sfProMedium.variable}`} >
      <body className="antialiased">{children}</body>
    </html>
  );
}
