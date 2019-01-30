const commentRouter = require('express').Router({ mergeParams: true });
const {
  getCommentsByArticle,
  postComment,
  patchComment,
  deleteComment,
} = require('../controllers/comments');

commentRouter
  .route('/')
  .get(getCommentsByArticle)
  .post(postComment);

commentRouter
  .route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment);

module.exports = commentRouter;
