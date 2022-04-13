import { v4 as uuid } from "uuid";

import { Currency, Accounts, OperationType, Profits, User } from "./types";

export const getEmptyCurrencyAccounts = (): Accounts => {
  let accounts = {} as Accounts;

  Object.values(Currency).forEach(
    (currency) => (accounts = { ...accounts, [currency]: 0 })
  );

  return accounts;
};

export const getNewUser = (): User => {
  return {
    id: uuid(),
    accounts: getEmptyCurrencyAccounts(),
  };
};

export function getProfits<T>(
  systemProfits?: Profits<Accounts>,
  currency?: Currency
): Profits<T> {
  let profits = {} as Profits<T>;

  Object.values(OperationType).forEach((operationType) => {
    const val =
      systemProfits && currency
        ? systemProfits[operationType][currency]
        : getEmptyCurrencyAccounts();

    return (profits = {
      ...profits,
      [operationType]: val,
    });
  });

  return profits;
}
