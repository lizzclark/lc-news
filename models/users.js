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

exports.fetchArticlesByUser = username => {
  return connection
    .select(
      'articles.username as author',
      'articles.votes',
      'articles.title',
      'articles.article_id',
      'articles.topic',
      'articles.created_at'
    )
    .from('articles')
    .where({ username });
};
