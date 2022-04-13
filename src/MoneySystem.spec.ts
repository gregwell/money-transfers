import { errors } from "./constants";
import { MoneySystem } from "./MoneySystem";
import { Currency, System } from "./types";

describe("transfers", () => {
  let system: System;
  let john: string;
  let linda: string;

  beforeEach(() => {
    system = new MoneySystem();

    john = system.addUser();
    linda = system.addUser();
  });

  it("throws an error when the sender has insufficient funds", () => {
    expect(() => {
      system.send({
        userId: john,
        recipentId: linda,
        amount: 20,
        currency: Currency.PLN,
      });
    }).toThrow(errors.insufficientFunds);
  });

  it("successfully transfer money", () => {
    //add money before // deposit

    expect(() => {
      system.send({
        userId: john,
        recipentId: linda,
        amount: 20,
        currency: Currency.PLN,
      });
    }).toThrow(errors.insufficientFunds);
  });
});
