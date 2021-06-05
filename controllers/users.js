const jwt = require("jsonwebtoken");
require('dotenv').config();
const Users = require('../model/users');
const { httpCode } = require("../helpers/constants");
const JWT_KEY = process.env.JWT_KEY;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
const LocalUploadAvatar = require('../services/avatars-local');

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
    const { id, email, subscription, avatarURL } = newUser;
    return res.status(httpCode.CREATED).json({
      status: "success",
      code: httpCode.CREATED,
      data: {
        id, email, subscription, avatarURL
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
    const { email, subscription } = req.user;
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

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new LocalUploadAvatar(AVATARS_OF_USERS);
    const avatarUrl = await uploads.saveAvatarToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile:req.user.avatarURL

    })
    await Users.updateUserAvatar(id, avatarUrl);
    return res.json({
      status: 'success',
      code: httpCode.OK,
      data: { avatarUrl },
    })
  } catch (e) {
    next(e)
   }
};

module.exports = {
  signup,
  login,
  logout,
  currentUser,
  updateSubscription,
  avatars
}
