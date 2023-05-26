import { Typography } from "@mui/material";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-slate-100">
      <div className="max-w-screen-lg border-radius-xl">
        <header className="bg-orange-400 border-radius-xl">
          <h1 className="text-white p-8 m-0">Stock Portfolio Analyzer</h1>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}
