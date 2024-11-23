const createTokenUser = (user) => ({
  name: user.name,
  userId: user._id,
  // isLoggedIn: true,
});

export { createTokenUser };
