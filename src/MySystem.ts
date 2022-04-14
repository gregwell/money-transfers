import {
  HistoryObj,
  Exchange,
  ExchangeRate,
  MoneyOperation,
  OperationType,
  Profits,
  Transfer,
  User,
  Currency,
  BasicOperation,
  Accounts,
} from "./types";
import { System } from "./System";
import { exchangeRates, comission } from "./initialSetup";
import { errors } from "./constants";
import { getNewUser, getProfits, getUserById, getUserIndexById } from "./utils";

export class MySystem implements System {
  users: User[];
  profits: Profits<Accounts>;
  history: HistoryObj[];
  exchangeRates: ExchangeRate[];
  comission: number;

  constructor() {
    this.users = [] as User[];
    this.profits = getProfits<Accounts>();
    this.history = [] as HistoryObj[];
    this.exchangeRates = exchangeRates;
    this.comission = comission;
  }

  addUser(): string {
    const newUser = getNewUser();
    this.users.push(newUser);

    return newUser.id;
  }

  deposit(props: MoneyOperation) {
    const { userId, currency, amount } = props;
    const index = getUserIndexById(this.users, userId);

    const profit = this.comission * amount;

    this.users[index].accounts[currency] += amount - profit;

    const operationType = OperationType.DEPOSIT;

    this.profits[operationType][currency] += profit;
    this.history.push({
      ...props,
      operation: operationType,
      date: Date.now(),
      amount: amount - profit,
      comission: profit,
    });
  }

  withdraw(props: MoneyOperation) {
    const { userId, currency, amount } = props;

    const index = getUserIndexById(this.users, userId);

    const profit = this.comission * amount;
    const newAmount = this.users[index].accounts[currency] - amount - profit;

    if (newAmount < 0) {
      throw new Error(errors.insufficientFunds);
    }

    this.users[index].accounts[currency] = newAmount;

    const operationType = OperationType.WITHDRAW;

    this.profits[operationType][currency] += profit;

    this.history.push({
      ...props,
      operation: operationType,
      date: Date.now(),
      comission: profit,
    });
  }

  send({ userId, recipentId, currency, amount }: Transfer) {
    const senderIndex = getUserIndexById(this.users, userId);
    const recipentIndex = getUserIndexById(this.users, recipentId);

    const profit = this.comission * amount;

    const senderAfter =
      this.users[senderIndex].accounts[currency] - amount - profit;
    const recipentAfter = this.users[recipentIndex].accounts[currency] + amount;

    if (senderAfter < 0) {
      throw new Error(errors.insufficientFunds);
    }

    this.users[senderIndex].accounts[currency] = senderAfter;
    this.users[recipentIndex].accounts[currency] = recipentAfter;

    const operationType = OperationType.SEND;

    this.profits[operationType][currency] += profit;

    this.history.push({
      userId: userId,
      currency: currency,
      amount: amount,
      operation: operationType,
      date: Date.now(),
      comission: profit,
    });
  }

  exchange({ userId, currency, targetCurrency, amount }: Exchange) {
    const index = getUserIndexById(this.users, userId);
    const userCurrencyAmount = this.users[index].accounts[currency];
    const userTargetCurrencyAmount = this.users[index].accounts[targetCurrency];

    const profit = this.comission * amount;

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

    const operationType = OperationType.EXCHANGE;

    this.profits[operationType][currency] += profit;

    this.history.push({
      userId: userId,
      currency: currency,
      amount: amount,
      operation: operationType,
      date: Date.now(),
      comission: profit,
    });
  }

  getProfits(): Profits<Accounts> {
    return this.profits;
  }

  getHistory(): HistoryObj[] {
    return this.history;
  }

  getHistoryByOperationType(operationType: OperationType): HistoryObj[] {
    return this.history.filter(
      (historyObj) => historyObj.operation === operationType
    );
  }

  getHistoryByCurrency(currency: Currency): HistoryObj[] {
    return this.history.filter(
      (historyObj) => historyObj.currency === currency
    );
  }

  getHistoryByDateRange(start: number, end: number): HistoryObj[] {
    return this.history.filter(
      (historyObj) => historyObj.date > start && historyObj.date < end
    );
  }

  getAccountHistory({ userId, currency }: BasicOperation): HistoryObj[] {
    getUserIndexById(this.users, userId);

    return this.history.filter(
      (obj) => obj.userId === userId && obj.currency == currency
    );
  }

  getAccountBalance({ userId, currency }: BasicOperation): number {
    const user = getUserById(this.users, userId);

    return user.accounts[currency];
  }

  getProfitsByOperationType(operationType: OperationType): Accounts {
    return this.profits[operationType];
  }

  getProfitsByCurrency(currency: Currency): Profits<number> {
    return getProfits<number>(this.profits, currency);
  }
}
