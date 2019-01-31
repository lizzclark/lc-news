\c nc_news_test;

SELECT articles.username AS author, articles.votes, articles.title, articles.article_id, articles.topic, articles.created_at,
COUNT(comments.comment_id) AS comment_count
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id 
WHERE articles.username = 'icellusedkars'
GROUP BY articles.article_id
;