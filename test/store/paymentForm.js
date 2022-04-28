async ({ order, paymentForm }) => {
  const { amount, transaction } = paymentForm;
  const payment = {
    paymentId: 1,
    orderId: order.orderId,
    amount,
    transaction,
    date: new Date(),
  };
  return payment;
};
