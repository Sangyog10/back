import jwt from "jsonwebtoken";

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1d" });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.jwtSecret);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  res.cookie("token", token, {
    httpOnly: true,
    path: "/",
    expires: new Date(Date.now() + 900000),
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
