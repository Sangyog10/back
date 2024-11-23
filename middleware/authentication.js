import { UnauthenticatedError } from "../errors/index.js";
import { isTokenValid } from "../utils/index.js";

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    throw new UnauthenticatedError(
      "You cannot access it, Authentication invalid"
    );
  }
  try {
    const payload = isTokenValid({ token });
    const { name, userId } = payload;
    req.user = { name, userId };

    next();
  } catch (error) {
    throw new UnauthenticatedError(
      "You cannot access it, Authentication invalid"
    );
  }
};

export { authenticateUser };
