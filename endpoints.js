const endpoints = {
  '/api/topics': {
    GET: 'Responds with a list of all topics.',
    POST:
      'Adds a new topic (provided in request body as a JSON object with slug and description properties. Slug must be unique). Responds with the added topic.',
  },
  '/api/topics/:topic/articles': {
    GET:
      'Responds with all articles for a given topic, plus a total count of articles for that topic.',
    POST:
      'Adds a new article to the given topic. Article is provided in the request body as a JSON object with title, body, and username properties (must be an existing username). Responds with the added article.',
  },
  '/api/articles': {
    GET: 'Responds with all articles, plus a total count of all articles.',
  },
  '/api/articles/:article_id': {
    GET: 'Responds with the article specified.',
    PATCH:
      'Updates votes on the specified article. Request body must contain a JSON object with property { inc_votes : n }, where n is a positive or negative number of new votes. Responds with the updated article.',
    DELETE: 'Deletes the specified article. Responds with 204 No Content.',
  },
  '/api/articles/:article_id/comments': {
    GET: 'Responds with all the comments for a given article.',
    POST:
      'Adds a comment to the specified article. Request body must contain a JSON object with body and username properties (username must be an existing user). Responds with the added comment.',
  },
  '/api/articles/:article_id/comments/:comment_id': {
    PATCH:
      'Updates votes on the specified comment. Request body must contain a JSON object with property { inc_votes : n }, where n is a positive or negative number of new votes. Responds with the updated comment.',
    DELETE: 'Deletes the specified comment. Responds with 204 No Content.',
  },
  '/api/users': {
    GET: 'Responds with all users.',
    POST:
      'Adds a new user. Request body must contain a JSON object with username, avatar_url and name properties (username must be unique). Responds with the added user.',
  },
  '/api/users/:username': { GET: 'Responds with the given user.' },
  '/api/users/:username/articles': {
    GET:
      'Responds with all the articles by a given user, and a total count of articles by that user.',
  },
};

module.exports = endpoints;
