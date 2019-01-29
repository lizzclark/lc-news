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

exports.fetchArticlesByTopic = (topic, limit = 10, sort_by = 'created_at') => {
  return Promise.all([
    connection
      .select(
        { author: 'articles.username' },
        'articles.votes',
        'topic',
        'title',
        'articles.created_at',
        'articles.article_id'
      )
      .count('comment_id as comment_count')
      .from('articles')
      .join('comments', 'articles.article_id', 'comments.article_id')
      .where(queryBuilder => {
        queryBuilder.where({ topic });
        // if () {
        //   queryBuilder.where({  });
        // }
      })
      .groupBy('articles.article_id')
      .limit(limit)
      .orderBy(sort_by),
    connection
      .count('article_id as total_count')
      .from('articles')
      .groupBy('article_id')
      .where({ topic }),
  ]);
};
