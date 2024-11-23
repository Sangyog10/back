const createTokenUser = (user) => ({
  name: user.name,
  userId: user._id,
});

export { createTokenUser };
