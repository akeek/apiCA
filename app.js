var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jsend = require('jsend');
var createError = require('http-errors');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const bodyParser = require('body-parser')

require('dotenv').config();
var db = require('./models');
db.sequelize.sync({ force: false });

var todosRouter = require('./routes/todos');
var categoriesRouter = require('./routes/categories');
var authRouter = require('./routes/auth');

var app = express();

app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(jsend.middleware);

app.use('/todos', todosRouter);
app.use('/categories', categoriesRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.jsend.error({ message: err.message });
});

const initializeApp = async () => {
    try {
      await db.sequelize.sync({ alter: true });
      await db.Status.checkAndInsertDefaultStatuses();
      
      console.log('Database synced and default statuses ensured.');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };
  
  initializeApp();

module.exports = app;