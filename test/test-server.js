'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closerServer} = require('../server');
const {router: usersRouter} = require('../users');
const {router: authRouter} = require('../auth');
const {router: plantsRouter} = require('../plants');

const expect = chai.expect;

chai.use(chaiHttp);

describe('index page', function() {
  it('should exist', function() {
    return chai
      .request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});