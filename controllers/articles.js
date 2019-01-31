const {
  fetchArticles,
  fetchArticleById,
  updateVotes,
  strikeArticle,
} = require('../models/articles');

const getArticles = function(req, res, next) {
  const { limit, sort_by, order, p } = req.query;
  fetchArticles(limit, sort_by, order, p)
    .then(([articles, countInfo]) => {
      if (articles.length !== 0) {
        const { total_count } = countInfo[0];
        res.status(200).send({ total_count, articles });
      } else {
        return Promise.reject({ status: 404, message: 'articles not found' });
      }
    })
    .catch(next);
};

const getArticleById = function(req, res, next) {
  fetchArticleById(req.params)
    .then(([article]) => {
      if (article) res.status(200).send({ article });
      else {
        return Promise.reject({
          status: 404,
          message: 'no such article to get',
        });
      }
    })
    .catch(next);
};

const patchVote = function(req, res, next) {
  const newVote = req.body.inc_votes;
  updateVotes(req.params, newVote)
    .then(([article]) => {
      if (article) res.status(200).send({ article });
      else {
        return Promise.reject({
          status: 404,
          message: "can't vote on a nonexistent article!",
        });
      }
    })
    .catch(next);
};

const deleteArticle = function(req, res, next) {
  strikeArticle(req.params.article_id)
    .then(rowDeleted => {
      if (rowDeleted) {
        res.status(204).send();
      } else {
        return Promise.reject({
          status: 404,
          message: "can't delete a nonexistent article!",
        });
      }
    })
    .catch(next);
};

module.exports = { getArticles, getArticleById, patchVote, deleteArticle };
