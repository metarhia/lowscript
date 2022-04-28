async ({ order }) => {
  const { orderId, total } = order;
  const transaction = 'transaction id';
  const payment = { orderId, amount: total, transaction };
  return payment;
};
