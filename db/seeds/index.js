const { topicData } = require('../data');

exports.seed = (connection, Promise) => {
  return connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.insert(topicData).into('topics'));
};
