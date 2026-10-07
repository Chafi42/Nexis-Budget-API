const swaggerJSDoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NexisBudget API',
      version: '1.0.0',
      description: 'API REST pour la gestion de budget personnel avec Node.js, Express et MongoDB.',
      contact: {
        name: 'Chafi',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './server.js'],
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec