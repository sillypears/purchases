const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swaggerDef');

console.log(swaggerDefinition)
const options = {
  swaggerDefinition,
  apis: ['./routes/api.js']
};

const openapiSpecification = swaggerJsdoc(options);