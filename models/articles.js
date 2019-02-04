const connection = require('../db/connection');

exports.fetchArticles = ({
  limit = 10,
  sort_by = 'created_at',
  order = 'desc',
  p = 1,
}) => {
  // pagination
  let offset = 0;
  if (p > 1) {
    offset = limit * (p - 1);
  }

  // validate limit
  if (Number.isNaN(+limit)) limit = 10;

  // validate sort_by
  const validColumns = [
    'title',
    'author',
    'article_id',
    'votes',
    'comment_count',
    'created_at',
    'topic',
  ];
  if (!validColumns.includes(sort_by)) sort_by = 'created_at';

  // validate sort order query
  if (order !== 'asc' && order !== 'desc') order = 'desc';

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
      .leftJoin('comments', 'comments.article_id', 'articles.article_id')
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

exports.updateVotes = ({ article_id }, { inc_votes = 0 }) => {
  // empty request body or no inc_votes property - return unmodified article
  if (inc_votes === 0) {
    return connection('articles').where({ article_id });
  }
  // check inc_votes is a number
  const posOrNegNum = /^-?[0-9]+$/;
  if (posOrNegNum.test(inc_votes)) {
    return connection('articles')
      .where({ article_id })
      .increment('votes', inc_votes)
      .returning('*');
  }
  return Promise.reject({
    status: 400,
    message: 'bad request - inc_votes must be a number',
  });
};

exports.strikeArticle = ({ article_id }) => {
  return connection('articles')
    .where({ article_id })
    .del();
};
