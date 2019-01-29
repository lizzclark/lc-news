const connection = require('../db/connection');

exports.fetchTopics = () => {
  return connection.select('*').from('topics');
};

exports.addTopic = newTopic => {
  return connection
    .insert(newTopic)
    .into('topics')
    .returning('*');
};

exports.fetchArticlesByTopic = topic => {
  return connection
    .select('title', 'body', 'votes', 'topic', 'username', 'created_at')
    .count('article_id as total_count')
    .from('articles')
    .groupBy('article_id')
    .where({ topic });
};
