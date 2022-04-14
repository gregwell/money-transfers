import { errors } from "./constants";
import { MySystem } from "./MySystem";
import { System } from "./System";
import { Currency } from "./types";

describe("transfers", () => {
  let system: System;
  let john: string;
  let linda: string;

  beforeEach(() => {
    system = new MySystem();

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
