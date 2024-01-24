import type { Metadata } from "next";
import { Martel, Rubik } from "next/font/google";
import "./globals.css";
import Providers from "~/app/Providers";

const martel = Martel({weight: ['400', '600'], subsets: ["latin"]});
const rubik = Rubik({weight: 'variable', subsets: ["latin"]});

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
    <head>
      <script type="application/json" id="environment-data">
        {JSON.stringify({
          sentryDSN: process.env.SENTRY_DSN,
        })}
      </script>
    </head>
    <body className={fontClassName}>
    <Providers>{children}</Providers>
    </body>
    </html>
  );
}
