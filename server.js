//importing modules
const express = require('express');
const sequelize = require('sequelize');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./Models');
const userRoutes = require('./Routes/userRoutes');
const incubatorRoute = require('./Routes/incubatorRoute');
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
// cors 
const cors = require('cors');

//setting up your port
const PORT = process.env.PORT || 8080;

//assigning the variable app to express
const app = express();
// cors
app.use(cors());
app.options('*', cors());

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Swagger set up with jwt token

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Incubator API",
      version: "1.0.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      contact: {
        name: "Incubator API"
      },
      servers: ["http://localhost:8080"]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./Routes/*.js"]
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));


//synchronizing the database and forcing it to false so we don't lose data
db.sequelize.sync({ force: false }).then(() => {
  console.log("db has been re synced");
});



//routes for the user API
app.use('/api', userRoutes);
app.use('/api', incubatorRoute); // Use incubator routes


//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
