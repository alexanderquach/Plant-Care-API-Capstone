'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');
const {User} = require('../users');
const {Plant} = require('../plants');

const expect = chai.expect;
chai.use(chaiHttp);

function createTestUser() {
  const user = {username: 'testUsername', password: 'testPassword'};
  return User.create(user);
};

let testUser;
let token;

function seedPlantData() {
  return createTestUser()
    .then(function(_user) {
      testUser = _user;
      const seedData = [];
      for (let i = 0; i < 10; i++) {
        seedData.push(generatePlantData(testUser))
      }
      return Plants.insertMany(seedData)
    });
};

function generatePlantData() {
  return {
    icon: '021-bonsai',
    name: faker.random.word(),
    wateringRequirements: 'test watering requirements',
    sunlightRequirements: 'test sunlight requirements',
    notes: faker.lorem.sentence(),
    username: 'testUsername'
  }
};

function teardownDb() {
  return mongoose.connection.dropDatabase();
};

describe('Plants endpoints', function() {
  before(function() {
    seedPlantData();
    token = jwt.sign({testUser}, JWT_SECRET, {subject: testUser.username});
    return runServer(TEST_DATABASE_URL);
  });
  after(function() {
    teardownDb();
    return closeServer();
  });

  it('should get all plants of the user', function() {
    return chai.request(app)
    .get('/plants/allPlants')
    .set('Authorization', `Bearer ${token}`)
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res).to.be.a('array');
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys('icon', 'name', 'wateringRequirements', 'sunlightRequirements')
    });
  });

  it('should post a plant', function() {
    const newPlant = generatePlantData();
    return chai.request(app)
    .post('/new')
    .set('Authorization', `Bearer ${token}`)
    .send(newPlant)
    .then(function(res) {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res).to.be.a('object');
      expect(res.body).to.include.keys('icon', 'name', 'wateringRequirements', 'sunlightRequirements');
      expect(res.body.name).to.equal(newPlant.name);
      expect(res.body.wateringRequirements).to.equal(newPlant.wateringRequirements);
      expect(res.body.sunlightRequirements).to.equal(newPlant.sunlightRequirements);
    });
  });

  it('should update a plant', function() {
    const updatePlant = generatePlantData();
    return Plant.findOne()
    .then(function(plant) {
      updatePlant.id = plant.id;
      return chai.request(app)
      .put(`/plants/${plant.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatePlant)
    })
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
    });
  });

  it('should delete a plant', function() {
    let deletePlant;
    return Plant.findOne()
    .then(function(plant){
      deletePlant.id = plant.id;
      return chai.request(app)
      .delete(`/plants/${deletePlant.id}`)
      .set('Authorization', `Bearer ${token}`)
    })
    .then(function(res) {
      expect(res).to.have.status(204);
    });
  });
})