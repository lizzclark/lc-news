const commentRouter = require('express').Router({ mergeParams: true });
const {
  getCommentsByArticle,
  postComment,
} = require('../controllers/comments');

commentRouter
  .route('/')
  .get(getCommentsByArticle)
  .post(postComment);

// commentRouter
//   .route('/:article_id/comments/:comment_id')
//   .patch()
//   .delete();

module.exports = commentRouter;
