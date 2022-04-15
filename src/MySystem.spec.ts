import { errors } from "./constants";
import { MySystem } from "./MySystem";
import {
  HISTORY_OBJECTS,
  HISTORY_OBJECTS_DATE_RANGE,
  HISTORY_OBJECTS_DEPOSIT,
  HISTORY_OBJECTS_EUR,
} from "./MySystem.mock";
import { System } from "./System";
import {
  BasicOperation,
  Currency,
  ExchangeRate,
  HistoryObj,
  OperationType,
} from "./types";
import {
  EMPTY_CURRENCY_ACCOUNTS,
  EMPTY_PROFITS,
  EXISTING_USERS,
  PROFITS_ONE_CURRENCY,
  UUID,
} from "./utils.mock";

let system: System;
let john: string;
let linda: string;

jest.mock("uuid", () => ({ v4: () => UUID }));

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
    const props = {
      userId: "123",
      currency: Currency.PLN,
      amount: 10,
    };
    expect(() => system.deposit(props)).toThrow(errors.userNotFound);
  });

  it("deposit: changes account balance", () => {
    const user = system.addUser();

    const props = {
      userId: user,
      currency: Currency.PLN,
      amount: 10,
    };

    const expected = 10 - system.comission * props.amount;

    expect(system.users[0].accounts.PLN).toStrictEqual(0);
    system.deposit(props);
    expect(system.users[0].accounts.PLN).toStrictEqual(expected);
    system.deposit(props);
    expect(system.users[0].accounts.PLN).toStrictEqual(2 * expected);
  });

  it("withdraw: throws an error when id provided not found", () => {
    const props = {
      userId: "123",
      currency: Currency.PLN,
      amount: 10,
    };
    expect(() => system.withdraw(props)).toThrow(errors.userNotFound);
  });

  it("withdraw: throws an error when insufficient funds", () => {
    const user = system.addUser();

    const withdrawProps = {
      userId: user,
      currency: Currency.PLN,
      amount: 10,
    };

    expect(() => system.withdraw(withdrawProps)).toThrow(
      errors.insufficientFunds
    );
  });

  it("withdraw: changes account balance", () => {
    const user = system.addUser();

    const withdrawProps = {
      userId: user,
      currency: Currency.PLN,
      amount: 10,
    };

    const systemProfit = system.comission * withdrawProps.amount;

    const depositAmount = 10 - systemProfit;
    const withdrawalAmount = 10 + systemProfit;

    const expected = 2 * depositAmount - withdrawalAmount;

    system.deposit(withdrawProps);
    system.deposit(withdrawProps);
    system.withdraw(withdrawProps);

    expect(system.users[0].accounts.PLN).toStrictEqual(expected);
  });

  it("send: throws an error when any id provided not found", () => {
    system.users = EXISTING_USERS;
    const userId = system.users[0].id;

    const senderNotFound = {
      userId: "123",
      recipentId: userId,
      currency: Currency.PLN,
      amount: 1,
    };

    const recipentNotFound = {
      userId: userId,
      recipentId: "321",
      currency: Currency.PLN,
      amount: 1,
    };

    expect(() => system.send(senderNotFound)).toThrow(errors.userNotFound);
    expect(() => system.send(recipentNotFound)).toThrow(errors.userNotFound);
  });

  it("send: throws an error when the sender has insufficient funds", () => {
    system.users = EXISTING_USERS;
    john = system.users[0].id;
    linda = system.users[1].id;

    const props = {
      userId: john,
      recipentId: linda,
      amount: 20,
      currency: Currency.PLN,
    };

    expect(() => {
      system.send(props);
    }).toThrow(errors.insufficientFunds);
  });

  it("send: changes accounts balance", () => {
    system.users = EXISTING_USERS;
    john = system.users[0].id;
    linda = system.users[1].id;

    const deposit = {
      userId: john,
      currency: Currency.PLN,
      amount: 10,
    };

    const transfer = {
      userId: john,
      recipentId: linda,
      amount: 5,
      currency: Currency.PLN,
    };

    const transferProfit = system.comission * transfer.amount;
    const depositProfit = system.comission * deposit.amount;

    const depositNet = deposit.amount - depositProfit;

    const senderAfter = depositNet - transfer.amount - transferProfit;
    const recipentAfter = transfer.amount;

    system.deposit(deposit);
    system.send(transfer);

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
    const user = system.addUser();

    const exchangeProps = {
      userId: user,
      currency: Currency.PLN,
      targetCurrency: Currency.EUR,
      amount: 10,
    };

    expect(() => system.exchange(exchangeProps)).toThrow(
      errors.insufficientFunds
    );
  });

  it("exchange: change accounts balance", () => {
    const user = system.addUser();

    const depositProps = {
      userId: user,
      currency: Currency.PLN,
      amount: 3000,
    };

    const buyProps = {
      userId: user,
      currency: Currency.PLN,
      targetCurrency: Currency.EUR,
      amount: 2000,
    };

    const sellProps = {
      userId: user,
      currency: Currency.EUR,
      targetCurrency: Currency.PLN,
      amount: 100,
    };

    const [depositProfit, buyProfit, sellProfit] = [
      depositProps,
      buyProps,
      sellProps,
    ].map((props) => props.amount * system.comission);

    const ratesObj = system.exchangeRates.find(
      (rates) =>
        rates.pair[0] === Currency.PLN && rates.pair[1] === Currency.EUR
    ) as ExchangeRate;

    const plnAfterDeposit = depositProps.amount - depositProfit;

    const plnAfterBuy = plnAfterDeposit - buyProps.amount - buyProfit;
    const eurAfterBuy = (buyProps.amount - buyProfit) / ratesObj.rates.buy;

    const plnAfterSell =
      plnAfterBuy + (sellProps.amount - sellProfit) * ratesObj.rates.sell;

    const eurAfterSell = eurAfterBuy - (sellProps.amount + sellProfit);

    system.deposit(depositProps);
    expect(system.users[0].accounts.PLN).toStrictEqual(plnAfterDeposit);
    expect(system.users[0].accounts.EUR).toStrictEqual(0);

    system.exchange(buyProps);
    expect(system.users[0].accounts.PLN).toStrictEqual(plnAfterBuy);
    expect(system.users[0].accounts.EUR).toStrictEqual(eurAfterBuy);

    system.exchange(sellProps);
    expect(system.users[0].accounts.PLN).toStrictEqual(plnAfterSell);
    expect(system.users[0].accounts.EUR).toStrictEqual(eurAfterSell);
  });

  it("getProfits", () => {
    expect(system.getProfits()).toStrictEqual(EMPTY_PROFITS);
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

  it("getHistory", () => {
    system.history = HISTORY_OBJECTS;
    expect(system.getHistory()).toStrictEqual(HISTORY_OBJECTS);
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

    const userId = system.addUser();

    const props = {
      currency: Currency.EUR,
      userId: userId,
    };

    expect(system.getAccountHistory(props)).toStrictEqual(HISTORY_OBJECTS_EUR);
  });

  it("getAccountBalance", () => {
    const userId = system.addUser();
    system.users[0].accounts.EUR = 10;

    const props = {
      userId: userId,
      currency: Currency.EUR,
    };
    expect(system.getAccountBalance(props)).toStrictEqual(10);
  });
});
