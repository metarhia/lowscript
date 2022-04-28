async ({ order, balance, availability }) => {
  if (!balance || !availability.confirmed) {
    throw new Error('The product is out of stock');
  }
  const { productId, amount } = order;
  const reservation = { productId, amount };
  return reservation;
};
