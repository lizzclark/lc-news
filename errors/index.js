exports.errorHandler = (err, req, res, next) => {
  // 500 if this is an unhandled knex error
  if (err.code) {
    res
      .status(500)
      .send({ status: 500, message: 'sorry, something went wrong' });
  } else {
    // if this is an error defined by NC news, send it back with the relevant status
    const { message, status } = err;
    res.status(status).send({ status, message });
  }
};

exports.invalidPathHandler = (req, res, next) => {
  res.status(404).send({
    status: 404,
    message:
      'Invalid path - no such endpoint. GET /api for a list of valid endpoints and descriptions',
  });
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ status: 405, message: 'method not allowed!' });
};
