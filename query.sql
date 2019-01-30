\c nc_news_test;

SELECT articles.username AS author, articles.article_id, articles.title, articles.votes, articles.created_at, articles.topic, COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments
ON comments.article_id = articles.article_id
GROUP BY articles.article_id; 



--     .select(
--       'username as author',
--       'article_id',
--       'title',
--       'votes',
--       'body',
--       'created_at',
--       'topic'
--     )
--     .from('articles')
--     .where({ article_id });
-- };