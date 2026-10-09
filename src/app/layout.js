import { Geist} from "next/font/google";
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
  title: "Vapor Sports® | B2B Custom Merch Tool For Startups",
  description:
    "Full-scale custom apparel manufacturing for clothing brands and global labels.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} `}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
