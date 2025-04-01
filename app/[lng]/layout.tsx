import Providers from "@/components/Providers";
import { dir } from "i18next";

import "./layout.css";

const languages = ["en", "de"];

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}>) {
  const { lng } = await params;

  return (
    <html lang={lng} dir={dir(lng)}>
      <head />
      <body>
        <Providers lang={lng}>{children}</Providers>
      </body>
    </html>
  );
}
