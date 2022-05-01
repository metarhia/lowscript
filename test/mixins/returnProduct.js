async ({ order }) => {
  const { productId, amount } = order;
  return { productId, amount };
};
