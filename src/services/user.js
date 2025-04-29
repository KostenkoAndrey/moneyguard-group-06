import { User } from '../db/models/user.js';

export const userGetInfo = async (userId)=> {
  const user = await User.findById(userId);

  return user;
};

export const updateUser = async (userId, payload, options = {}) => {
  const rawResult = await User.findOneAndUpdate({ _id: userId }, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    user: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
