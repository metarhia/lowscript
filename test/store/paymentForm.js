async ({ paymentForm }) => {
  const { amount, transaction } = paymentForm;
  const payment = {
    paymentId: 1,
    orderId: 1,
    amount,
    transaction,
    date: new Date(),
  };
  return payment;
};
