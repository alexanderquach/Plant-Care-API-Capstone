'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;
chai.use(chaiHttp);

function teardownDb() {
  return mongoose.connection.dropDatabase();
}

describe('Users', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  // afterEach(function() {
  //   return teardownDb();
  // });
  after(function() {
    teardownDb();
    return closeServer();
  });

  const testUser = {username: 'username', password: 'testPassword'}

  it('should post a new user', function() {
    return chai.request(app)
    .post('/users/signup')
    .send(testUser)
    .then(function(res) {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
    });
  });

  it('should find users', function() {
    return chai.request(app)
    .get('/users')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length.of.at.least(1);
    });
  });

  it('should find a specifc user', function() {
    return chai.request(app)
    .get(`/users/${testUser.username}`)
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys('username');
    });
  });

  const testMessage = {
    username: `${testUser.username}`,
    message: 'test message',
    recipient: `${testUser.username}`
  }

  it('should post a message', function() {
    return chai.request(app)
    .post('/users/messages')
    .send(testMessage)
    .then(function(res) {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys('message', 'recipient');
    });
  });

  it('should find user messages', function() {
    return chai.request(app)
    .get(`/users/messages/${testUser.username}`)
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
    });
  });
});