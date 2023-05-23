"use client";

import {
  FilledInput,
  FormControl,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useState } from "react";

type Props = {};

export default function page({}: Props) {
  const [date, setDate] = useState<null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [tickers, setTickers] = useState<string[] | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <h1>This page will be for porfolio details input</h1>
      <p>
        It will include inputs for start date, starting balance, stock choices
        and their weighting
      </p>
      <form>
        <FormControl fullWidth sx={{ m: 1 }} variant="outlines">
          <InputLabel htmlFor="filled-adornment-amount">
            Starting Investment
          </InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </FormControl>
        <DatePicker
          label="Investment Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div>
          <TextField id="ticker" label="Ticker" variant="outlined" />
          <TextField
            type="number"
            id="weight"
            label="Weighting"
            variant="outlined"
            // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </div>
        <div>
          <TextField id="ticker" label="Ticker" variant="outlined" />
          <TextField
            type="number"
            id="weight"
            label="Weighting"
            variant="outlined"
            // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </div>
        <div>
          <TextField id="ticker" label="Ticker" variant="outlined" />
          <TextField
            type="number"
            id="weight"
            label="Weighting"
            variant="outlined"
            // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </div>
        <div>
          <TextField id="ticker" label="Ticker" variant="outlined" />
          <TextField
            type="number"
            id="weight"
            label="Weighting"
            variant="outlined"
            // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </div>
        <div>
          <TextField id="ticker" label="Ticker" variant="outlined" />
          <TextField
            type="number"
            id="weight"
            label="Weighting"
            variant="outlined"
            // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </div>
      </form>
    </LocalizationProvider>
  );
}
