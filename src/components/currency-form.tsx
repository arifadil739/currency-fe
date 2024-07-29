import { getConvertedValue, getCurrency } from "@/pages/api/currency";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type CurrencyProps = {};

interface ICurrency {
  code: string;
  decimal_digits: number;
  name: string;
  name_plural: string;
  rounding: number;
  symbol: string;
  symbol_native: string;
  type: string;
}

const CurrencyForm: React.FC<CurrencyProps> = () => {
  const [currencyData, setCurrencyData] = useState<ICurrency[]>([]);
  const [fromCurrencyValue, setFromCurrencyValue] = useState<string>("");
  const [toCurrencyValue, setToCurrencyValue] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  const [convertedValue, setConvertedValue] = useState<number>();

  const [fromCurrencyError, setFromCurrencyError] = useState<boolean>(false);
  const [toCurrencyError, setToCurrencyError] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<boolean>(false);

  const [loadingState, setLoadingState] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        const data = await getCurrency();
        const currencyArray: ICurrency[] = Object.entries(data).map(
          ([key, value]) => {
            return { ...(value as ICurrency) };
          }
        );
        setCurrencyData(currencyArray);
      } catch (error) {
        console.log(error)
      }
    };

    fetchCurrencyData();
  }, []);

  const convertCurrency = useCallback(() => {
    setFromCurrencyError(false);
    setToCurrencyError(false);
    setAmountError(false);
    let hasError = false;

    if (!fromCurrencyValue) {
      setFromCurrencyError(true);
      hasError = true;
    }
    if (!toCurrencyValue) {
      setToCurrencyError(true);
      hasError = true;
    }
    if (amount === null || amount <= 0) {
      setAmountError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoadingState(true);
    getConvertedValue(fromCurrencyValue, toCurrencyValue, amount)
      .then((res) => {
        console.log(res.amount);
        setConvertedValue(res.amount);
        setLoadingState(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingState(false); 
      });
  }, [fromCurrencyValue, toCurrencyValue, amount]);

  const currencyOptions = useMemo(() => {
    return (
      currencyData.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.symbol} - {currency.name}
        </option>
      ))
    );
  }, [currencyData]);

  return (
    <>
      <h2>Currency Converter</h2>
      <div className="flex flex-column w-100">
        <label htmlFor="from" className="form-label">
          Convert From
        </label>
        <select
          onChange={(e) => setFromCurrencyValue(e.target.value)}
          value={fromCurrencyValue}
          className={`form-select ${fromCurrencyError ? "is-invalid" : ""}`}
          id="from"
        >
          <option key="from" value="">
            Select Currency
          </option>
          {currencyOptions}
        </select>
      </div>

      <div className="flex flex-column w-100">
        <label htmlFor="to" className="form-label">
          Convert To
        </label>
        <select
          onChange={(e) => setToCurrencyValue(e.target.value)}
          value={toCurrencyValue}
          id="to"
          className={`form-select ${toCurrencyError ? "is-invalid" : ""}`}
        >
          <option key="to" value="">
            Select Currency
          </option>
          {currencyOptions}
        </select>
      </div>

      <div className="flex flex-column w-100">
        <label htmlFor="inputCurrency" className="form-label">
          Amount
        </label>
        <input
          onChange={(e) => setAmount(Number(e.target.value))}
          type="number"
          className={`form-control ${amountError ? "is-invalid" : ""}`}
          id="inputCurrency"
          placeholder="Enter a value"
        />
      </div>
      {!loadingState ? (
        <button onClick={convertCurrency} type="button" className="btn btn-primary">
          Convert
        </button>
      ) : (
        <button className="btn btn-primary" type="button" disabled>
          <span role="status">Converting...</span>
          <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
        </button>
      )}

      {fromCurrencyValue && toCurrencyValue && convertedValue !== undefined && (
        <h6>
          Converted amount in {toCurrencyValue}: {convertedValue.toFixed(2)}
        </h6>
      )}
    </>
  );
};

export default CurrencyForm;
