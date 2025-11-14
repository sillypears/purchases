'use strict';

const path = require('path');

module.exports = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Keyboard Purchase',
      version: '1.0.0',
    },
  },
  apis: [path.join(__dirname, 'routes/api.js')]
};