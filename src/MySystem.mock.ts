import {
  Accounts,
  BasicOperation,
  Currency,
  HistoryObj,
  MoneyOperation,
  OperationType,
  Profits,
} from "./types";
import { UUID, UUID2 } from "./utils.mock";

export const HISTORY_OBJ_1: HistoryObj = {
  currency: Currency.EUR,
  userId: UUID,
  amount: 12,
  operation: OperationType.DEPOSIT,
  date: 1649985222989,
  comission: 0.05,
};

export const HISTORY_OBJ_2: HistoryObj = {
  currency: Currency.PLN,
  userId: UUID,
  amount: 12,
  operation: OperationType.DEPOSIT,
  date: 1649985222983,
  comission: 0.05,
};

export const HISTORY_OBJ_3: HistoryObj = {
  currency: Currency.PLN,
  userId: "abc",
  amount: 12,
  operation: OperationType.EXCHANGE,
  date: 1649985222981,
  comission: 0.05,
};

export const HISTORY_OBJECTS: HistoryObj[] = [
  HISTORY_OBJ_1,
  HISTORY_OBJ_2,
  HISTORY_OBJ_3,
];

export const HISTORY_OBJECTS_DEPOSIT: HistoryObj[] = [
  HISTORY_OBJ_1,
  HISTORY_OBJ_2,
];

export const HISTORY_OBJECTS_EUR: HistoryObj[] = [HISTORY_OBJ_1];

export const HISTORY_OBJECTS_DATE_RANGE: HistoryObj[] = [HISTORY_OBJ_2];

export const DEPOSIT_PROPS = {
  userId: UUID,
  currency: Currency.PLN,
  amount: 3000,
};

export const BUY_PROPS = {
  userId: UUID,
  currency: Currency.PLN,
  targetCurrency: Currency.EUR,
  amount: 2000,
};

export const SELL_PROPS = {
  userId: UUID,
  currency: Currency.EUR,
  targetCurrency: Currency.PLN,
  amount: 100,
};

export const TRANSFER_PROPS = {
  userId: UUID,
  recipentId: UUID2,
  amount: 5,
  currency: Currency.PLN,
};

export const RATES_PLN_EUR = {
  pair: [Currency.PLN, Currency.EUR],
  rates: {
    buy: 4.64,
    sell: 4.61,
  },
};

export const COMISSION = 0.05;

export const MONEY_OPERATION_PROPS: MoneyOperation = {
  userId: UUID,
  currency: Currency.PLN,
  amount: 10,
};

export const MONEY_OPERATION_NO_EXIST_ID_PROPS: MoneyOperation = {
  userId: "123",
  currency: Currency.PLN,
  amount: 10,
};

export const BASIC_OPERATION_PROPS: BasicOperation = {
  userId: UUID,
  currency: Currency.EUR,
};

export const PROFITS: Profits<Accounts> = {
  DEPOSIT: { PLN: 150, EUR: 0, USD: 0 },
  WITHDRAW: { PLN: 0.5, EUR: 0, USD: 0 },
  SEND: { PLN: 0.25, EUR: 0, USD: 0 },
  EXCHANGE: { PLN: 100, EUR: 5, USD: 0 },
};

export const HISTORY: HistoryObj[] = [
  {
    userId: UUID,
    currency: Currency.PLN,
    amount: 2850,
    operation: OperationType.DEPOSIT,
    date: 1649030400000,
    comission: 150,
  },
  {
    userId: UUID,
    currency: Currency.PLN,
    amount: 2000,
    operation: OperationType.EXCHANGE,
    date: 1649030400000,
    comission: 100,
  },
  {
    userId: UUID,
    currency: Currency.EUR,
    amount: 100,
    operation: OperationType.EXCHANGE,
    date: 1649030400000,
    comission: 5,
  },
  {
    userId: UUID,
    currency: Currency.PLN,
    amount: 10,
    operation: OperationType.WITHDRAW,
    date: 1649030400000,
    comission: 0.5
  },
  {
    userId: UUID,
    currency: Currency.PLN,
    amount: 5,
    operation: OperationType.SEND,
    date: 1649030400000,
    comission: 0.25
  }
];
