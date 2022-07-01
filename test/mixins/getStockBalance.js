async (order) => {
  const amount = order ? 2 : 0;
  const balance = { amount };
  return balance;
};
