const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const articleRouter = require('./articleRouter');
const usersRouter = require('./usersRouter');
const endpoints = require('../endpoints');

apiRouter
  .get('/', (req, res, next) => {
    res.status(200).send({ endpoints });
  })
  .all('/', (req, res, next) => {
    next({ status: 405, message: 'method not allowed!' });
  });

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articleRouter);

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
