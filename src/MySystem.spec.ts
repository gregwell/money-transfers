import { errors } from "./constants";
import { MySystem } from "./MySystem";
import { System } from "./System";
import { Currency } from "./types";
import { EXISTING_USERS, UUID } from "./utils.mock";

let system: System;
let john: string;
let linda: string;

jest.mock("uuid", () => ({ v4: () => UUID }));

describe("general", () => {
  beforeEach(() => {
    system = new MySystem();
  });

  it("add user", () => {
    expect(system.users.length === 0);
    system.addUser();
    expect(system.users.length === 1);
  });

  it("add new user return added user id", () => {
    const system = new MySystem();
    const userId = system.addUser();
    expect(userId).toStrictEqual(UUID);
  });
});

describe("deposit", () => {
  beforeEach(() => {
    system = new MySystem();
  });

  it("throws an error when id provided not found", () => {
    const props = {
      userId: "123",
      currency: Currency.PLN,
      amount: 1,
    };
    expect(() => system.deposit(props)).toThrow(errors.userNotFound);
  });

  it("deposit", () => {
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
});

describe("withdraw", () => {
  beforeEach(() => {
    system = new MySystem();
  });

  it("throws an error when id provided not found", () => {
    const props = {
      userId: "123",
      currency: Currency.PLN,
      amount: 1,
    };
    expect(() => system.withdraw(props)).toThrow(errors.userNotFound);
  });

  it("throws an error when insufficient funds", () => {
    const user = system.addUser();

    const props = {
      userId: user,
      currency: Currency.PLN,
      amount: 1,
    };

    expect(() => system.withdraw(props)).toThrow(errors.insufficientFunds);
  });

  it("withdraw", () => {
    const user = system.addUser();

    const props = {
      userId: user,
      currency: Currency.PLN,
      amount: 10,
    };

    const systemProfit = system.comission * props.amount;

    const depositAmount = 10 - systemProfit;
    const withdrawalAmount = 10 + systemProfit;

    const expected = 2 * depositAmount - withdrawalAmount;

    system.deposit(props);
    system.deposit(props);
    system.withdraw(props);

    expect(system.users[0].accounts.PLN).toStrictEqual(expected);
  });
});

describe("send", () => {
  beforeEach(() => {
    system = new MySystem();

    system.users = EXISTING_USERS;
    john = system.users[0].id;
    linda = system.users[1].id;
  });

  it("throws an error when any id provided not found", () => {
    const senderNotFound = {
      userId: "123",
      recipentId: linda,
      currency: Currency.PLN,
      amount: 1,
    };

    const recipentNotFound = {
      userId: john,
      recipentId: "321",
      currency: Currency.PLN,
      amount: 1,
    };

    expect(() => system.send(senderNotFound)).toThrow(errors.userNotFound);
    expect(() => system.send(recipentNotFound)).toThrow(errors.userNotFound);
  });

  it("throws an error when the sender has insufficient funds", () => {
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

  it("successfully transfer money", () => {
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
});
