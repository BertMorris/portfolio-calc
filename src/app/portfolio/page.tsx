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
    <>
      <h1>This page will be for porfolio details input</h1>
      <p>
        It will include inputs for start date, starting balance, stock choices
        and their weighting
      </p>
      <form>
        <FormControl sx={{ m: 1 }} variant="outlined">
          <InputLabel htmlFor="filled-adornment-amount">
            Starting Investment
          </InputLabel>
          <OutlinedInput
            id="filled-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            value={initialBalance}
            onChange={(e) => setInitialBalance(Number(e.target.value))}
            required
          />
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Investment Date"
            value={date}
            onChange={(newDate) => setDate(newDate)}
          />
        </LocalizationProvider>
        <List>
          {tickers.map((item: StockWeight, tickerIndex) => (
            <ListItem key={tickerIndex}>
              <TextField
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
      </form>
      {tickers.length < 5 ? (
        <Button
          variant="contained"
          onClick={() =>
            setTickers([...tickers, { ticker: null, weight: null }])
          }
        >
          Add Stock
        </Button>
      ) : (
        <p>Maximum input reached</p>
      )}
      <Link href={`/dashboard/${urlQuery}`}>View Dashboard</Link>
    </>
  );
}
