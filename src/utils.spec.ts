import { errors } from "./constants";
import { Accounts, Currency } from "./types";
import {
  getEmptyCurrencyAccounts,
  getNewUser,
  getProfits,
  getUserById,
  getUserIndexById,
  validateUserSearch,
} from "./utils";
import {
  EMPTY_CURRENCY_ACCOUNTS,
  EMPTY_PROFITS,
  EXISTING_USERS,
  NEW_USER,
  PROFITS_ONE_CURRENCY,
  UUID,
  UUID3,
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

it("get user index by id", () => {
  expect(
    getUserIndexById(EXISTING_USERS, UUID3)
  ).toStrictEqual(2);
});

it("get user by id", () => {
  expect(
    getUserById(EXISTING_USERS, UUID3)
  ).toStrictEqual(EXISTING_USERS[2]);
});

it("validate user search", () => {
  expect(() => validateUserSearch(undefined)).toThrow(errors.userNotFound);
  expect(() => validateUserSearch(-1)).toThrowError(errors.userNotFound);

  expect(validateUserSearch(2)).toStrictEqual(2);
  expect(validateUserSearch(EXISTING_USERS[0])).toStrictEqual(
    EXISTING_USERS[0]
  );
});
