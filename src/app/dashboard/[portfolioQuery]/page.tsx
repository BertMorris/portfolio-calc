import { colors } from "@mui/material";
import { timePickerToolbarClasses } from "@mui/x-date-pickers";
import React from "react";
import { StringLiteral } from "typescript";

type Props = {
  params: { portfolioQuery: any };
};

type Stock = {
  ticker: string;
  weight: number;
};

type QueryParams = {
  initialBalance: number;
  startDate: string;
  stocks: Stock[];
};

type StockDataRecord = {
  symbol: string;
  date: Date;
  adj_close: number;
};

type ChartDataRecord = {
  x: Date;
  y: number;
};

type ChartData = {
  id: string;
  data: ChartDataRecord[];
};

type TickerIndices = {
  [key: string]: number;
};

export default async function page({ params }: Props) {
  // get params from url
  const queryParams: QueryParams = JSON.parse(
    decodeURIComponent(params.portfolioQuery)
  );
  // load api access key
  const accessKey = process.env.MARKET_STACK_KEY;
  // get string of symbols
  const symbols = queryParams.stocks
    .map((item: Stock) => item.ticker)
    .join(",");
  // format date
  const dateFrom = queryParams.startDate.slice(0, 10);
  // fetch stock data from api
  const stockData = await fetchStockData(accessKey!, symbols, dateFrom);
  // TRANSFORMING DATA //
  // desired format
  // [
  //   {
  //     "id": ticker
  //     "color": line colors
  //     "data": [
  //       {
  //         "x": date,
  //         "y": value
  //       }
  //     ]
  //   }
  // ]
  // first create array of ticker objects
  let chartData: ChartData[] = queryParams.stocks.map((item: Stock) => ({
    id: item.ticker,
    data: [],
  }));
  console.log(chartData);
  // record ticker index to prevent having to find index each record
  const getChartDataIndices = () => {
    let indices: TickerIndices = {};
    chartData.forEach((stock: ChartData) => {
      indices[stock.id] = chartData.findIndex(
        (element: ChartData) => element.id === stock.id
      );
    });
    return indices;
  };
  const chartDataIndices = getChartDataIndices();
  console.log(chartDataIndices);
  // push date and adj close for each record to corresponding ticker in chartData
  stockData.forEach((record: StockDataRecord) => {
    chartData[chartDataIndices[record.symbol]].data.push({
      x: record.date,
      y: record.adj_close,
    });
  });

  return (
    <main>
      <h1>This page will contain the bashboard</h1>
      <h2>The dashboard will present the follwing:</h2>
      <ul>
        <li>Portfolio balance beginning with start date to current</li>
        <li>
          Allow users to compare their portfolio performance against the major
          indices and potentially other popular funds
        </li>
        <li>
          Maybe allow users to compare their portfolio against other rebalancing
          strategies ie yearly, quarterly
        </li>
      </ul>
      <h3>URL query: {JSON.stringify(queryParams)}</h3>
      <h3>Key: {accessKey}</h3>
      <h3>Symbols: {symbols}</h3>
      <h3>DateFrom: {dateFrom}</h3>
      <p>Data: {JSON.stringify(chartData)}</p>
    </main>
  );
}

async function fetchStockData(key: string, symbols: string, date: string) {
  const reqUrl = `http://api.marketstack.com/v1/eod?access_key=${key}&symbols=${symbols}&date_from=${date}&limit=500&sort=ASC`;

  try {
    const response = await fetch(reqUrl);

    if (!response.ok) {
      console.log(`error: ${JSON.stringify(response)}`);
      throw new Error("error fetching stock data");
    }

    const data = await response.json();
    // console.log(data);

    return data.data;
  } catch (error) {
    console.log(error);
  }
}
