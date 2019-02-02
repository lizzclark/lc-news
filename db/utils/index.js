const createRefObj = (list, key, value) => {
  // this function is designed to be passed a list of objects
  // it creates a single reference object full of key-value pairs
  // one pair for each element in the list
  // the key will be the second property passed in
  // the value will be the third property passed in
  return list.reduce((acc, curr) => {
    acc[curr[key]] = curr[value];
    return acc;
  }, {});
};

const formatArticles = articles => {
  return articles.map(
    ({ title, topic, body, votes, created_at, created_by }) => {
      const newArticle = {
        title,
        topic,
        body,
        votes,
        created_at: new Date(created_at),
        username: created_by,
      };
      return newArticle;
    }
  );
};

const formatComments = (comments, articles) => {
  const articleLookupInfo = createRefObj(articles, 'title', 'article_id');
  return comments.map(({ body, votes, created_by, created_at, belongs_to }) => {
    const newComment = {
      body,
      votes,
      username: created_by,
      created_at: new Date(created_at),
      // look up the article that the comment belongs_to to get its ID
      article_id: articleLookupInfo[belongs_to],
    };
    return newComment;
  });
};

module.exports = { createRefObj, formatArticles, formatComments };
