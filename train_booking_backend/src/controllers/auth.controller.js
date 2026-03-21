import authService from "../services/auth.service.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../validations/auth.validation.js";

export const register = async (req, res, next) => {
  try {
    validateRegisterInput(req.body);

    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    validateLoginInput(req.body);

    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.auth.userId);

    res.status(200).json({
      success: true,
      message: "Authenticated user fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
