const getComments = function(req, res, next) {
  console.log('getting comments for this article...');
};

const addComment = function(req, res, next) {
  console.log('adding a comment to this article...');
};

module.exports = { getComments, addComment };
