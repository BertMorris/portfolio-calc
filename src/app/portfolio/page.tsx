"use client";

import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Link from "next/link";
import React, { useMemo, useState } from "react";

type Props = {};

type Ticker = string | null;
type Weight = number | null;

type StockWeight = {
  ticker: Ticker;
  weight: Weight;
};

export default function Page({}: Props) {
  const [date, setDate] = useState<Date | null>(null);
  const [initialBalance, setInitialBalance] = useState<number | null>(null);
  const [tickers, setTickers] = useState<StockWeight[]>([
    { ticker: "", weight: null },
  ]);

  // check if ticker input is valid
  function tickerIsValid(ticker: Ticker) {
    if (ticker && ticker.length < 1) {
      return false;
    } else return true;
  }

  // check is weighting input is valid
  function weightIsValid(weight: Weight) {
    if (weight && weight > 100) {
      return false;
    } else return true;
  }

  // url param string
  const urlQuery = useMemo(() => {
    const query = {
      startDate: date,
      initialBalance: initialBalance,
      stocks: tickers,
    };

    return encodeURIComponent(JSON.stringify(query));
  }, [date, initialBalance, tickers]);

  return (
    <div className="max-w-lg p-8 border-2 border-black border-solid flex flex-col gap-4">
      <Typography className="" variant="h4">
        Portfolio Builder
      </Typography>
      <form className="flex flex-col gap-8 items-center w-full">
        <div className="flex gap-4 items-center">
          <TextField
            label="Initial Investment"
            id="initialInvestment"
            sx={{ m: 1, width: "25ch" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            value={initialBalance}
            onChange={(e) => setInitialBalance(Number(e.target.value))}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="w-48"
              label="Investment Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
            />
          </LocalizationProvider>
        </div>

        <List className="w-full">
          <Typography variant="h4">Stocks</Typography>
          {tickers.map((item: StockWeight, tickerIndex) => (
            <ListItem className="flex gap-4" key={tickerIndex}>
              <TextField
                className="w-48"
                id="ticker"
                label="Ticker"
                variant="outlined"
                error={!tickerIsValid(item.ticker)}
                helperText="Invalid ticker"
                value={item.ticker}
                onChange={(e) =>
                  setTickers(
                    tickers.map((item: StockWeight, index) =>
                      index === tickerIndex
                        ? { ...item, ticker: e.target.value }
                        : item
                    )
                  )
                }
                required
              />
              <TextField
                className="w-40"
                type="number"
                id="weight"
                label="Weighting"
                variant="outlined"
                error={!weightIsValid(item.weight)}
                helperText={
                  !weightIsValid(item.weight) ? "Max weighting is 100%" : " "
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                value={item.weight}
                onChange={(e) =>
                  setTickers(
                    tickers.map((item: StockWeight, index) =>
                      index === tickerIndex
                        ? { ...item, weight: Number(e.target.value) }
                        : item
                    )
                  )
                }
                required
              />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          onClick={() =>
            setTickers([...tickers, { ticker: null, weight: null }])
          }
        >
          Add Stock
        </Button>
      </form>
      <Link href={`/dashboard/${urlQuery}`}>View Dashboard</Link>
    </div>
  );
}
