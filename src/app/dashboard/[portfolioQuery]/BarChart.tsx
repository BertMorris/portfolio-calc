"use client";

import React from "react";
import dynamic from "next/dynamic";

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

type Return = {};

type Props = {
  stocksReturn: {
    id: string;
    value: number;
  }[];
  totalReturn: number;
};

export default function BarChart({ stocksReturn, totalReturn }: Props) {
  const data = [...stocksReturn, { id: "Total", value: totalReturn }];
  return (
    <div className="h-64  w-1/3">
      <h4>Returns</h4>
      <ResponsiveBar
        data={data}
        // keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
        layout="horizontal"
        indexBy="id"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        // defs={[
        //   {
        //     id: "dots",
        //     type: "patternDots",
        //     background: "inherit",
        //     color: "#38bcb2",
        //     size: 4,
        //     padding: 1,
        //     stagger: true,
        //   },
        //   {
        //     id: "lines",
        //     type: "patternLines",
        //     background: "inherit",
        //     color: "#eed312",
        //     rotation: -45,
        //     lineWidth: 6,
        //     spacing: 10,
        //   },
        // ]}
        // fill={[
        //   {
        //     match: {
        //       id: "fries",
        //     },
        //     id: "dots",
        //   },
        //   {
        //     match: {
        //       id: "sandwich",
        //     },
        //     id: "lines",
        //   },
        // ]}
        // borderColor={{
        //   from: "color",
        //   modifiers: [["darker", 1.6]],
        // }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          //   legend: "country",
          //   legendPosition: "middle",
          //   legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Percent Return",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[
          {
            dataFrom: "indexes",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        // role="application"
        // ariaLabel="Returns Summary"
        // barAriaLabel={(e) =>
        //   e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        // }
      />
    </div>
  );
}
