import {
  Accounts,
  BasicOperation,
  Currency,
  Exchange,
  ExchangeRate,
  HistoryObj,
  MoneyOperation,
  OperationType,
  Profits,
  Transfer,
  User,
} from "./types";

export interface System {
  users: User[];
  profits: Profits<Accounts>;
  history: HistoryObj[];
  exchangeRates: ExchangeRate[];

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
