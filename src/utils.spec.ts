import { Accounts, Currency } from "./types";
import { getEmptyCurrencyAccounts, getNewUser, getProfits } from "./utils";
import {
  EMPTY_CURRENCY_ACCOUNTS,
  EMPTY_PROFITS,
  NEW_USER,
  PROFITS_ONE_CURRENCY,
  UUID,
} from "./utils.mock";

jest.mock("uuid", () => ({ v4: () => UUID }));

it("get empty currency accounts", () => {
  expect(getEmptyCurrencyAccounts()).toStrictEqual(EMPTY_CURRENCY_ACCOUNTS);
});

it("get new user", () => {
  expect(getNewUser()).toStrictEqual(NEW_USER);
});

it("get empty profits ", () => {
  expect(getProfits<Accounts>()).toStrictEqual(EMPTY_PROFITS);
});

it("get profits of one currency", () => {
  expect(getProfits<number>(EMPTY_PROFITS, Currency.PLN)).toStrictEqual(
    PROFITS_ONE_CURRENCY
  );
});
