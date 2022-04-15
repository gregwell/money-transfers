import { ExchangeRate, Currency } from "./types";

export const comission = 0.05;

export const exchangeRates: ExchangeRate[] = [
  {
    pair: [Currency.PLN, Currency.EUR],
    rates: {
      buy: 4.64,
      sell: 4.61,
    },
  },
  {
    pair: [Currency.PLN, Currency.USD],
    rates: {
      buy: 4.33,
      sell: 4.27,
    },
  },
  {
    pair: [Currency.EUR, Currency.USD],
    rates: {
      buy: 1.08,
      sell: 1.05,
    },
  },
];