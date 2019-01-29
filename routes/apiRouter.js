const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const articleRouter = require('./articleRouter');
const usersRouter = require('./usersRouter');

apiRouter.get('/', () => {
  console.log('this should serve a JSON object of all the endpoints');
});

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articleRouter);

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
