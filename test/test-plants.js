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

function seedPlantData() {
  const seedData = [];
  for (let i = 0; i < 10; i++) {
    seedData.push(generatePlantData())
  }
  return Plant.insertMany(seedData)
};

function generatePlantData() {
  return {
    icon: '021-bonsai',
    name: faker.random.word(),
    wateringRequirements: 'test watering requirements',
    sunlightRequirements: 'test sunlight requirements',
    notes: faker.lorem.sentence(),
    username: 'authUser'
  }
};

function teardownDb() {
  return mongoose.connection.dropDatabase();
};

let authUser = {username: 'authUser', password: 'authpassword'};
let token;

describe('Plants endpoints', function() {
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
          console.log(authUser, token)
        })
    }))
    .then(() => {
      seedPlantData();
    })
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
      expect(res).to.be.a('object');
      expect(res.body).to.be.a('array');
      expect(res.body[0]).to.include.keys('icon', 'name', 'wateringRequirements', 'sunlightRequirements')
    });
  });

  it('should post a plant', function() {
    const newPlant = generatePlantData();
    return chai.request(app)
    .post('/plants/new')
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
    const deletePlant = generatePlantData();
    return Plant.findOne()
    .then(function(plant){
      deletePlant.id = plant._id;
      return chai.request(app)
      .delete(`/plants/${deletePlant.id}`)
      .set('Authorization', `Bearer ${token}`)
    })
    .then(function(res) {
      expect(res).to.have.status(204);
    });
  });
})