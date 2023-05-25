//add db implementation here
// this should create the db and connect it
// sync the models after connecting
// expose the db instance to use in models
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/database.sqlite'
});

module.exports = {
    dbInstance: sequelize,
    connect: async () => {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false;
        }
        const models = require("../models");
        await sequelize.sync();
        console.log('Models synced');
        return 1;
    },
}