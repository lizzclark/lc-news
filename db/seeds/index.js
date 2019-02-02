const { topicData, userData, articleData, commentData } = require('../data');
const { createRefObj } = require('../utils/index');

exports.seed = (connection, Promise) => {
  return connection
    .insert(topicData)
    .into('topics')
    .then(() => connection.insert(userData).into('users'))
    .then(() => {
      const formattedArticles = articleData.map(
        ({ title, topic, body, votes, created_at, created_by }) => {
          const newArticle = {
            title,
            topic,
            body,
            votes,
            created_at: new Date(created_at),
            username: created_by,
          };
          return newArticle;
        }
      );
      return connection
        .insert(formattedArticles)
        .into('articles')
        .returning('*');
    })
    .then(articleRows => {
      // create a reference object of articles with their title and ID
      const articleLookupInfo = createRefObj(
        articleRows,
        'title',
        'article_id'
      );
      const formattedComments = commentData.map(
        ({ body, votes, created_by, created_at, belongs_to }) => {
          const newComment = {
            body,
            votes,
            username: created_by,
            created_at: new Date(created_at),
            // look up the article that the comment belongs_to to get its ID
            article_id: articleLookupInfo[belongs_to],
          };
          return newComment;
        }
      );
      return connection.insert(formattedComments).into('comments');
    });
};
