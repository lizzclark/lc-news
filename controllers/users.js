const {
  fetchUsers,
  addUser,
  fetchUserByUsername,
  fetchArticlesByUser,
} = require('../models/users');

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => res.status(200).send({ users }))
    .catch(next);
};

exports.postUser = (req, res, next) => {
  addUser(req.body)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(err => {
      next({
        status: 400,
        message: 'invalid or duplicate user data',
      });
    });
};

exports.getUserByUsername = ({ params: { username } }, res, next) => {
  fetchUserByUsername(username)
    .then(([user]) => {
      if (user) res.status(200).send({ user });
      else return Promise.reject({ status: 404, message: 'user not found' });
    })
    .catch(next);
};

exports.getArticlesByUser = ({ params: { username } }, res, next) => {
  fetchArticlesByUser(username).then(articles => {
    res.status(200).send({ articles });
  });
};
