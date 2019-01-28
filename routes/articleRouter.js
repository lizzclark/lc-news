const articleRouter = require('express').Router();
const { getArticles } = require('../controllers/articles');
const commentRouter = require('./commentRouter');

articleRouter.get('/', getArticles);

articleRouter.use('/:article_id', commentRouter);

module.exports = articleRouter;
