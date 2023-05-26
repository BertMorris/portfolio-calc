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
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-slate-100">
          <div className="max-w-[1200px] border-radius-xl">
            <header className="bg-orange-400 border-radius-xl">
              <h1 className="text-white p-8 m-0">Stock Portfolio Analyzer</h1>
            </header>
            <div>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
