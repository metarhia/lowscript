async ({ order, balance }) => {
  order.mixin = 'prevented';
  const confirmed = balance.amount >= order.amount;
  return { confirmed };
};
