import { Accounts, Currency, OperationType, Profits, User } from "./types";

export const UUID = "adfd01fb-309b-4e1c-9117-44d003f5d7fc";

export const EMPTY_CURRENCY_ACCOUNTS: Accounts = {
  [Currency.PLN]: 0,
  [Currency.EUR]: 0,
  [Currency.USD]: 0,
};

export const NEW_USER: User = {
  id: UUID,
  accounts: EMPTY_CURRENCY_ACCOUNTS,
};

export const EMPTY_PROFITS: Profits<Accounts> = {
  [OperationType.DEPOSIT]: {...EMPTY_CURRENCY_ACCOUNTS},
  [OperationType.WITHDRAW]: {...EMPTY_CURRENCY_ACCOUNTS},
  [OperationType.SEND]: {...EMPTY_CURRENCY_ACCOUNTS},
  [OperationType.EXCHANGE]: {...EMPTY_CURRENCY_ACCOUNTS},
};

export const PROFITS_ONE_CURRENCY: Profits<number> = {
  [OperationType.DEPOSIT]: 0,
  [OperationType.WITHDRAW]: 0,
  [OperationType.SEND]: 0,
  [OperationType.EXCHANGE]: 0,
};

export const EXISTING_USERS: User[] = [
  {
    id: "adfd01fb-309b-4e1c-9117-44d003f5d7fc",
    accounts: { ...EMPTY_CURRENCY_ACCOUNTS },
  },
  {
    id: "bdfd01fb-309b-4e1c-9117-44d003f5d7fc",
    accounts: { ...EMPTY_CURRENCY_ACCOUNTS },
  },
  {
    id: "cdfd01fb-309b-4e1c-9117-44d003f5d7fc",
    accounts: { ...EMPTY_CURRENCY_ACCOUNTS },
  },
];
