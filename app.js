const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/apiRouter');
const { errorHandler, invalidPathHandler } = require('./errors');

app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use('/*', invalidPathHandler);
app.use(errorHandler);

module.exports = app;
