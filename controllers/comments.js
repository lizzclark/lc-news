const {
  fetchComments,
  addComment,
  voteOnComment,
  strikeComment,
} = require('../models/comments');

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
  console.log(req.params, 'this is req.params');
  const { article_id } = req.params;
  addComment(req.body, article_id)
    .then(([comment]) => {
      return res.status(201).send({ comment });
    })
    .catch(err => {
      if (err.code === '23503') {
        next({
          status: 404,
          message: "can't add comment to nonexistent article",
        });
      }
      if (err.code === '42703') {
        next({ status: 400, message: 'invalid comment data' });
      }
    });
};

const patchComment = function(
  { params: { comment_id, article_id }, body },
  res,
  next
) {
  const newVote = body.inc_votes;
  voteOnComment(comment_id, article_id, newVote)
    .then(([comment]) => {
      if (comment) res.status(200).send({ comment });
      else {
        // no such comment - knex responds with an empty array
        return Promise.reject({
          status: 404,
          message: 'no such comment to patch',
        });
      }
    })
    .catch(next);
};

const deleteComment = function(
  { params: { comment_id, article_id } },
  res,
  next
) {
  strikeComment(comment_id, article_id)
    .then(rowDeleted => {
      if (rowDeleted) res.status(204).send();
      else {
        return Promise.reject({
          status: 404,
          message: 'no such comment to delete',
        });
      }
    })
    .catch(next);
};

module.exports = {
  getCommentsByArticle,
  postComment,
  patchComment,
  deleteComment,
};
