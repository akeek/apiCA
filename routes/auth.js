var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var crypto = require('crypto');
var UserService = require("../services/UserService");
var userService = new UserService(db);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');

router.use(jsend.middleware);

router.post("/login", jsonParser, async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return res.jsend.fail({"email": "Email is required."});
  }
  if (!password) {
    return res.jsend.fail({"password": "Password is required."});
  }
  try {
    const data = await userService.getOne(email);
    if (!data) {
      return res.jsend.fail({"result": "Incorrect email or password"});
    }
    crypto.pbkdf2(password, data.Salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) return next(err);
      if (!crypto.timingSafeEqual(data.EncryptedPassword, hashedPassword)) {
        return res.jsend.fail({"result": "Incorrect email or password"});
      }
      let token;
      try {
        token = jwt.sign(
          { id: data.id, email: data.Email },
          process.env.TOKEN_SECRET,
          { expiresIn: "1h" }
        );
      } catch (err) {
        return res.jsend.error({ message: "Something went wrong with creating JWT token" });
      }
      return res.jsend.success({ "result": "You are logged in", "token": token });
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/signup", jsonParser, async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.jsend.fail({ message: "Name, email, and password are required." });
  }
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
    if (err) return next(err);
    try {
      await userService.create(name, email, hashedPassword, salt);
      res.jsend.success({"result": "You created an account."});
    } catch (error) {
      res.jsend.error({ message: "Error creating user" });
    }
  });
});

module.exports = router;