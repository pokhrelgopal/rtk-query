import { Providers } from "@/components/providers";
import "./globals.css";
import { Jost } from "next/font/google";
const jost = Jost({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jost.className}  antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
