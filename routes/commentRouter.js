const commentRouter = require('express').Router();
const { getComments, addComment } = require('../controllers/comments');

commentRouter
  .route('/')
  .get(getComments)
  .post(addComment);

module.exports = commentRouter;
