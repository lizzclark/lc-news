const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');

app.use(bodyParser.json());
app.use('/api', apiRouter);

module.exports = app;
