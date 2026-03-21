import jwt from "jsonwebtoken";

import ApiError from "../utils/apiError.js";

export const requireAuth = (req, _res, next) => {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid authorization token"));
  }

  const token = authorization.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

    const decoded = jwt.verify(token, secret);
    req.auth = {
      userId: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
