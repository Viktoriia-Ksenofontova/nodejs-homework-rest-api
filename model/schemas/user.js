const { Schema, model } = require('mongoose');
const { subscription } = require('../../helpers/constants');
const { nanoid } = require('nanoid');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const userSchema = new Schema(
  {
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: [subscription.STARTER, subscription.PRO, subscription.BUSINESS],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
    },
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, {s:250}, true)
    }
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
    default: nanoid(),
  },
  },
  {
    timestamps:true,
  }
)

userSchema.pre('save', async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(6);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next()
})

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password)
}

const User = model('user', userSchema);
module.exports = User;