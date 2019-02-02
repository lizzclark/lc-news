const endpoints = {
  'GET /api/topics': 'Responds with a list of all topics.',
  'POST /api/topics':
    'Adds a new topic (provided in request body as a JSON object with slug and description properties. Slug must be unique). Responds with the added topic.',
  'GET /api/topics/:topic/articles':
    'Responds with all articles for a given topic, plus a total count of articles for that topic.',
  'POST /api/topics/:topic/articles':
    'Adds a new article to the given topic. Article is provided in the request body as a JSON object with title, body, and username properties (must be an existing username). Responds with the added article.',
  'GET /api/articles':
    'Responds with all articles, plus a total count of all articles.',
  'GET /api/articles/:article_id': 'Responds with the article specified.',
  'PATCH /api/articles/:article_id':
    'Updates votes on the specified article. Request body must contain a JSON object with property { inc_votes : n }, where n is a positive or negative number of new votes. Responds with the updated article.',
  'DELETE /api/articles/:article_id':
    'Deletes the specified article. Responds with 204 No Content.',
  'GET /api/articles/:article_id/comments':
    'Responds with all the comments for a given article.',
  'POST /api/articles/:article_id/comments':
    'Adds a comment to the specified article. Request body must contain a JSON object with body and username properties (username must be an existing user). Responds with the added comment.',
  'PATCH /api/articles/:article_id/comments/:comment_id':
    'Updates votes on the specified comment. Request body must contain a JSON object with property { inc_votes : n }, where n is a positive or negative number of new votes. Responds with the updated comment.',
  'GET /api/users': 'Responds with all users.',
  'POST /api/users':
    'Adds a new user. Request body must contain a JSON object with username, avatar_url and name properties (username must be unique). Responds with the added user.',
  'GET /api/users/:username': 'Responds with the given user.',
  'GET /api/users/:username/articles':
    'Responds with all the articles by a given user, and a total count of articles by that user.',
};

module.exports = endpoints;
