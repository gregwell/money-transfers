import {
  Accounts,
  Exchange,
  ExchangeRate,
  MoneyOperation,
  OperationType,
  Profits,
  System,
  Transfer,
  User,
} from "./types";
import {
  exchangeRates,
  comission,
  getNewUser,
  initialProfits,
} from "./initialSetup";
import { errors } from "./constants";

export class MoneySystem implements System {
  users: User[];
  profits: Profits;
  exchangeRates: ExchangeRate[];

  constructor() {
    this.users = [] as User[];
    this.profits = initialProfits;
    this.exchangeRates = exchangeRates;
  }

  getUserIndexById = (id: string) => {
    return this.users.findIndex((user) => user.id.localeCompare(id));
  };

  addUser(): string {
    const newUser = getNewUser();
    this.users.push(newUser);

    return newUser.id;
  }

  deposit({ userId, currency, amount }: MoneyOperation) {
    const index = this.getUserIndexById(userId);
    const profit = comission * amount;

    this.users[index].accounts[currency] =
      this.users[index].accounts[currency] + amount + profit;

    this.profits[OperationType.DEPOSIT][currency] += profit;
  }

  withdraw({ userId, currency, amount }: MoneyOperation) {
    const index = this.getUserIndexById(userId);
    const profit = comission * amount;
    const newAmount = this.users[index].accounts[currency] - amount - profit;

    if (newAmount < 0) {
      throw new Error(errors.insufficientFunds);
    }

    this.users[index].accounts[currency] = newAmount;

    this.profits[OperationType.WITHDRAW][currency] += profit;
  }

  send({ userId, recipentId, currency, amount }: Transfer) {
    const senderIndex = this.getUserIndexById(userId);
    const recipentIndex = this.getUserIndexById(recipentId);

    const profit = comission * amount;

    const senderAfter =
      this.users[senderIndex].accounts[currency] - amount - profit;
    const recipentAfter = this.users[recipentIndex].accounts[currency] + amount;

    if (senderAfter < 0) {
      throw new Error(errors.insufficientFunds);
    }

    this.users[senderIndex].accounts[currency] = senderAfter;
    this.users[recipentIndex].accounts[currency] = recipentAfter;

    this.profits[OperationType.SEND][currency] += profit;
  }

  exchange({ userId, currency, targetCurrency, amount }: Exchange) {
    const index = this.getUserIndexById(userId);
    const userCurrencyAmount = this.users[index].accounts[currency];
    const userTargetCurrencyAmount = this.users[index].accounts[targetCurrency];

    const profit = comission * amount;

    if (userCurrencyAmount < amount + profit) {
      throw new Error(errors.insufficientFunds);
    }

    const ratesPair = this.exchangeRates.find(
      (rate) =>
        rate.pair.includes(currency) && rate.pair.includes(targetCurrency)
    ) as ExchangeRate;

    const sell = ratesPair.pair[0] === currency;

    const convertedAmount = sell
      ? amount * ratesPair.rates.sell
      : amount / ratesPair.rates.buy;

    this.users[index].accounts[currency] = userCurrencyAmount - amount - profit;
    this.users[index].accounts[targetCurrency] =
      userTargetCurrencyAmount + convertedAmount;

    this.profits[OperationType.EXCHANGE][currency] += profit;
  }

  getProfits(): Profits {
    return this.profits;
  }
}
