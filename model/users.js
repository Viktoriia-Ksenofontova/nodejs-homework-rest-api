const User = require("./schemas/user");

const findUserById = async (id) => {
  const result = await User.findById(id)
  return result;
};

const findUserByEmail = async (email) => {
    const result = await User.findOne({ email })
    return result;
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

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  updateUserToken,
  updateUserSubscription
}