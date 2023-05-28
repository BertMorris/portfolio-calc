"use client";

import React from "react";
import dynamic from "next/dynamic";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false }
);

type ChartDataRecord = {
  x: string;
  y: number;
};

type ChartData = {
  id: string;
  data: ChartDataRecord[];
};

type Props = {
  data: ChartData[];
};

export default function StockChart({ data }: Props) {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 80 }}
      xFormat="time:%m/%d/%Y"
      xScale={{
        type: "time",
        format: "%m/%d/%Y",
        precision: "day",
        useUTC: false,
      }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisLeft={null}
      axisBottom={{
        format: "%b %d",
        // legend: "time scale",
        // legendOffset: -12,
        tickValues: "every 2 weeks",

        // tickValues: 5,
        // tickSize: 5,
        // tickPadding: 5,
        // tickRotation: 0,
        // legend: "Date",
        // legendOffset: 36,
        // legendPosition: "middle",
      }}
      axisRight={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Change Since Purchase (%)",
        legendOffset: 60,
        legendPosition: "middle",
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "top",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: -30,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
}
