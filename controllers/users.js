const jwt = require("jsonwebtoken");
require('dotenv').config();
const Users = require('../model/users');
const { httpCode } = require("../helpers/constants");
const JWT_KEY = process.env.JWT_KEY;

const signup = async (req, res, next) => {
  try {
    const user = await Users.findUserByEmail(req.body.email);
    if (user) {
    return res.status(httpCode.CONFLICT).json({
      status: 'error',
      code: httpCode.CONFLICT,
      message: "Email in use"
    });
    }
    const newUser = await Users.createUser(req.body);
    const { id, email, subscription } = newUser;
    return res.status(httpCode.CREATED).json({
      status: "success",
      code: httpCode.CREATED,
      data: {
        id, email, subscription
      }
    })
  } catch (e) {
    next(e)
  }
  
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findUserByEmail(email);
    const isValidPassword = await user?.validPassword(password)
    if (!user || !isValidPassword) {
    return res.status(httpCode.UNAUTHORIZED).json({
      status: 'error',
      code: httpCode.UNAUTHORIZED,
      message: "Email or password is wrong"
    });
    };
  const payload = { id: user.id }
  const token = jwt.sign(payload, JWT_KEY, { expiresIn: '1h' })
  await Users.updateUserToken(user.id, token);
  return res.status(httpCode.OK).json({
    status: 'success',
    code: httpCode.OK,
    data: {
      token
    }
  })
  } catch (e) {
    next(e)
  }
}

const logout = async (req, res, next) => {
  try {
    await Users.updateUserToken(req.user.id, null);
    return res.status(httpCode.NO_CONTENT).json({})
  } catch (e) {
    next(e)
   }
};

const currentUser = async (req, res, next) => {
  try {
    const user = await Users.findUserById(req.user.id);
    if (!user) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: 'error',
        code: httpCode.UNAUTHORIZED,
        message: "Not authorized"
      });
    }
    const { email, subscription } = user;
    return res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      data: {
        email, subscription
      }
    })
  } catch (e) {
    next(e)
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const user = await Users.updateUserSubscription(req.user.id, req.body);
    if (user) {
      const { email, subscription } = user;
      return res.status(httpCode.OK).json({
        status: 'success',
        code: httpCode.OK,
        data: {email, subscription},
      })
    }
    return res.status(httpCode.UNAUTHORIZED).json({
        status: 'error',
        code: httpCode.UNAUTHORIZED,
        message: "Not authorized"
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  signup,
  login,
  logout,
  currentUser,
  updateSubscription
}
