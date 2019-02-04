const {
  fetchArticles,
  fetchArticleById,
  updateVotes,
  strikeArticle,
} = require('../models/articles');

const getArticles = function(req, res, next) {
  fetchArticles(req.query)
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
    .catch(err => {
      if (err.code === '22P02') {
        next({ status: 400, message: 'invalid article_id' });
      } else next(err);
    });
};

const patchVote = function(req, res, next) {
  updateVotes(req.params, req.body)
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
  strikeArticle(req.params)
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
