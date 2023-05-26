"use client";

import React from "react";
import dynamic from "next/dynamic";

const ResponsivePie = dynamic(
  () => import("@nivo/pie").then((m) => m.ResponsivePie),
  { ssr: false }
);

type Stock = {
  ticker: string;
  weight: number;
};

type Props = {
  data: Stock[];
};

export default function PieChart({ data }: Props) {
  const portfolioWeights = data.map((item: Stock) => ({
    id: item.ticker,
    value: item.weight,
  }));
  return (
    <div className="h-48 w-1/3">
      <h4>Breakdown</h4>
      <ResponsivePie
        data={portfolioWeights}
        margin={{ top: 10, right: 0, bottom: 10, left: 0 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        // defs={[
        //   {
        //     id: "dots",
        //     type: "patternDots",
        //     background: "inherit",
        //     color: "rgba(255, 255, 255, 0.3)",
        //     size: 4,
        //     padding: 1,
        //     stagger: true,
        //   },
        //   {
        //     id: "lines",
        //     type: "patternLines",
        //     background: "inherit",
        //     color: "rgba(255, 255, 255, 0.3)",
        //     rotation: -45,
        //     lineWidth: 6,
        //     spacing: 10,
        //   },
        // ]}
        // fill={[
        //   {
        //     match: {
        //       id: "ruby",
        //     },
        //     id: "dots",
        //   },
        //   {
        //     match: {
        //       id: "c",
        //     },
        //     id: "dots",
        //   },
        //   {
        //     match: {
        //       id: "go",
        //     },
        //     id: "dots",
        //   },
        //   {
        //     match: {
        //       id: "python",
        //     },
        //     id: "dots",
        //   },
        //   {
        //     match: {
        //       id: "scala",
        //     },
        //     id: "lines",
        //   },
        //   {
        //     match: {
        //       id: "lisp",
        //     },
        //     id: "lines",
        //   },
        //   {
        //     match: {
        //       id: "elixir",
        //     },
        //     id: "lines",
        //   },
        //   {
        //     match: {
        //       id: "javascript",
        //     },
        //     id: "lines",
        //   },
        // ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}
