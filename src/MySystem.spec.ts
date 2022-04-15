import { MySystem } from "./MySystem";
import { System } from "./System";
import { errors } from "./constants";
import { Currency, OperationType } from "./types";
import {
  BUY_PROPS,
  COMISSION,
  DEPOSIT_PROPS,
  HISTORY_OBJECTS,
  HISTORY_OBJECTS_DATE_RANGE,
  HISTORY_OBJECTS_DEPOSIT,
  HISTORY_OBJECTS_EUR,
  RATES_PLN_EUR,
  SELL_PROPS,
  MONEY_OPERATION_PROPS,
  BASIC_OPERATION_PROPS,
  PROFITS,
  TRANSFER_PROPS,
  MONEY_OPERATION_NO_EXIST_ID_PROPS,
  HISTORY,
} from "./MySystem.mock";
import {
  EMPTY_CURRENCY_ACCOUNTS,
  EXISTING_USERS,
  PROFITS_ONE_CURRENCY,
  UUID,
} from "./utils.mock";

let system: System;

jest.mock("uuid", () => ({ v4: () => UUID }));
jest.useFakeTimers("modern").setSystemTime(new Date("2022-04-04"));

describe("my system", () => {
  beforeEach(() => {
    system = new MySystem();
  });

  it("newUser: adds user", () => {
    expect(system.users.length === 0);
    system.addUser();
    expect(system.users.length === 1);
  });

  it("newUser: returns user id", () => {
    const system = new MySystem();
    const userId = system.addUser();
    expect(userId).toStrictEqual(UUID);
  });

  it("deposit: throws an error when id provided not found", () => {
    expect(() => system.deposit(MONEY_OPERATION_NO_EXIST_ID_PROPS)).toThrow(
      errors.userNotFound
    );
  });

  it("deposit: changes account balance", () => {
    system.addUser();

    const expected = 10 - COMISSION * MONEY_OPERATION_PROPS.amount;

    expect(system.users[0].accounts.PLN).toStrictEqual(0);

    system.deposit(MONEY_OPERATION_PROPS);
    expect(system.users[0].accounts.PLN).toStrictEqual(expected);

    system.deposit(MONEY_OPERATION_PROPS);
    expect(system.users[0].accounts.PLN).toStrictEqual(2 * expected);
  });

  it("withdraw: throws an error when id provided not found", () => {
    expect(() => system.withdraw(MONEY_OPERATION_NO_EXIST_ID_PROPS)).toThrow(
      errors.userNotFound
    );
  });

  it("withdraw: throws an error when insufficient funds", () => {
    system.addUser();

    expect(() => system.withdraw(MONEY_OPERATION_PROPS)).toThrow(
      errors.insufficientFunds
    );
  });

  it("withdraw: changes account balance", () => {
    system.addUser();

    const systemProfit = COMISSION * MONEY_OPERATION_PROPS.amount;

    const depositAmount = 10 - systemProfit;
    const withdrawalAmount = 10 + systemProfit;

    const expected = 2 * depositAmount - withdrawalAmount;

    system.deposit(MONEY_OPERATION_PROPS);
    system.deposit(MONEY_OPERATION_PROPS);

    system.withdraw(MONEY_OPERATION_PROPS);

    expect(system.users[0].accounts.PLN).toStrictEqual(expected);
  });

  it("send: throws an error when any id provided not found", () => {
    system.users = EXISTING_USERS;

    const senderNotFound = {
      userId: "123",
      recipentId: UUID,
      currency: Currency.PLN,
      amount: 1,
    };

    const recipentNotFound = {
      userId: UUID,
      recipentId: "321",
      currency: Currency.PLN,
      amount: 1,
    };

    expect(() => system.send(senderNotFound)).toThrow(errors.userNotFound);
    expect(() => system.send(recipentNotFound)).toThrow(errors.userNotFound);
  });

  it("send: throws an error when the sender has insufficient funds", () => {
    system.users = EXISTING_USERS;

    expect(() => {
      system.send(TRANSFER_PROPS);
    }).toThrow(errors.insufficientFunds);
  });

  it("send: changes accounts balance", () => {
    system.users = EXISTING_USERS;

    const transferProfit = COMISSION * TRANSFER_PROPS.amount;
    const depositProfit = COMISSION * DEPOSIT_PROPS.amount;

    const depositNet = DEPOSIT_PROPS.amount - depositProfit;

    const senderAfter = depositNet - TRANSFER_PROPS.amount - transferProfit;
    const recipentAfter = TRANSFER_PROPS.amount;

    system.deposit(DEPOSIT_PROPS);
    system.send(TRANSFER_PROPS);

    expect(system.users[0].accounts.PLN).toStrictEqual(senderAfter);
    expect(system.users[1].accounts.PLN).toStrictEqual(recipentAfter);
  });

  it("exchange: throws an error when id provided not found", () => {
    const exchangeProps = {
      userId: "123",
      currency: Currency.PLN,
      targetCurrency: Currency.EUR,
      amount: 10,
    };
    expect(() => system.exchange(exchangeProps)).toThrow(errors.userNotFound);
  });

  it("exchange: throws an error when insufficient funds", () => {
    system.addUser();

    expect(() => system.exchange(BUY_PROPS)).toThrow(errors.insufficientFunds);
  });

  it("exchange: change accounts balance", () => {
    system.addUser();

    const [depositProfit, buyProfit, sellProfit] = [
      DEPOSIT_PROPS,
      BUY_PROPS,
      SELL_PROPS,
    ].map((props) => props.amount * COMISSION);

    const plnAfterDeposit = DEPOSIT_PROPS.amount - depositProfit;

    const plnAfterBuy = plnAfterDeposit - BUY_PROPS.amount - buyProfit;
    const eurAfterBuy =
      (BUY_PROPS.amount - buyProfit) / RATES_PLN_EUR.rates.buy;

    const plnAfterSell =
      plnAfterBuy + (SELL_PROPS.amount - sellProfit) * RATES_PLN_EUR.rates.sell;
    const eurAfterSell = eurAfterBuy - (SELL_PROPS.amount + sellProfit);

    system.deposit(DEPOSIT_PROPS);
    expect(system.users[0].accounts.PLN).toStrictEqual(plnAfterDeposit);
    expect(system.users[0].accounts.EUR).toStrictEqual(0);

    system.exchange(BUY_PROPS);
    expect(system.users[0].accounts.PLN).toStrictEqual(plnAfterBuy);
    expect(system.users[0].accounts.EUR).toStrictEqual(eurAfterBuy);

    system.exchange(SELL_PROPS);
    expect(system.users[0].accounts.PLN).toStrictEqual(plnAfterSell);
    expect(system.users[0].accounts.EUR).toStrictEqual(eurAfterSell);
  });

  it("getProfitsByOperationType", () => {
    expect(
      system.getProfitsByOperationType(OperationType.DEPOSIT)
    ).toStrictEqual(EMPTY_CURRENCY_ACCOUNTS);
  });

  it("getProfitsByCurrency", () => {
    expect(system.getProfitsByCurrency(Currency.PLN)).toStrictEqual(
      PROFITS_ONE_CURRENCY
    );
  });

  it("getHistoryByOperationType", () => {
    system.history = HISTORY_OBJECTS;
    expect(
      system.getHistoryByOperationType(OperationType.DEPOSIT)
    ).toStrictEqual(HISTORY_OBJECTS_DEPOSIT);
  });

  it("getHistoryByCurrency", () => {
    system.history = HISTORY_OBJECTS;
    expect(system.getHistoryByCurrency(Currency.EUR)).toStrictEqual(
      HISTORY_OBJECTS_EUR
    );
  });

  it("getHistoryByOperationType", () => {
    system.history = HISTORY_OBJECTS;
    expect(
      system.getHistoryByDateRange(1649985222982, 1649985222984)
    ).toStrictEqual(HISTORY_OBJECTS_DATE_RANGE);
  });

  it("getAccountHistory", () => {
    system.history = HISTORY_OBJECTS;

    system.addUser();

    expect(system.getAccountHistory(BASIC_OPERATION_PROPS)).toStrictEqual(
      HISTORY_OBJECTS_EUR
    );
  });

  it("getAccountBalance", () => {
    system.addUser();
    system.users[0].accounts.EUR = 10;

    expect(system.getAccountBalance(BASIC_OPERATION_PROPS)).toStrictEqual(10);
  });

  it("calculates profits", () => {
    system.users = EXISTING_USERS;

    system.deposit(DEPOSIT_PROPS);
    system.exchange(BUY_PROPS);
    system.exchange(SELL_PROPS);
    system.withdraw(MONEY_OPERATION_PROPS);
    system.send(TRANSFER_PROPS);

    expect(system.getProfits()).toStrictEqual(PROFITS);
  });

  it("adds items to history", () => {
    system.users = EXISTING_USERS;

    system.deposit(DEPOSIT_PROPS);
    system.exchange(BUY_PROPS);
    system.exchange(SELL_PROPS);
    system.withdraw(MONEY_OPERATION_PROPS);
    system.send(TRANSFER_PROPS);

    expect(system.getHistory()).toStrictEqual(HISTORY);
  });
});
