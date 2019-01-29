const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');

app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use((err, req, res, next) => {
  const { message, status } = err;
  console.log('you graced the error handler with your presence');
  console.log(err);
  res.status(status).send({ message });
});

module.exports = app;
