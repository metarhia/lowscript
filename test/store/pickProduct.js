async ({ order }) => {
  const { orderId, amount } = order;
  const postPackage = {
    packageId: 1,
    orderId,
    weight: 0.19 * amount,
  };
  return postPackage;
};
