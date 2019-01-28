const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const articleRouter = require('./articleRouter');

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articleRouter);

module.exports = apiRouter;
