export const toPublicUser = (userDocument) => {
  const user = userDocument.toObject ? userDocument.toObject() : userDocument;

  return {
    id: user._id?.toString() || user.id,
    nic: user.nic,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
