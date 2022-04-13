import { v4 as uuid } from "uuid";

import {
  ExchangeRate,
  Currency,
  User,
  Accounts,
  OperationType,
  Profits,
} from "./types";

export const initialCurrencyAccounts: Accounts = {
  [Currency.PLN]: 0,
  [Currency.EUR]: 0,
  [Currency.USD]: 0,
};

export const initialProfits: Profits = {
  [OperationType.DEPOSIT]: initialCurrencyAccounts,
  [OperationType.EXCHANGE]: initialCurrencyAccounts,
  [OperationType.SEND]: initialCurrencyAccounts,
  [OperationType.WITHDRAW]: initialCurrencyAccounts,
};

export const comission: number = 0.05;

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

export const getNewUser = (): User => {
  return {
    id: uuid(),
    accounts: initialCurrencyAccounts,
  };
};
