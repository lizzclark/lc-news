const { fetchComments } = require('../models/comments');

const getCommentsByArticle = function(req, res, next) {
  const { article_id } = req.params;
  fetchComments(article_id, req.query).then(comments => {
    if (comments.length !== 0) res.status(200).send({ comments });
    else {
      next({ status: 404, message: 'no comments found' });
    }
  });
};

const addComment = function(req, res, next) {
  console.log('adding a comment to this article...');
};

module.exports = { getCommentsByArticle, addComment };
