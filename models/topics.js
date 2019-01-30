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

exports.fetchArticlesByTopic = (
  topic,
  limit = 10,
  sort_by = 'created_at',
  order = 'desc',
  p = 1
) => {
  // pagination
  let offset = 0;
  if (p > 1) {
    offset = limit * (p - 1);
  }
  // return articles and a total count of all the articles for this topic
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
      .leftJoin('comments', 'articles.article_id', 'comments.article_id')
      .groupBy('articles.article_id')
      .limit(limit)
      .offset(offset)
      .where({ topic })
      .orderBy(sort_by, order),
    connection
      .count('article_id as total_count')
      .from('articles')
      .groupBy('article_id')
      .where({ topic }),
  ]);
};

exports.addArticle = article => {
  return connection
    .insert(article)
    .into('articles')
    .returning('*');
};