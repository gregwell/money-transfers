# Money Transfers

Simulation of a platform on which users will be able to make money transfers between each other and currency exchanges. No UI, no REST API, only interfaces.

## Business requirements

- the user is represented in the system as an ID; each ID will be unique
- the platform supports the following currencies: PLN (base currency), EUR, USD
- by default each user has an account in all available currencies
- the exchange rate will be set at the start of the application; the platform gives
  possibility to exchange between all available currencies
- for each account the following operations are possible:
  - deposit
  - withdrawal
  - transferring funds to another platform user
  - exchange of funds into another currency
- the platform charges a commission for each operation; the amount of the commission is set at
  the moment the application is launched (percentage value of the amount of a particular operation expressed as a floating point number e.g. 0.05 = 5%; 0.002 = 0.2%)
- the platform allows the user to download the history for a given type of operation, specific currency, date range
- the platform allows users to access information about the balance and the history of operations for each account (without pagination)
- the platform enables access to information about profit (profit from operations performed) with possibility to group the profit with respect to the type of operation and currency
- the platform should support handling basic errors (e.g. execution of operations with a negative value of a given currency)

## How to run

No real-life implementation - to run test suites of written functionalities `npm test`

## Notes

Profits were implemented in the following manner:

1. When you deposit PLN 10, you pay PLN 10 and your account is credited with PLN 10 minus commission.
2. When you withdraw PLN 10, you receive PLN 10 and your account is credited with PLN 10 plus commission.
3. When you send a transfer for PLN 10, the recipient gets PLN 10 and your account is charged PLN 10 plus commission.
4. When you exchange PLN 10, the commission is taken from this balance and the rest is exchanged into a foreign currency.
