const connection = require('../db/connection');

exports.fetchArticles = (
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
  return Promise.all([
    connection
      .select(
        'articles.article_id',
        'articles.title',
        'articles.body',
        'articles.votes',
        'articles.created_at',
        'articles.topic',
        'articles.username as author'
      )
      .count('comments.comment_id as comment_count')
      .from('articles')
      .leftJoin('comments', 'comments.username', 'articles.username')
      .groupBy('articles.article_id')
      .limit(limit)
      .orderBy(sort_by, order)
      .offset(offset),
    connection.count('article_id as total_count').from('articles'),
  ]);
};

exports.fetchArticleById = ({ article_id }) => {
  return connection
    .select(
      'articles.username as author',
      'articles.article_id',
      'articles.title',
      'articles.votes',
      'articles.body',
      'articles.created_at',
      'articles.topic'
    )
    .count('comments.comment_id as comment_count')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .where({ 'articles.article_id': article_id });
};

exports.updateVotes = ({ article_id }, newVote) => {
  return connection('articles')
    .where({ article_id })
    .increment('votes', newVote)
    .returning('*');
};

exports.strikeArticle = article_id => {
  return connection('articles')
    .where({ article_id })
    .del();
};