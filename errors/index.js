exports.errorHandler = (err, req, res, next) => {
  console.log('you graced the error handler with your presence');
  // 500 if this is an unhandled knex error
  if (err.code) {
    res
      .status(500)
      .send({ status: 500, message: 'sorry, something went wrong' });
  } else {
    // if this is an error defined by NC news, send it back with the relevant status
    const { message, status } = err;
    console.log(message);
    res.status(status).send({ message });
  }
};
