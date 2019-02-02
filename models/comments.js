const connection = require('../db/connection');

exports.fetchComments = (
  article_id,
  { limit = 10, sort_by = 'created_at', sort_ascending = false, p = 1 }
) => {
  // validate sort_ascending, determine sort order
  let sortOrder = 'desc';
  if (sort_ascending === 'true') {
    sortOrder = 'asc';
  }

  // pagination
  let offset = 0;
  if (p > 1) {
    offset = limit * (p - 1);
  }

  // validate limit
  if (Number.isNaN(+limit)) limit = 10;

  // validate sort_by
  const validColumns = {
    comment_id: 'number',
    username: 'string',
    article_id: 'number',
    votes: 'number',
    created_at: 'date',
    body: 'string',
  };
  if (!validColumns[sort_by]) sort_by = 'created_at';

  return connection
    .select('comment_id', 'votes', 'created_at', 'username as author', 'body')
    .from('comments')
    .where({ article_id })
    .limit(limit)
    .orderBy(sort_by, sortOrder)
    .offset(offset);
};

exports.addComment = (comment, article_id) => {
  const numbersRegex = /[0-9]/;
  if (numbersRegex.test(article_id)) {
    return connection('comments')
      .insert({ ...comment, article_id })
      .returning('*');
  }
  return Promise.reject({
    status: 400,
    message: 'invalid POST request, cannot add comment',
  });
};

exports.voteOnComment = (comment_id, article_id, newVote) => {
  const numbersRegex = /[0-9]/;
  if (
    numbersRegex.test(comment_id) &&
    numbersRegex.test(article_id) &&
    numbersRegex.test(newVote)
  ) {
    return connection('comments')
      .increment('votes', newVote)
      .where({ comment_id, article_id })
      .returning('*');
  }
  // empty request body - newVote is undefined
  if (!newVote) {
    return connection('comments')
      .select('*')
      .where({ comment_id, article_id });
  }
  // invalid article_id, comment_id or newVote value
  return Promise.reject({
    status: 400,
    message: 'bad request, cannot PATCH comment',
  });
};

exports.strikeComment = (comment_id, article_id) => {
  return connection('comments')
    .where({ comment_id, article_id })
    .del();
};
