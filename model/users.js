const User = require("./schemas/user");

const findUserById = async (id) => {
  const result = await User.findById(id)
  return result;
};

const findUserByEmail = async (email) => {
    const result = await User.findOne({ email })
    return result;
}

const getUserByVerificationToken = async (token) => {
  return await User.findOne({verificationToken: token})
}

const createUser = async (options) => {
  const user = new User(options);
  return await user.save()
}

const updateUserToken = async (id, token) => {
  return await User.updateOne({ _id: id },{ token })
}

const updateUserSubscription = async (id, body) => {
  return await User.findByIdAndUpdate({ _id:id }, {...body},{ new: true })
}
const updateUserAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id },{ avatarURL })
}

const updateVerificationToken = async (id, isVerify, verificationToken ) => {
  return await User.updateOne({_id: id},{isVerify, verificationToken})
}

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  updateUserToken,
  updateUserSubscription,
  updateUserAvatar,
  getUserByVerificationToken,
  updateVerificationToken
}