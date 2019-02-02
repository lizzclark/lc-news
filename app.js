const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const { errorHandler } = require('./errors');

app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use(errorHandler);

module.exports = app;
