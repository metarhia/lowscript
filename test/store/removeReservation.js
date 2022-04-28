async (reservation) => {
  if (!reservation) throw new Error('No "reservation" data in context');
  const result = { active: false };
  return result;
};
