import type { Metadata } from "next";
import { Martel, Rubik } from "next/font/google";
import "./globals.css";
import Providers from "~/app/Providers";

const martel = Martel({weight: [400, 600]});
const rubik = Rubik({weight: [400, 500, 600]});

const fontClassName = [martel.className, rubik.className].join(" ");

export const metadata: Metadata = {
  title: "Common Data Usage",
  description:
    "Find connections between data entities on data.gov and code repositories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={fontClassName}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
