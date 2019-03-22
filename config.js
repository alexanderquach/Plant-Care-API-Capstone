'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/plants';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://testUser:testPassword1@ds139370.mlab.com:39370/node-js-capstone';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';