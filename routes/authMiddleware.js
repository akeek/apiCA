const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      data: {
        statusCode: 401,
        result: 'No token provided',
      },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      result: 'Invalid token',
    });
  }
};

module.exports = authenticate;