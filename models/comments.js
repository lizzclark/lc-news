const connection = require('../db/connection');

exports.fetchComments = (
  { article_id },
  { limit = 10, sort_by = 'created_at', order = 'desc', p = 1 }
) => {
  // validate order
  if (order !== 'desc' && order !== 'asc') order = 'desc';

  // pagination
  let offset = 0;
  if (p > 1) {
    offset = limit * (p - 1);
  }

  // validate limit
  if (Number.isNaN(+limit)) limit = 10;

  // validate sort_by
  const validColumns = [
    'comment_id',
    'username',
    'article_id',
    'votes',
    'created_at',
    'body'
  ];
  if (!validColumns.includes(sort_by)) sort_by = 'created_at';

  return Promise.all([
    connection
      .select('article_id')
      .from('articles')
      .where({ article_id }),
    connection
      .select('comment_id', 'votes', 'created_at', 'username as author', 'body')
      .from('comments')
      .where({ article_id })
      .limit(limit)
      .orderBy(sort_by, order)
      .offset(offset)
  ]);
};

exports.addComment = (comment, { article_id }) => {
  const numbersRegex = /^[0-9]+$/;
  if (numbersRegex.test(article_id)) {
    return connection('comments')
      .insert({ ...comment, article_id })
      .returning('*');
  }
  return Promise.reject({
    status: 400,
    message: 'invalid article_id, cannot POST comment'
  });
};

exports.voteOnComment = ({ comment_id, article_id }, { inc_votes = 0 }) => {
  const posOrNegNum = /^-?[0-9]+$/;
  if (posOrNegNum.test(inc_votes)) {
    return connection('comments')
      .increment('votes', inc_votes)
      .where({ comment_id, article_id })
      .returning('*');
  }
  // empty request body or no inc_votes value
  if (inc_votes === 0) {
    return connection('comments')
      .select('*')
      .where({ comment_id, article_id });
  }
  // invalid inc_votes value
  return Promise.reject({
    status: 400,
    message: 'bad request, inc_votes must be a number'
  });
};

exports.strikeComment = ({ comment_id, article_id }) => {
  return connection('comments')
    .where({ comment_id, article_id })
    .del();
};
