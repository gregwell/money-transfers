import { Currency, HistoryObj, OperationType } from "./types";

export const HISTORY_OBJ_1: HistoryObj = {
  currency: Currency.EUR,
  userId: "adfd01fb-309b-4e1c-9117-44d003f5d7fc",
  amount: 12,
  operation: OperationType.DEPOSIT,
  date: 1649985222989,
  comission: 0.05,
};

export const HISTORY_OBJ_2: HistoryObj = {
  currency: Currency.PLN,
  userId: "adfd01fb-309b-4e1c-9117-44d003f5d7fc",
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
