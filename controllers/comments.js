const {
  fetchComments,
  addComment,
  voteOnComment,
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
  const { article_id } = req.params;
  addComment(req.body, article_id)
    .then(([comment]) => {
      return res.status(201).send({ comment });
    })
    .catch(err => {
      let errorObject;
      if (err.code === '23503') {
        errorObject = {
          status: 404,
          message: "can't add comment to nonexistent article",
        };
      } else if (err.code === '42703') {
        errorObject = { status: 400, message: 'invalid comment data' };
      }
      next(errorObject);
    });
};

const patchComment = function({ params: { comment_id }, body }, res, next) {
  const newVote = body.inc_votes;
  voteOnComment(comment_id, newVote).then(([comment]) => {
    res.status(200).send({ comment });
  });
};

const deleteComment = function(req, res, next) {
  console.log('deleting comment...');
};

module.exports = {
  getCommentsByArticle,
  postComment,
  patchComment,
  deleteComment,
};
