const endpoints = {
  '/api/topics': {
    GET: { description: 'Responds with a list of all topics.' },
    POST: {
      description:
        'Adds a new topic (provided in request body as a JSON object with slug and description properties. Slug must be unique). Responds with the added topic.',
    },
  },
  '/api/topics/:topic/articles': {
    GET: {
      description:
        'Responds with all articles for a given topic, plus a total count of articles for that topic.',
      queries: {
        limit: 'Limits the results shown. Defaults to 10 if not provided.',
        sort_by:
          'Must be a property of the articles. Defaults to created_at if not provided.',
        order: 'Accepts asc or desc. Defaults to desc if not provided.',
        p:
          'Works with any given limit (default is 10) to serve pages of results. Defaults to page 1 if not provided.',
      },
    },
    POST: {
      description:
        'Adds a new article to the given topic. Article is provided in the request body as a JSON object with title, body, and username properties (must be an existing username). Responds with the added article.',
    },
  },
  '/api/articles': {
    GET: {
      description:
        'Responds with all articles, plus a total count of all articles.',
      queries: {
        limit: 'Limits the results shown. Defaults to 10 if not provided.',
        sort_by:
          'Must be a property of the articles. Defaults to created_at if not provided.',
        order: 'Accepts asc or desc. Defaults to desc if not provided.',
        p:
          'Works with any given limit (default is 10) to serve pages of results. Defaults to page 1 if not provided.',
      },
    },
  },
  '/api/articles/:article_id': {
    GET: {
      description: 'Responds with the article specified.',
    },
    PATCH: {
      description:
        'Updates votes on the specified article. Request body must contain a JSON object with property { inc_votes : n }, where n is a positive or negative number of new votes. Responds with the updated article.',
    },
    DELETE: {
      description:
        'Deletes the specified article. Responds with 204 No Content.',
    },
  },
  '/api/articles/:article_id/comments': {
    GET: {
      description: 'Responds with all the comments for a given article.',
      queries: {
        limit: 'Limits the results shown. Defaults to 10 if not provided.',
        sort_by:
          'Must be a property of the comments. Defaults to created_at if not provided.',
        order: 'Accepts asc or desc. Defaults to desc if not provided.',
        p:
          'Works with any given limit (default is 10) to serve pages of results. Defaults to 1 if not provided.',
      },
    },
    POST: {
      description:
        'Adds a comment to the specified article. Request body must contain a JSON object with body and username properties (username must be an existing user). Responds with the added comment.',
    },
  },
  '/api/articles/:article_id/comments/:comment_id': {
    PATCH: {
      description:
        'Updates votes on the specified comment. Request body must contain a JSON object with property { inc_votes : n }, where n is a positive or negative number of new votes. Responds with the updated comment.',
    },
    DELETE: {
      description:
        'Deletes the specified comment. Responds with 204 No Content.',
    },
  },
  '/api/users': {
    GET: {
      description: 'Responds with all users.',
    },
    POST: {
      description:
        'Adds a new user. Request body must contain a JSON object with username, avatar_url and name properties (username must be unique). Responds with the added user.',
    },
  },
  '/api/users/:username': {
    GET: {
      description: 'Responds with the given user.',
    },
  },
  '/api/users/:username/articles': {
    GET: {
      description:
        'Responds with all the articles by a given user, and a total count of articles by that user.',
      queries: {
        limit: 'Limits the results shown. Defaults to 10 if not provided.',
        sort_by:
          'Must be a property of the articles. Defaults to created_at if not provided.',
        order: 'Accepts asc or desc. Defaults to desc if not provided.',
        p:
          'Works with any given limit (default is 10) to serve pages of results. Defaults to page 1 if not provided.',
      },
    },
  },
};

module.exports = endpoints;
