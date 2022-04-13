export enum Currency {
  PLN = "PLN",
  EUR = "EUR",
  USD = "USD",
}

export enum OperationType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND",
  EXCHANGE = "EXCHANGE",
}

export interface ExchangeRate {
  pair: [Currency, Currency];
  rates: {
    buy: number;
    sell: number;
  };
}

export type Accounts = {
  [K in Currency]: number;
};

export type Profits = {
  [K in OperationType]: Accounts;
};

export interface User {
  id: string;
  accounts: Accounts;
}

export interface MoneyOperation {
  amount: number;
  currency: Currency;
  userId: string;
}

export interface Transfer extends MoneyOperation {
  recipentId: string;
}

export interface Exchange extends MoneyOperation {
  targetCurrency: Currency;
}

interface HistoryObj extends MoneyOperation {
  operation: OperationType;
}

export type Users = User[];
export type History = HistoryObj[];
export type ExchangeRates = ExchangeRate[];

export interface System {
  users: Users;
  profits: Profits;
  history: History;
  exchangeRates: ExchangeRates;

  getUserIndexById(id: string): number;

  addUser(): string;

  deposit(deposit: MoneyOperation): void;
  withdraw(withdraw: MoneyOperation): void;
  send(transfer: Transfer): void;
  exchange(exchangeMoney: Exchange): void;

  getProfits(): Profits;
}
