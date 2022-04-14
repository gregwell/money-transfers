import { v4 as uuid } from "uuid";
import { errors } from "./constants";

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

export const getUserIndexById = (users: User[], id: string): number => {
  const index = users.findIndex((user) => user.id.localeCompare(id));
  return validateUserSearch(index) as number;
};

export const getUserById = (users: User[], id: string): User => {
  const user = users.find((user) => user.id.localeCompare(id));
  return validateUserSearch(user) as User;
};

export const validateUserSearch = (found: number | User | undefined) => {
  if (found === undefined || found === -1) {
    throw new Error(errors.userNotFound);
  }
  return found;
};
