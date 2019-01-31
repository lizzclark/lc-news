const endpoints = {
  '/api/topics': 'responds with a list of all topics',
  '/api/topics/:topic/articles': 'responds with all articles for a given topic',
  '/api/articles':
    'responds with all articles and a total_count of all articles',
  '/api/articles/:article_id': 'responds with the given article',
  '/api/articles/:article_id/comments':
    'responds with all the comments for a given article',
  '/api/articles/:article_id/comments/:comment_id':
    'responds with the given comment',
  '/api/users': 'responds with all users',
  '/api/users/:username': 'responds with the given user',
  '/api/users/:username/articles':
    'responds with all the articles by a given user, and a total_count of articles by that user',
};

module.exports = endpoints;
