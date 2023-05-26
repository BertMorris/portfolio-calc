"use client";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import Chart from "./Chart";

type ChartDataRecord = {
  x: string;
  y: number;
};

type ChartData = {
  id: string;
  data: ChartDataRecord[];
};

type Props = {
  portfolioChartData: ChartData[];
  stockChartData: ChartData[];
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ChartTabs({
  portfolioChartData,
  stockChartData,
}: Props) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="mt-20">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="Chart tabs">
          <Tab label="Portfolio" />
          <Tab label="Stocks" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div className="h-96">
          <Chart data={portfolioChartData} />
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="h-96">
          <Chart data={stockChartData} />
        </div>
      </TabPanel>
    </div>
  );
}
