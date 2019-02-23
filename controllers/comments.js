const {
  fetchComments,
  addComment,
  voteOnComment,
  strikeComment
} = require('../models/comments');

const getCommentsByArticle = function(req, res, next) {
  fetchComments(req.params, req.query)
    .then(([article, comments]) => {
      if (article.length !== 0) return res.status(200).send({ comments });
      return Promise.reject({ status: 404, message: 'no comments found' });
    })
    .catch(next);
};

const postComment = function(req, res, next) {
  addComment(req.body, req.params)
    .then(([comment]) => {
      return res.status(201).send({ comment });
    })
    .catch(err => {
      if (err.code === '23503') {
        next({
          status: 404,
          message: "can't add comment to nonexistent article"
        });
      }
      if (err.code === '42703') {
        next({ status: 400, message: 'invalid comment data' });
      }
      next(err);
    });
};

const patchComment = function(req, res, next) {
  voteOnComment(req.params, req.body)
    .then(([comment]) => {
      if (comment) return res.status(200).send({ comment });
      // no such comment - knex responds with an empty array
      return Promise.reject({
        status: 404,
        message: 'no such comment to patch'
      });
    })
    .catch(err => {
      if (err.code === '22P02') {
        next({
          status: 400,
          message: 'comment_id and/or article_id not found'
        });
      }
      next(err);
    });
};

const deleteComment = function(req, res, next) {
  strikeComment(req.params)
    .then(rowDeleted => {
      if (rowDeleted) return res.status(204).send();
      return Promise.reject({
        status: 404,
        message: 'no such comment to delete'
      });
    })
    .catch(next);
};

module.exports = {
  getCommentsByArticle,
  postComment,
  patchComment,
  deleteComment
};
