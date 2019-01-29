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
  return Promise.all([
    connection
      .select(
        { author: 'articles.username' },
        'articles.body',
        'articles.votes',
        'topic',
        'title',
        'articles.created_at',
        'articles.article_id'
      )
      .count('comment_id as comment_count')
      .from('articles')
      .join('comments', 'articles.article_id', 'comments.article_id')
      .where({ topic })
      .groupBy('articles.article_id'),
    connection
      .count('article_id as total_count')
      .from('articles')
      .groupBy('article_id')
      .where({ topic }),
  ]);
};
