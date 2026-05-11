import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AzurSysTech Admin",
  description: "Owner admin console for AzurSysTech operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <div className="admin-shell">{children}</div>
      </body>
    </html>
  );
}
