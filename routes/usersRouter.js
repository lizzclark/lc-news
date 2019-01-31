const usersRouter = require('express').Router();
const {
  getUsers,
  postUser,
  getUserByUsername,
  getArticlesByUser,
} = require('../controllers/users');

usersRouter
  .route('/')
  .get(getUsers)
  .post(postUser);

usersRouter.get('/:username', getUserByUsername);

usersRouter.get('/:username/articles', getArticlesByUser);

module.exports = usersRouter;
