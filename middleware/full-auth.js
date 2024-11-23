import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";
import { isTokenValid } from "../utils/jwt.js";

const authenticateUser = async (req, res, next) => {
  let token;

  // Check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  // Check cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const payload = isTokenValid(token);

    // Attach the user and his permissions to the req object
    req.user = {
      userId: payload.user.userId,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};



export { authenticateUser };
