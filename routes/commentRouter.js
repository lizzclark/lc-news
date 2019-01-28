const commentRouter = require('express').Router();
const { getComments } = require('../controllers/comments');

commentRouter.route('/').get(() => {
  console.log('got inside this function');
});

module.exports = commentRouter;
