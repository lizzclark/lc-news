const connection = require('../db/connection');

exports.fetchUsers = () => {
  return connection.select('*').from('users');
};

exports.addUser = userData => {
  return connection
    .insert(userData)
    .into('users')
    .returning('*');
};

exports.fetchUserByUsername = username => {
  return connection
    .select('*')
    .from('users')
    .where({ username });
};

exports.fetchArticlesByUser = (
  username,
  { limit = 10, sort_by = 'created_at', order = 'desc', p = 1 }
) => {
  // pagination
  let offset;
  if (p > 1) {
    offset = limit * (p - 1);
  }

  // validate limit
  if (Number.isNaN(+limit)) limit = 10;

  // validate sort_by
  const validColumns = {
    username: 'string',
    votes: 'number',
    title: 'string',
    article_id: 'number',
    topic: 'string',
    created_at: 'date',
    comment_count: 'number',
  };
  if (!validColumns[sort_by]) sort_by = 'created_at';

  // validate order
  if (order !== 'asc') order = 'desc';

  return connection
    .select(
      'articles.username as author',
      'articles.votes',
      'articles.title',
      'articles.article_id',
      'articles.topic',
      'articles.created_at'
    )
    .count('comments.comment_id as comment_count')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .limit(limit)
    .orderBy(sort_by, order)
    .offset(offset)
    .where({ 'articles.username': username });
};
