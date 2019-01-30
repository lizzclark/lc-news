const connection = require('../db/connection');

exports.fetchComments = (
  article_id,
  { limit = 10, sort_by = 'created_at' }
) => {
  return connection
    .select('comment_id', 'votes', 'created_at', 'username as author', 'body')
    .from('comments')
    .where({ article_id })
    .limit(limit)
    .orderBy(sort_by, 'desc');
};
