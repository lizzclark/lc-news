process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const connection = require('../db/connection');

describe('NC news', () => {
  // after(connection.destroy());
  describe('/api', () => {
    it('GET / 200 & responds with ...', () => {
      // expect...
    });
  });
  describe('/api/topics', () => {
    it('GET /topics 200 & responds with...', () => {
      // expect...
    });
  });
});
