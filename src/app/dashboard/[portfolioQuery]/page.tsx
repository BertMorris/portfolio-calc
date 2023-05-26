import { colors } from "@mui/material";
import { timePickerToolbarClasses } from "@mui/x-date-pickers";
import React from "react";
import { StringLiteral } from "typescript";
import Chart from "./Chart";

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
  x: string;
  y: number;
};

type ChartData = {
  id: string;
  data: ChartDataRecord[];
};

type TickerIndices = {
  [key: string]: number;
};

type InitialValues = {
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
  // save initial values
  const getInitialStockValues = () => {
    let values: InitialValues = {};
    // console.log(queryParams.stocks.length);
    // console.log(
    //   `sliced for init values: ${JSON.stringify(
    //     stockData.slice(0, queryParams.stocks.length)
    //   )}`
    // );
    stockData
      .slice(0, queryParams.stocks.length)
      .forEach((dataRecord: StockDataRecord) => {
        values[dataRecord.symbol] = dataRecord.adj_close;
      });
    return values;
  };
  const initialStockValues = getInitialStockValues();
  // console.log(`iniitalValues: ${JSON.stringify(initialStockValues)}`);
  // get initial investment values
  const getInitialInvestmentValues = () => {
    let values: InitialValues = {};
    queryParams.stocks.forEach((stock: Stock) => {
      values[stock.ticker] = Number(
        ((queryParams.initialBalance * stock.weight) / 100).toFixed(2)
      );
    });

    return values;
  };
  const initialInvestmentValues = getInitialInvestmentValues();
  console.log(JSON.stringify(initialInvestmentValues));
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
  let stockChartData: ChartData[] = queryParams.stocks.map((item: Stock) => ({
    id: item.ticker,
    data: [],
  }));
  // console.log(chartData);
  // record ticker index to prevent having to find index each record
  const getChartDataIndices = () => {
    let indices: TickerIndices = {};
    stockChartData.forEach((stock: ChartData) => {
      indices[stock.id] = stockChartData.findIndex(
        (element: ChartData) => element.id === stock.id
      );
    });
    return indices;
  };
  const chartDataIndices = getChartDataIndices();
  // console.log(chartDataIndices);
  // console.log(`stockData: ${JSON.stringify(stockData)}`);
  // push date and adj close for each record to corresponding ticker in chartData
  stockData.forEach((record: StockDataRecord) => {
    stockChartData[chartDataIndices[record.symbol]].data.push({
      x: new Date(record.date).toLocaleDateString(),
      y:
        Number(
          (record.adj_close / initialStockValues[record.symbol] - 1).toFixed(4)
        ) * 100,
    });
  });
  // get total portfolio data
  let portfolioChartData: ChartData[] = [
    {
      id: "Market Value",
      data: stockChartData[0].data.map((item) => ({
        x: item.x,
        y: Number(
          (
            (item.y / 100 + 1) *
            initialInvestmentValues[stockChartData[0].id]
          ).toFixed(2)
        ),
      })),
    },
  ];

  stockChartData.slice(1).forEach((stock: ChartData) => {
    for (let i = 0; i < stock.data.length; i++) {
      portfolioChartData[0].data[i].y += Number(
        (
          (stock.data[i].y / 100 + 1) *
          initialInvestmentValues[stock.id]
        ).toFixed(2)
      );
    }
  });

  return (
    <main>
      <h1>This page will contain the dashboard</h1>
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
      <p>Data: {JSON.stringify(stockChartData)}</p>
      <p>Test agg: {JSON.stringify(portfolioChartData)}</p>
      <div className="h-96">
        <Chart data={stockChartData} />
      </div>
      <div className="h-96">
        <Chart data={portfolioChartData} />
      </div>
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
