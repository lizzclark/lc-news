const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const articleRouter = require('./articleRouter');
const usersRouter = require('./usersRouter');
const endpoints = require('../endpoints');
const { handle405 } = require('../errors');

apiRouter
  .get('/', (req, res, next) => {
    res.status(200).send({ endpoints });
  })
  .all('/', handle405);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articleRouter);

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
