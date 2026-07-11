import { IBM_Plex_Mono, Manrope } from "next/font/google";
import type { Metadata } from "next";
import { DemoReturnLink } from "@/demo-kit/layout/DemoReturnLink";
import tokens from "@/components/plomberie/tokens.module.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-pl-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-pl-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Plomberie Pro | AzurSysTech Showcase",
  description:
    "Plombiers certifiés en Île-de-France : dépannage urgent, réparation, installation, rénovation, chauffage et maintenance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`demo-shell ${tokens.route} ${manrope.variable} ${ibmPlexMono.variable}`}
      data-demo="plomberie"
    >
      {children}
      <DemoReturnLink />
    </div>
  );
}
