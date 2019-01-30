const { fetchComments, addComment } = require('../models/comments');

const getCommentsByArticle = function(req, res, next) {
  const { article_id } = req.params;
  fetchComments(article_id, req.query)
    .then(comments => {
      if (comments.length !== 0) res.status(200).send({ comments });
      else {
        return Promise.reject({ status: 404, message: 'no comments found' });
      }
    })
    .catch(next);
};

const postComment = function(req, res, next) {
  const { article_id } = req.params;
  addComment(req.body, article_id)
    .then(([comment]) => {
      return res.status(201).send({ comment });
    })
    .catch(err => {
      next({ status: 400, message: 'cant post this comment' });
    });
};

module.exports = { getCommentsByArticle, postComment };
