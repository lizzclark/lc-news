const { topicData, userData, articleData, commentData } = require('../data');
const { formatArticles, formatComments } = require('../utils/index');

exports.seed = (connection, Promise) => {
  return Promise.all([
    connection.insert(topicData).into('topics'),
    connection.insert(userData).into('users'),
  ])
    .then(() => {
      const formattedArticles = formatArticles(articleData);
      return connection
        .insert(formattedArticles)
        .into('articles')
        .returning('*');
    })
    .then(articleRows => {
      const formattedComments = formatComments(commentData, articleRows);
      return connection.insert(formattedComments).into('comments');
    });
};
