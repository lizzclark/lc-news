const {
  fetchArticles,
  fetchArticleById,
  updateVotes,
  strikeArticle,
} = require('../models/articles');

const getArticles = function(req, res, next) {
  const { limit, sort_by, order, p } = req.query;
  fetchArticles(limit, sort_by, order, p).then(([articles, countInfo]) => {
    const { total_count } = countInfo[0];
    res.status(200).send({ total_count, articles });
  });
};
const getArticleById = function(req, res, next) {
  fetchArticleById(req.params).then(([article]) => {
    if (article) res.status(200).send({ article });
    else next({ status: 404, message: 'no such article to get' });
  });
};

const patchVote = function(req, res, next) {
  const newVote = req.body.inc_votes;
  updateVotes(req.params, newVote).then(([article]) => {
    if (article) res.status(200).send({ article });
    else {
      next({
        status: 404,
        message: "can't vote on a nonexistent article!",
      });
    }
  });
};

const deleteArticle = function(req, res, next) {
  strikeArticle(req.params.article_id).then(rowDeleted => {
    if (rowDeleted) {
      res.status(204).send();
    } else {
      next({
        status: 404,
        message: "can't delete a nonexistent article!",
      });
    }
  });
};

module.exports = { getArticles, getArticleById, patchVote, deleteArticle };
