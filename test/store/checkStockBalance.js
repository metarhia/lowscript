async ({ order, balance }) => {
  const confirmed = balance.amount >= order.amount;
  return { confirmed };
};
