module.exports = {
  take(userEconomy, amount, useBank = false) {
    userEconomy.amountPocket ??= 0;
    if (userEconomy.amountPocket >= amount) {
      userEconomy.amountPocket -= amount;
      return amount;
    }

    let takenAmount = userEconomy.amountPocket;
    userEconomy.amountPocket = 0;
    amount = amount - takenAmount;
    if (!useBank) return takenAmount;

    userEconomy.amountBank ??= 0;
    if (userEconomy.amountBank >= amount) {
      userEconomy.amountBank -= amount;
      return takenAmount + amount;
    }

    takenAmount += userEconomy.amountBank;
    userEconomy.amountBank = 0;
    return takenAmount;
  },

  getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  },
};
