// Importing modules
const { Sequelize, DataTypes } = require('sequelize');

// Database connection with dialect of postgres specifying the database we are using
// Port for my database is 5433
// Database name is discover
const sequelize = new Sequelize('kassem', 'postgres', '1159800', {
    host: 'localhost',
    dialect: 'postgres', // Change to your database dialect (e.g., postgres, sqlite)
    port: 5432, // Change to your database port
});

// Checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`Database connected to discover`);
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Connecting to models
db.users = require('./userModel')(sequelize, DataTypes);
db.incubator = require('./incubator')(sequelize, DataTypes);

// Defining the relationships between the models
db.users.hasMany(db.incubator);
db.incubator.belongsTo(db.users);

// Exporting the module
module.exports = db;
