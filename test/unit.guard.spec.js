const guard = require("../helpers/guard");
const passport = require("passport");
const { httpCode } = require("../helpers/constants");

describe('Unit test user autorization', () => {
  const user = { token: "111111" };
  const req = { get: jest.fn((header)=> `Bearer ${user.token}`), user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();
  
  it('guard with user', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
      callback(null, user)
    })
    guard(req, res, next)
    expect(next).toHaveBeenCalled()
  });

  it('guard without user', async () => {
     passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
      callback(null, false)
    })
    guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: httpCode.UNAUTHORIZED,
      message: "Not authorized"
    })
  });

  it('guard with wrong token', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
        callback(null, { token: "222222" })
    })
    guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: httpCode.UNAUTHORIZED,
      message: "Not authorized"
    })
  });

  it('guard with error', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
        callback(new Error('some trable'), {})
    })
    guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: httpCode.UNAUTHORIZED,
      message: "Not authorized"
    })
  })
})