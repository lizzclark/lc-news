const connection = require('../db/connection');

exports.fetchComments = (
  article_id,
  { limit = 10, sort_by = 'created_at', sort_ascending = false, p = 1 }
) => {
  // determine sort order
  let sortOrder = 'desc';
  if (sort_ascending) {
    sortOrder = 'asc';
  }
  // pagination
  let offset = 0;
  if (p > 1) {
    offset = limit * (p - 1);
  }
  return connection
    .select('comment_id', 'votes', 'created_at', 'username as author', 'body')
    .from('comments')
    .where({ article_id })
    .limit(limit)
    .orderBy(sort_by, sortOrder)
    .offset(offset);
};

exports.addComment = (comment, article_id) => {
  return connection('comments')
    .insert({ ...comment, article_id })
    .returning('*');
};
