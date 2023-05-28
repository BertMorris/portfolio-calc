import React from "react";
import ChartTabs from "./ChartTabs";
import PieChart from "./PieChart";
import BarChart from "./BarChart";

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
    .map((item: Stock) => item.ticker.split(" ")[0])
    .join(",");
  // format date
  const dateFrom = queryParams.startDate.slice(0, 10);
  // fetch stock data from api
  const stockData = await fetchStockData(accessKey!, symbols, dateFrom);
  // save initial values
  const getInitialStockValues = async () => {
    let values: InitialValues = {};
    // console.log(queryParams.stocks.length);
    // console.log(
    //   `sliced for init values: ${JSON.stringify(
    //     stockData.slice(0, queryParams.stocks.length)
    //   )}`
    // );
    await stockData
      .slice(0, queryParams.stocks.length)
      .forEach((dataRecord: StockDataRecord) => {
        values[dataRecord.symbol] = dataRecord.adj_close;
      });
    return values;
  };
  const initialStockValues = await getInitialStockValues();
  // console.log(`iniitalValues: ${JSON.stringify(initialStockValues)}`);
  // get initial investment values
  const getInitialInvestmentValues = () => {
    let values: InitialValues = {};
    queryParams.stocks.forEach((stock: Stock) => {
      values[stock.ticker.split(" ")[0]] = Number(
        ((queryParams.initialBalance * stock.weight) / 100).toFixed(2)
      );
    });

    return values;
  };
  const initialInvestmentValues = getInitialInvestmentValues();
  // console.log(JSON.stringify(initialInvestmentValues));
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
    id: item.ticker.split(" ")[0],
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
  await stockData.forEach((record: StockDataRecord) => {
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

  await stockChartData.slice(1).forEach((stock: ChartData) => {
    for (let i = 0; i < stock.data.length; i++) {
      portfolioChartData[0].data[i].y += Number(
        (
          (stock.data[i].y / 100 + 1) *
          initialInvestmentValues[stock.id]
        ).toFixed(2)
      );
    }
  });

  const totalReturn = Number(
    (
      portfolioChartData[0].data.slice(-1)[0].y -
      portfolioChartData[0].data[0].y
    ).toFixed(2)
  );

  const totalReturnPercent = Number(
    ((totalReturn / queryParams.initialBalance) * 100).toFixed(2)
  );

  const stocksReturn = stockChartData.map((stock: ChartData) => ({
    id: stock.id,
    value: Number((stock.data.slice(-1)[0].y - stock.data[0].y).toFixed(2)),
  }));

  return (
    <main className="w-[1200px] bg-white">
      <div className="h-56 flex justify-evenly items-center">
        <PieChart data={queryParams.stocks} />
        <BarChart
          stocksReturn={stocksReturn}
          totalReturn={totalReturnPercent}
        />
      </div>

      <ChartTabs
        portfolioChartData={portfolioChartData}
        stockChartData={stockChartData}
      />
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
