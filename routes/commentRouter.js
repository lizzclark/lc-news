const commentRouter = require('express').Router({ mergeParams: true });
const {
  getCommentsByArticle,
  postComment,
  patchComment,
  deleteComment,
} = require('../controllers/comments');
const { handle405 } = require('../errors');

commentRouter
  .route('/')
  .get(getCommentsByArticle)
  .post(postComment)
  .all(handle405);

commentRouter
  .route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(handle405);

module.exports = commentRouter;
