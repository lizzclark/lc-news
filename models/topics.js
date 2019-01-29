const connection = require('../db/connection');

exports.fetchTopics = () => {
  return connection.select('*').from('topics');
};

exports.addTopic = newTopic => {
  return connection
    .insert(newTopic)
    .into('topics')
    .returning('*');
};
