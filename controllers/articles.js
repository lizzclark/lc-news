const getArticles = function(req, res, next) {
  console.log('getting all articles...');
};
const getArticleById = function(req, res, next) {
  console.log('getting this article by its ID');
};

const addVote = function(req, res, next) {
  console.log('adding a vote to this article...');
};

const deleteArticle = function(req, res, next) {
  console.log('deleting this article...');
};

module.exports = { getArticles, getArticleById, addVote, deleteArticle };
