const dbConfig = require('../knexfile');
const knex = require('knex');

module.exports = knex(dbConfig);
