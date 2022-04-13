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

export type Profits<T> = {
  [K in OperationType]: T;
};

export interface User {
  id: string;
  accounts: Accounts;
}

export interface BasicOperation {
  currency: Currency;
  userId: string;
}

export interface MoneyOperation extends BasicOperation {
  amount: number;
}

export interface Transfer extends MoneyOperation {
  recipentId: string;
}

export interface Exchange extends MoneyOperation {
  targetCurrency: Currency;
}

export interface HistoryObj extends MoneyOperation {
  operation: OperationType;
  date: number;
}

export interface System {
  users: User[];
  profits: Profits<Accounts>;
  history: HistoryObj[];
  exchangeRates: ExchangeRate[];

  getUserIndexById(id: string): number;
  getUserById(id: string): User;
  validateUserSearch(found: number | User | undefined): number | User;

  addUser(): string;

  deposit(props: MoneyOperation): void;
  withdraw(props: MoneyOperation): void;
  send(props: Transfer): void;
  exchange(props: Exchange): void;

  getProfits(): Profits<Accounts>;
  getHistory(): HistoryObj[];

  getHistoryByOperationType(operationType: OperationType): HistoryObj[];
  getHistoryByCurrency(currency: Currency): HistoryObj[];
  getHistoryByDateRange(start: number, end: number): HistoryObj[];

  getAccountHistory(props: BasicOperation): HistoryObj[];
  getAccountBalance(props: BasicOperation): number;

  getProfitsByOperationType(operationType: OperationType): Accounts;
  getProfitsByCurrency(currency: Currency): Profits<number>;
}
