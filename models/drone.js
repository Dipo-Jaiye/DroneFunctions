const { DataTypes, Model, } = require('sequelize');
const { dbInstance, } = require("../db");

const attributes = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    serialNumber: {
        type: DataTypes.STRING(100),
        unique: true,
        validate: {
            max: 100,
        }
    },
    modelType: {
        type: DataTypes.STRING,
        isIn: [['Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight']],
    },
    weightLimit: {
        type: DataTypes.INTEGER,
        validate: {
            max:500,
        }
    },
    batteryCapacitiy: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
        validate: {
            max: 100,
            min: 0,
        }
    },
    droneState: {
        type: DataTypes.STRING,
        defaultValue: 'IDLE',
        isIn: [['IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING']],
    },
};

class Drone extends Model {
    addMedication(){

    }

    removeMedication(){

    }

    getCurrentWeight(){

    }

    canTakeMedication(){

    }

    getBatteryLevel(){

    }
}

const sequelizeOptions = {
    sequelize: dbInstance,
}

Drone.init(attributes, sequelizeOptions);

module.exports = Drone;