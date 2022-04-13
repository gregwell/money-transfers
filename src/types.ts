export enum Currency {
  PLN,
  EUR,
  USD,
}

export enum OperationType {
  DEPOSIT,
  WITHDRAW,
  SEND,
  EXCHANGE,
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

export interface System {
  users: User[];
  profits: Profits;
  exchangeRates: ExchangeRate[];

  getUserIndexById(id: string): number;

  addUser(): string;

  deposit(deposit: MoneyOperation): void;
  withdraw(withdraw: MoneyOperation): void;
  send(transfer: Transfer): void;
  exchange(exchangeMoney: Exchange): void;
}
