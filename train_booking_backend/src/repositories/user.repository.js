import User from "../models/user.model.js";

const findByEmail = (email, includePassword = false) => {
  const query = User.findOne({ email: email.toLowerCase() });
  return includePassword ? query.select("+password") : query;
};

const findByNic = (nic) => User.findOne({ nic });

const findById = (id) => User.findById(id);

const create = (payload) => User.create(payload);

const updateById = (id, payload) =>
  User.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

export default {
  findByEmail,
  findByNic,
  findById,
  create,
  updateById,
};
