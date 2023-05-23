"use client";

import { CssBaseline } from "@mui/material";
import "./globals.css";

// export const metadata = {
//   title: "Portfolio Tracker",
//   description: "Monitor the performance of your stock portfolio",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body id="__next">
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}
