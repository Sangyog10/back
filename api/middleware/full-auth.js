import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";
import { isTokenValid } from "../utils/jwt.js";

const authenticateUser = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const payload = isTokenValid(token);

    req.user = {
      userId: payload.user.userId,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export { authenticateUser };
