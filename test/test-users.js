'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;
chai.use(chaiHttp);

function teardownDb() {
  return mongoose.connection.dropDatabase();
}

let authUser = {username: 'authUser', password: 'authpassword'};
let token;

describe('Users', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL)
    .then(() => 
    chai.request(app)
    .post('/users/signup')
    .send(authUser)
    .then(() => {
      return chai.request(app)
      .post('/auth/login')
      .send(authUser)
      .then((res) => {
        token = res.body.authToken;
      })
    }))
  });
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
    username: `${authUser.username}`,
    messageBody: 'test message',
    recipient: `${testUser.username}`
  }

  it('should post a message', function() {
    return chai.request(app)
    .post('/users/messages')
    .set('Authorization', `Bearer ${token}`)
    .send(testMessage)
    .then(function(res) {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys('messageBody', 'recipient');
    });
  });

  it('should find user messages', function() {
    return chai.request(app)
    .get(`/users/messages/${testUser.username}`)
    .set('Authorization', `Bearer ${token}`)
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
    });
  });
});